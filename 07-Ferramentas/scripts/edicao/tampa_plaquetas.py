"""Tampa placa e plaqueta/nome de loja quadro a quadro, de forma discreta (decisão do Samuel, 25/11/2026).

Por que não usa só o OCR: o leitor de texto perde as plaquetas escuras e as placas de lado, e a tarja some.
Aqui quem marca é a pessoa (ou o Claude olhando o quadro): uma ou mais "sementes" por trecho em que a plaqueta aparece.
Cada semente é o quadrilátero da área a tampar (4 cantos, em pixels do clipe) num instante.

1. Rastreio: a partir de cada semente, segue a região para frente e para trás com fluxo óptico (Lucas-Kanade)
   em pontos da plaqueta e do para-choque em volta, e estima uma transformação afim por RANSAC.
   Para quando a região sai do quadro ou o rastreio perde confiança. Entre duas sementes, mistura as duas
   trilhas pelo tempo (sem salto).
2. Preenchimento: dentro do quadrilátero, a cor de fundo da própria plaqueta (a cor dominante), com o degradê de luz
   ajustado (plano), o grão da imagem e borda suave de 2 px. Resultado: plaqueta lisa, sem nome, sem caixa preta
   e sem borrão. Nada fora do quadrilátero é tocado.
3. Suavização no tempo da cor e da posição (evita tremor).

Segmento com "segurar": true usa a área da semente parada de "de" a "ate" (quadros de transição com clarão).
sementes.json: {"segmentos": [{"sementes": [{"t": 4.0, "q": [[x,y],[x,y],[x,y],[x,y]]}, ...],
                               "de": 1.8, "ate": 6.6}]}   ("de"/"ate" opcionais: limite do trecho em segundos)
Uso: py -3 tampa_plaquetas.py <clipe.mp4> <sementes.json> <saida.mp4> [--debug]
  --debug desenha o contorno em vez de tampar (para conferir o rastreio).
Grava também <saida>.quads.json (quadrilátero por quadro) para a conferência.
"""
import os as _os, sys as _sys
_sys.path[:] = [x for x in _sys.path if _os.path.abspath(x or ".") != _os.path.dirname(_os.path.abspath(__file__))]
import json, subprocess, sys

import cv2
import numpy as np


def info(arq):
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                                   "stream=width,height,r_frame_rate:format=duration", "-of", "json", arq],
                                  capture_output=True, text=True).stdout)
    s = j["streams"][0]; n, d = s["r_frame_rate"].split("/")
    return s["width"], s["height"], float(n) / float(d)


def ler(arq, w, h, cinza=True):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", arq, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
    n = w * h * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        f = np.frombuffer(b, np.uint8).reshape(h, w, 3)
        yield cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) if cinza else f.copy()


def aplicar(A, pts):
    return pts @ A[:, :2].T + A[:, 2]


def achar_cortes(cinza):
    """Quadros que começam uma tomada nova (corte seco ou transição): o rastreio não atravessa."""
    peq = [cv2.resize(g, (90, 160)).astype(np.float32) for g in cinza]
    d = np.array([0.0] + [np.abs(peq[i] - peq[i - 1]).mean() for i in range(1, len(peq))])
    lim = max(25.0, 4 * float(np.median(d[1:])) if len(d) > 1 else 25.0)
    return {i for i in range(1, len(d)) if d[i] > lim}


CORTES = set()


def trilha(cinza, k0, q0, passo, kmin, kmax):
    """Segue o quadrilátero q0 (no quadro k0) quadro a quadro, sem atravessar corte. Devolve {k: quad}."""
    h, w = cinza[0].shape
    q0 = np.float32(q0)
    c = q0.mean(0)
    area = (q0 - c) * 2.4 + c  # região de pontos: a plaqueta e o entorno rígido (para-choque)
    mask = np.zeros((h, w), np.uint8); cv2.fillPoly(mask, [np.int32(area)], 255)
    p_ref = cv2.goodFeaturesToTrack(cinza[k0], 300, 0.005, 3, mask=mask)
    if p_ref is None:
        return {k0: q0}
    p_ref = p_ref.reshape(-1, 2)
    p_cur = p_ref.copy()
    A = np.float32([[1, 0, 0], [0, 1, 0]])
    out = {k0: q0}
    k = k0
    lk = dict(winSize=(25, 25), maxLevel=4, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 30, 0.01))
    while kmin <= k + passo <= kmax:
        a, b = cinza[k], cinza[k + passo]
        p1, st, _ = cv2.calcOpticalFlowPyrLK(a, b, p_cur.reshape(-1, 1, 2), None, **lk)
        p0r, st2, _ = cv2.calcOpticalFlowPyrLK(b, a, p1, None, **lk)
        fb = np.linalg.norm(p0r.reshape(-1, 2) - p_cur, axis=1)
        ok = (st.ravel() == 1) & (st2.ravel() == 1) & (fb < 1.0)
        p_ref, p_cur = p_ref[ok], p1.reshape(-1, 2)[ok]
        if len(p_ref) < 10:
            break
        A2, inl = cv2.estimateAffine2D(p_ref, p_cur, method=cv2.RANSAC, ransacReprojThreshold=2.0, maxIters=3000, confidence=0.995)
        if A2 is None or inl.sum() < 10:
            break
        inl = inl.ravel() == 1
        # confere a aparência: a região do quadro anterior, movida pela transformação, tem que bater com o quadro novo
        # (corte de cena = não bate -> para; transição rápida da mesma cena = bate -> continua)
        Ai_old = np.vstack([cv2.invertAffineTransform(A), [0, 0, 1]])
        B = (np.vstack([A2, [0, 0, 1]]) @ Ai_old)[:2].astype(np.float32)
        qn = aplicar(A2.astype(np.float32), q0); cn = qn.mean(0)
        mm = np.zeros((h, w), np.uint8); cv2.fillPoly(mm, [np.int32((qn - cn) * 1.6 + cn)], 255)
        if mm.sum() > 255 * 50:
            wa = cv2.warpAffine(a, B, (w, h))
            va, vb = wa[mm > 0].astype(np.float32), b[mm > 0].astype(np.float32)
            if va.std() > 2 and vb.std() > 2 and np.corrcoef(va, vb)[0, 1] < 0.45:
                break
        p_ref, p_cur = p_ref[inl], p_cur[inl]
        A = A2.astype(np.float32)
        k += passo
        q = aplicar(A, q0)
        cq = q.mean(0)
        if not (-0.15 * w < cq[0] < 1.15 * w and -0.15 * h < cq[1] < 1.15 * h):
            break
        out[k] = q
        # repõe pontos quando ficam poucos (a região muda de aparência girando a câmera)
        if len(p_cur) < 60:
            m = np.zeros((h, w), np.uint8); cv2.fillPoly(m, [np.int32((q - cq) * 2.4 + cq)], 255)
            novos = cv2.goodFeaturesToTrack(cinza[k], 300, 0.005, 3, mask=m)
            if novos is not None:
                novos = novos.reshape(-1, 2)
                Ai = cv2.invertAffineTransform(A)
                p_cur = np.vstack([p_cur, novos]); p_ref = np.vstack([p_ref, aplicar(Ai, novos)])
    return out


def quads_por_quadro(cinza, fps, segmentos):
    n = len(cinza)
    final = {}
    for seg in segmentos:
        kmin = max(0, int(round(seg.get("de", 0) * fps)))
        kmax = min(n - 1, int(round(seg.get("ate", n / fps) * fps)))
        sem = sorted(seg["sementes"], key=lambda s: s["t"])
        if seg.get("segurar"):  # transição (clarão, desfoque): a área fica parada onde estava
            for k in range(kmin, kmax + 1):
                final[k] = np.float32(sem[0]["q"])
            continue
        tr = []
        for s in sem:
            k0 = min(max(int(round(s["t"] * fps)), kmin), kmax)
            fw = trilha(cinza, k0, s["q"], +1, kmin, kmax)
            bw = trilha(cinza, k0, s["q"], -1, kmin, kmax)
            tr.append((k0, {**bw, **fw}))
        for k in range(kmin, kmax + 1):
            cand = []
            for i, (k0, d) in enumerate(tr):
                if k in d:
                    cand.append((abs(k - k0), k0, d[k]))
            if not cand:
                continue
            # entre duas sementes (uma antes, outra depois): mistura linear pelo tempo
            antes = [c for c in cand if c[1] <= k]; depois = [c for c in cand if c[1] >= k]
            if antes and depois:
                a = min(antes, key=lambda c: c[0]); b = min(depois, key=lambda c: c[0])
                if a[1] == b[1]:
                    final[k] = a[2]
                else:
                    wb = (k - a[1]) / (b[1] - a[1])
                    final[k] = (1 - wb) * a[2] + wb * b[2]
            else:
                final[k] = min(cand, key=lambda c: c[0])[2]
    # suaviza a posição no tempo (média móvel de 5 quadros dentro de cada trecho contínuo)
    ks = sorted(final)
    tomada = np.cumsum([1 if i in CORTES else 0 for i in range(n)])
    suave = {}
    for k in ks:
        # só suaviza tremor pequeno: em movimento rápido (transição) a média atrasaria a área
        viz = [final[j] for j in range(k - 2, k + 3) if j in final and tomada[j] == tomada[k]
               and np.abs(final[j] - final[k]).max() < 4]
        suave[k] = np.mean(viz, 0)
    return suave


def cor_plaqueta(img, q, fora=False):
    """Plano de cor (degradê de luz) e grão do FUNDO da plaqueta, medidos só dentro do quadrilátero.
    fora=True (adesivo, logo solto): mede no anel EM VOLTA da área (o que estaria atrás do adesivo)."""
    h, w = img.shape[:2]
    qm = (q - q.mean(0)) * 1.7 + q.mean(0) if fora is True else q
    x0, y0 = np.floor(qm.min(0)).astype(int); x1, y1 = np.ceil(qm.max(0)).astype(int)
    x0, y0 = max(0, x0), max(0, y0); x1, y1 = min(w, x1), min(h, y1)
    if x1 - x0 < 3 or y1 - y0 < 3:
        return None
    m = np.zeros((y1 - y0, x1 - x0), np.uint8)
    cv2.fillPoly(m, [np.int32(np.round(q - [x0, y0]))], 255)
    reg = img[y0:y1, x0:x1].astype(np.float32)
    lab = cv2.cvtColor(img[y0:y1, x0:x1], cv2.COLOR_BGR2LAB).astype(np.float32)
    dentro = m > 0
    if fora is True:
        m2 = np.zeros_like(m); cv2.fillPoly(m2, [np.int32(np.round(qm - [x0, y0]))], 255)
        m3 = cv2.dilate(m, np.ones((5, 5), np.uint8))
        dentro = (m2 > 0) & (m3 == 0)
    if dentro.sum() < 10:
        return None
    if fora == "escuro":  # letreiro com letra clara sobre fundo escuro/colorido: o fundo é a parte mais escura
        L = lab[..., 0]
        dentro = dentro & (L <= np.median(L[dentro]))
    fundo = np.median(lab[dentro], 0)
    d = np.linalg.norm(lab - fundo, axis=2)
    sel = dentro & (d < 14)
    if sel.sum() < 10:
        sel = dentro
    ys, xs = np.nonzero(sel)
    cx, cy = q.mean(0)
    # coordenadas RELATIVAS ao centro da área: assim a média entre quadros (suavização) não desanda a cor
    X = np.c_[np.ones_like(xs), xs + x0 - cx, ys + y0 - cy].astype(np.float32)
    coef = np.linalg.lstsq(X, reg[ys, xs], rcond=None)[0]  # 3x3: [cor no centro, inclinação x, inclinação y] por canal
    coef[1:] = np.clip(coef[1:], -1.5, 1.5)  # degradê de luz suave, nunca uma rampa forte
    resid = reg[ys, xs] - X @ coef
    return coef, float(np.clip(resid.std() * 0.6, 0.4, 2.5))


def reconstruir(img, q):
    """Adesivo solto em vidro/lataria: reconstrói a área pelas bordas (inpainting só na área justa)."""
    h, w = img.shape[:2]
    pad = 12
    x0, y0 = np.floor(q.min(0)).astype(int) - pad; x1, y1 = np.ceil(q.max(0)).astype(int) + pad
    x0, y0 = max(0, x0), max(0, y0); x1, y1 = min(w, x1), min(h, y1)
    if x1 - x0 < 3 or y1 - y0 < 3:
        return
    m = np.zeros((y1 - y0, x1 - x0), np.uint8)
    cv2.fillPoly(m, [np.int32(np.round(q - [x0, y0]))], 255)
    m = cv2.dilate(m, np.ones((3, 3), np.uint8))
    reg = img[y0:y1, x0:x1]
    novo = cv2.inpaint(reg, m, 6, cv2.INPAINT_NS).astype(np.float32)
    a = cv2.GaussianBlur(m.astype(np.float32) / 255, (0, 0), 1.2)[..., None]
    img[y0:y1, x0:x1] = np.clip(reg * (1 - a) + novo * a, 0, 255).astype(np.uint8)


def tampar(img, q, coef, grao, rng):
    h, w = img.shape[:2]
    pad = 4
    x0, y0 = np.floor(q.min(0)).astype(int) - pad; x1, y1 = np.ceil(q.max(0)).astype(int) + pad
    x0, y0 = max(0, x0), max(0, y0); x1, y1 = min(w, x1), min(h, y1)
    if x1 - x0 < 3 or y1 - y0 < 3:
        return
    # máscara em resolução 4x para borda sem serrilhado, depois borda suave de ~1,5 px
    S = 4
    m = np.zeros(((y1 - y0) * S, (x1 - x0) * S), np.uint8)
    cv2.fillPoly(m, [np.int32(np.round((q - [x0, y0]) * S))], 255)
    m = cv2.resize(m, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    m = cv2.GaussianBlur(m, (0, 0), 0.9)[..., None]
    yy, xx = np.mgrid[y0:y1, x0:x1]
    cx, cy = q.mean(0)
    base = coef[0] + ((xx - cx)[..., None] * coef[1]) + ((yy - cy)[..., None] * coef[2])
    ruido = cv2.GaussianBlur(rng.normal(0, grao, (y1 - y0, x1 - x0)).astype(np.float32), (0, 0), 0.6)[..., None]
    novo = np.clip(base + ruido, 0, 255)
    reg = img[y0:y1, x0:x1].astype(np.float32)
    img[y0:y1, x0:x1] = np.clip(reg * (1 - m) + novo * m, 0, 255).astype(np.uint8)


def main():
    arq, semj, saida = sys.argv[1:4]
    debug = "--debug" in sys.argv
    w, h, fps = info(arq)
    cinza = list(ler(arq, w, h, True))
    CORTES.update(achar_cortes(cinza))
    cfg = json.load(open(semj, encoding="utf-8"))
    # vários objetos (plaqueta da frente, da traseira, placa...): cada um é uma lista de segmentos
    objetos = cfg["objetos"] if "objetos" in cfg else [cfg["segmentos"]]
    # objeto = lista de segmentos, ou {"fundo": "fora", "segmentos": [...]} para adesivo (reconstrói pelo entorno),
    # ou {"fundo": "escuro", ...} para letreiro de letra clara (preenche com a cor escura do próprio letreiro)
    foras = [(True if o.get("fundo") == "fora" else o.get("fundo")) if isinstance(o, dict) else None for o in objetos]
    objetos = [o["segmentos"] if isinstance(o, dict) else o for o in objetos]
    todos = [quads_por_quadro(cinza, fps, segs) for segs in objetos]
    del cinza
    # cor por quadro, suavizada no tempo (mediana de 7 quadros, dentro da mesma tomada)
    tomada = np.cumsum([1 if i in CORTES else 0 for i in range(10 ** 5)])
    fr = list(ler(arq, w, h, False))
    cores = []
    for qq, fora in zip(todos, foras):
        c = {}
        for k, q in qq.items():
            r = cor_plaqueta(fr[k], q, fora)
            if r:
                c[k] = r
        cs = {}
        for k in c:
            viz = [c[j] for j in range(k - 7, k + 8) if j in c and tomada[j] == tomada[k]]
            cs[k] = (np.median([v[0] for v in viz], 0), float(np.median([v[1] for v in viz])))
        cores.append(cs)
    rng = np.random.default_rng(7)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", f"{fps:.5f}",
                          "-i", "-", "-i", arq, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "14", "-preset", "medium",
                          "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest", saida], stdin=subprocess.PIPE)
    reg = {}
    for k, img in enumerate(fr):
        for i, (qq, cs, fora) in enumerate(zip(todos, cores, foras)):
            if k in qq:
                reg.setdefault(k, [None] * len(todos))[i] = np.round(qq[k], 1).tolist()
                if debug:
                    cv2.polylines(img, [np.int32(np.round(qq[k]))], True, (0, 0, 255), 1)
                elif fora is True:
                    reconstruir(img, qq[k])
                elif k in cs:
                    tampar(img, qq[k], cs[k][0], cs[k][1], rng)
        p.stdin.write(img.tobytes())
    p.stdin.close(); p.wait()
    json.dump({"fps": fps, "quads": reg}, open(saida + ".quads.json", "w"))
    print(_os.path.basename(arq), f"quadros tampados: {len(reg)} de {len(fr)}")


if __name__ == "__main__":
    main()
