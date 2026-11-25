"""SUBSTITUÍDO em 25/11/2026 por tampa_plaquetas.py (este apaga só os traços do texto e falha em plaqueta escura e adesivo).
Apaga placa e nome/telefone de outra loja de forma imperceptível (decisão do Samuel, 25/11/2026).

1. Âncoras: as leituras do OCR (arquivo de detecta_placas.py, caixas em 1080 de largura).
2. Rastreio quadro a quadro: entre as leituras, segue a mesma região por comparação de imagem (template),
   para frente e para trás, até 4 s depois da última leitura ou até a região sumir (confiança baixa).
3. Preenchimento: inpainting (OpenCV Telea) na área com margem e borda suave, sem caixa preta.
Saída: o clipe limpo, mesma resolução e áudio original (o editar_reel.py troca a música depois).

Uso: py -3 cobre_placas.py <clipe.mp4> <placas.json> <saida.mp4>
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
    return s["width"], s["height"], float(n) / float(d), float(j["format"]["duration"])


def ler_quadros(arq, w, h):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", arq, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE)
    fr = []
    while True:
        b = p.stdout.read(w * h * 3)
        if len(b) < w * h * 3:
            break
        fr.append(np.frombuffer(b, np.uint8).reshape(h, w, 3).copy())
    return fr


def ancoras(placas, w, fps, n):
    """Caixa de OCR por quadro (coordenadas do clipe), com margem para pegar a plaqueta inteira."""
    esc = w / 1080.0
    a = {}
    for c in json.load(open(placas))["caixas"]:
        k = int(round(((c["t0"] + c["t1"]) / 2) * fps))
        if 0 <= k < n:
            # volta à caixa justa do TEXTO (o detecta_placas.py grava com margem 1,5x largura e 2,2x altura)
            tw, th = c["w"] / 1.5, c["h"] / 2.2
            tx, ty = c["x"] + 0.25 * tw, c["y"] + 0.6 * th
            if c.get("manual"):
                tx, ty, tw, th = c["x"], c["y"], c["w"], c["h"]
            # cobre o texto + o logo que costuma vir à esquerda, com folga pequena (tampa o nome, não a plaqueta inteira)
            pad = 0.35 * th
            a.setdefault(k, []).append([(tx - pad - 3.2 * th) * esc, (ty - pad) * esc, (tw + 2 * pad + 3.2 * th) * esc, (th + 2 * pad) * esc])
    return a


def seguir(fr, k0, box, passo, limite):
    """Segue a região a partir do quadro k0 (passo +1 ou -1) por template matching. Devolve {quadro: caixa}."""
    out = {}
    h, w = fr[0].shape[:2]
    x, y, bw, bh = [int(v) for v in box]
    x, y = max(0, x), max(0, y); bw, bh = min(bw, w - x), min(bh, h - y)
    if bw < 6 or bh < 6:
        return out
    tpl = cv2.cvtColor(fr[k0][y:y + bh, x:x + bw], cv2.COLOR_BGR2GRAY)
    k = k0 + passo
    while 0 <= k < len(fr) and abs(k - k0) <= limite:
        g = cv2.cvtColor(fr[k], cv2.COLOR_BGR2GRAY)
        sx0, sy0 = max(0, x - bw), max(0, y - bh)
        sx1, sy1 = min(w, x + 2 * bw), min(h, y + 2 * bh)
        area = g[sy0:sy1, sx0:sx1]
        if area.shape[0] < bh or area.shape[1] < bw:
            break
        r = cv2.matchTemplate(area, tpl, cv2.TM_CCOEFF_NORMED)
        _, conf, _, loc = cv2.minMaxLoc(r)
        if conf < 0.62:  # abaixo disso o rastreio "escorrega" para outra parte do caminhão
            break
        x, y = sx0 + loc[0], sy0 + loc[1]
        out[k] = [x, y, bw, bh]
        k += passo
    return out


def juntar(caixas):
    """Caixas que se tocam viram um retângulo só (um objeto)."""
    cx = [[x, y, x + w, y + h] for x, y, w, h in caixas]
    mudou = True
    while mudou:
        mudou = False
        for i in range(len(cx)):
            for j in range(i + 1, len(cx)):
                a, b = cx[i], cx[j]
                if a[0] <= b[2] and b[0] <= a[2] and a[1] <= b[3] and b[1] <= a[3]:
                    cx[i] = [min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3])]
                    cx.pop(j); mudou = True; break
            if mudou:
                break
    return cx


def agrupar(caixas):
    """Separa as caixas por objeto (caixas que se tocam = mesmo objeto). Devolve listas de [x0,y0,x1,y1]."""
    cx = [[x, y, x + bw, y + bh] for x, y, bw, bh in caixas]
    grupos = []
    for c in cx:
        for g in grupos:
            if any(c[0] <= o[2] and o[0] <= c[2] and c[1] <= o[3] and o[1] <= c[3] for o in g):
                g.append(c); break
        else:
            grupos.append([c])
    return grupos


RNG = np.random.default_rng(7)


def cobrir(img, caixas):
    """Reconstrói a área justa da plaqueta a partir das bordas (inpainting Navier-Stokes), soma um grão leve
    igual ao da imagem e funde 3 px de borda. Sem caixa preta, sem desfoque."""
    h, w = img.shape[:2]
    rets = []
    for grupo in agrupar(caixas):
        # caixa MÉDIA do objeto (juntar tudo num retângulo inflava a área)
        x0, y0, x1, y1 = [float(np.median([g[i] for g in grupo])) for i in range(4)]
        # trava de segurança: área maior que uma plaqueta grande não é preenchida (distorce a imagem)
        if (x1 - x0) > 0.30 * w or (y1 - y0) > 0.09 * h:
            continue
        rets.append([x0, y0, x1, y1])
    if not rets:
        return img, []
    # APAGA SÓ OS TRAÇOS DO TEXTO E DO LOGO (decisão 25/11: discreto e SEM distorcer).
    # Dentro da caixa: fundo = cor dominante da plaqueta; texto = pixels que contrastam com ele (Otsu).
    # Só esses traços finos são reconstruídos pelo fundo em volta. A plaqueta fica lisa, sem nome e sem retângulo novo.
    out = img.copy()
    for x0, y0, x1, y1 in rets:
        x0, y0 = int(max(0, x0)), int(max(0, y0)); x1, y1 = int(min(w, x1)), int(min(h, y1))
        if y1 - y0 < 4 or x1 - x0 < 4:
            continue
        reg = img[y0:y1, x0:x1]
        lab = cv2.cvtColor(reg, cv2.COLOR_BGR2LAB).astype(np.float32)
        fundo = np.median(lab.reshape(-1, 3), 0)
        dif = np.linalg.norm(lab - fundo, axis=2)
        dif8 = np.clip(dif * 2, 0, 255).astype(np.uint8)
        lim, _ = cv2.threshold(dif8, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        traco = (dif8 > max(lim, 40)).astype(np.uint8) * 255
        if traco.mean() / 255 > 0.55:  # região sem fundo dominante (não é plaqueta): não mexe
            continue
        # só TRAÇOS do tamanho de letra/logo: parte grande (borda do para-choque, lanterna) não é tocada
        n, rot, st, _ = cv2.connectedComponentsWithStats(traco, connectivity=8)
        bh_, bw_ = traco.shape
        manter = np.zeros(n, bool)
        for i in range(1, n):
            x, y, cw, ch, area = st[i]
            if area <= 0.12 * bh_ * bw_ and cw <= 0.6 * bw_ and ch <= 0.9 * bh_:
                manter[i] = True
        traco = (manter[rot] * 255).astype(np.uint8)
        if not traco.any():
            continue
        traco = cv2.dilate(traco, np.ones((3, 3), np.uint8), iterations=1)
        out[y0:y1, x0:x1] = cv2.inpaint(reg, traco, 3, cv2.INPAINT_TELEA)
    return out, [[int(v) for v in r] for r in rets]


def main():
    arq, placas, saida = sys.argv[1:4]
    w, h, fps, dur = info(arq)
    fr = ler_quadros(arq, w, h)
    anc = ancoras(placas, w, fps, len(fr))
    # quadro com leitura do OCR usa só as leituras; quadro sem leitura usa o rastreio da leitura MAIS PRÓXIMA no tempo
    # (vários rastreios sobrepostos inflavam a área e ela subia para a grade)
    por_quadro = {k: list(v) for k, v in anc.items()}
    lim = int(2.5 * fps)
    rastreio = {}
    for k, caixas in anc.items():
        for b in caixas:
            for kk, bb in list(seguir(fr, k, b, +1, lim).items()) + list(seguir(fr, k, b, -1, lim).items()):
                if kk in anc:
                    continue
                dist = abs(kk - k)
                if kk not in rastreio or dist < rastreio[kk][0]:
                    rastreio[kk] = (dist, k, [bb])
                elif dist == rastreio[kk][0] and k == rastreio[kk][1]:
                    rastreio[kk][2].append(bb)
    for kk, (_, _, bbs) in rastreio.items():
        por_quadro[kk] = bbs
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", f"{fps:.3f}",
                          "-i", "-", "-i", arq, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
                          "-pix_fmt", "yuv420p", "-c:a", "copy", "-shortest", saida], stdin=subprocess.PIPE)
    registro = {}
    for k, img in enumerate(fr):
        novo, rets = cobrir(img, por_quadro.get(k, []))
        if rets:
            registro[k] = rets
        p.stdin.write(novo.tobytes())
    p.stdin.close(); p.wait()
    json.dump({"fps": fps, "quadros": registro}, open(saida + ".areas.json", "w"))  # para a conferência no olho
    print(_os.path.basename(arq), f"quadros cobertos: {len(por_quadro)} de {len(fr)}")


if __name__ == "__main__":
    main()
