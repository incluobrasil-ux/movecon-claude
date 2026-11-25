"""Edita brutos no PADRÃO MÍNIMO DE EDIÇÃO (03-Padroes/Padrao minimo de edicao.md), em Windows, sem caminho fixo.

Para cada peça do lote.json:
  - 1080x1920, tela cheia, duração do bruto (12 a 15 s);
  - pílula branca "Entrada de R$ X", pílula "Parcelas de R$ Y" (branca ou vermelha), colchete vermelho,
    nome do modelo e @ da conta (layout da @pedro: @ embaixo do modelo), fixos desde o quadro 0;
  - rodapé "CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP" entrando em 1,2 s;
  - tarja preta nas placas (arquivo de detecta_placas.py, se existir);
  - música livre (Pixabay) no lugar do áudio original, fade no fim, -14 LUFS
    (lista e links em 06-Referencias/edicao/Musicas liberadas.md; "musica": "original" mantém o som do vídeo).

lote.json: [{"arquivo": "...mp4", "saida": "...mp4", "modelo": "Ford Cargo 1932", "valor": 148800,
             "musica": "...mp3", "musica_in": 6.27, "parcela_vermelha": false, "placas": "...json"}]
Uso: py -3 editar_reel.py lote.json --handle @lais.iconsorcio
"""
import os as _os, sys as _sys
# a pasta edicao tem um copy.py antigo que esconde o módulo copy do Python: tira a pasta do caminho de import
_sys.path[:] = [x for x in _sys.path if _os.path.abspath(x or ".") != _os.path.dirname(_os.path.abspath(__file__))]

import argparse, json, math, subprocess, sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

AQUI = Path(__file__).resolve().parent
F = AQUI / "fontes"
W, H = 1080, 1920
VERMELHO = (227, 19, 47, 255)
VERMELHO_PILULA = (193, 0, 19, 255)
sys.path.insert(0, str(AQUI.parent))
from calc_valores import reel  # noqa: E402


def brl(v):
    return "R$ " + f"{int(v):,}".replace(",", ".")


def fonte(nome, tam):
    return ImageFont.truetype(str(F / nome), tam)


def pilula(d, x, y, texto, f, fundo, cor, px=26, py=12, raio=16):
    l, t, r, b = d.textbbox((0, 0), texto, font=f)
    w, h = r - l + 2 * px, b - t + 2 * py
    d.rounded_rectangle([x, y, x + w, y + h], raio, fill=fundo)
    d.text((x + px - l, y + py - t), texto, font=f, fill=cor)
    return w, h


def overlay(modelo, valor, handle, parcela_vermelha, saida):
    v = reel(valor)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fv = fonte("Poppins-ExtraBold.ttf", 54)
    x0, y0 = 112, 360
    w1, h1 = pilula(d, x0, y0, f"Entrada de {brl(v['entrada'])}", fv, (255, 255, 255, 255), (0, 0, 0, 255))
    y1 = y0 + h1 + 14
    fundo2, cor2 = ((VERMELHO_PILULA, (255, 255, 255, 255)) if parcela_vermelha else ((255, 255, 255, 255), (0, 0, 0, 255)))
    w2, h2 = pilula(d, x0, y1, f"Parcelas de {brl(v['parcela'])}", fv, fundo2, cor2)
    # colchete vermelho
    xb, yt, yb = x0 - 34, y0 - 8, y1 + h2 + 8
    d.rectangle([xb, yt, xb + 10, yb], fill=VERMELHO)
    d.rectangle([xb, yt, xb + 34, yt + 10], fill=VERMELHO)
    d.rectangle([xb, yb - 10, xb + 34, yb], fill=VERMELHO)
    # modelo e @ (etiquetas pequenas pretas)
    fm, fh = fonte("Poppins-Bold.ttf", 30), fonte("Poppins-SemiBold.ttf", 27)
    ym = yb + 22
    _, hm = pilula(d, x0, ym, modelo, fm, (0, 0, 0, 215), (255, 255, 255, 255), px=16, py=8, raio=10)
    pilula(d, x0, ym + hm + 10, handle, fh, (0, 0, 0, 215), (255, 255, 255, 255), px=16, py=7, raio=10)
    # sombra leve para destacar do fundo
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sombra.paste((0, 0, 0, 90), mask=im.split()[3])
    sombra = sombra.filter(ImageFilter.GaussianBlur(6))
    Image.alpha_composite(sombra, im).save(saida)
    return v


def cta(saida):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = fonte("BarlowCondensed-ExtraBold.ttf", 70)
    for i, linha in enumerate(["CLIQUE NO LINK", "E FALE DIRETAMENTE NO WHATSAPP"]):
        l, t, r, b = d.textbbox((0, 0), linha, font=f)
        x, y = (W - (r - l)) // 2 - l, 1590 + i * 78 - t
        for dx, dy in ((3, 4), (2, 3)):
            d.text((x + dx, y + dy), linha, font=f, fill=(0, 0, 0, 170))
        d.text((x, y), linha, font=f, fill=(255, 255, 255, 255))
    im.save(saida)


def suavizar(caixas, passo=0.1, ligar=3.5, segurar=0.8):
    """O OCR lê a placa só em alguns quadros: liga leituras próximas (até `ligar` s e perto na tela),
    interpolando posição e tamanho, e segura `segurar` s antes e depois. Evita tarja piscando."""
    pts = sorted(((c["t0"] + c["t1"]) / 2, c["x"], c["y"], c["w"], c["h"]) for c in caixas)
    trilhas = []
    for p in pts:
        for tr in trilhas:
            u = tr[-1]
            if p[0] - u[0] <= ligar and abs((p[1] + p[3] / 2) - (u[1] + u[3] / 2)) < 220 and abs((p[2] + p[4] / 2) - (u[2] + u[4] / 2)) < 220:
                tr.append(p); break
        else:
            trilhas.append([p])
    out = []
    for tr in trilhas:
        t, fim = tr[0][0] - segurar, tr[-1][0] + segurar
        while t <= fim:
            if t <= tr[0][0]: q = tr[0]
            elif t >= tr[-1][0]: q = tr[-1]
            else:
                a = max(x for x in tr if x[0] <= t); b = min(x for x in tr if x[0] >= t)
                k = 0 if b[0] == a[0] else (t - a[0]) / (b[0] - a[0])
                q = [t] + [a[i] + (b[i] - a[i]) * k for i in range(1, 5)]
            out.append({"t0": max(0.0, t - passo / 2), "t1": t + passo / 2 + 0.04, "x": int(q[1]), "y": int(q[2]), "w": int(q[3]), "h": int(q[4])})
            t += passo
    return out


def dur(arq):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", arq],
                                capture_output=True, text=True).stdout)


def editar(p, handle, tmp):
    base = Path(p["saida"]).stem
    ov, ct = tmp / f"{base}-ov.png", tmp / "cta.png"
    v = overlay(p["modelo"], p["valor"], handle, p.get("parcela_vermelha", False), ov)
    if not ct.exists():
        cta(ct)
    d = min(dur(p["arquivo"]), 15.0)
    tarjas = []
    if p.get("placas") and Path(p["placas"]).exists():
        for c in suavizar(json.load(open(p["placas"]))["caixas"]):
            # coordenadas em 1080 de largura do quadro-fonte -> mesma escala do quadro final (1080x1920)
            tarjas.append(f"drawbox=x={c['x']}:y={c['y']}:w={c['w']}:h={c['h']}:color=black@1:t=fill:enable='between(t,{c['t0']:.2f},{c['t1']:.2f})'")
    vf = "[0:v]scale=1080:1920:flags=lanczos,setsar=1,fps=30" + ("," + ",".join(tarjas) if tarjas else "") + "[b];"
    vf += "[b][1:v]overlay=0:0[c];[2:v]format=rgba,fade=in:st=1.2:d=0.25:alpha=1[t];[c][t]overlay=0:0:enable='gte(t,1.2)'[v];"
    # "musica": "original" = mantém o som do próprio vídeo (só quando não tem voz de vendedor; Reel Instagram.md)
    original = str(p.get("musica", "")).strip().lower() == "original"
    fonte_audio = "[0:a]" if original else "[3:a]"
    vf += f"{fonte_audio}atrim=0:{d:.2f},asetpts=PTS-STARTPTS,afade=t=in:d=0.3,afade=t=out:st={d - 0.7:.2f}:d=0.7,loudnorm=I=-14:TP=-1.5:LRA=11[a]"
    entrada_musica = [] if original else ["-ss", str(p.get("musica_in", 0)), "-i", p["musica"]]
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", p["arquivo"], "-loop", "1", "-t", f"{d:.2f}", "-i", str(ov),
           "-loop", "1", "-t", f"{d:.2f}", "-i", str(ct), *entrada_musica,
           "-filter_complex", vf, "-map", "[v]", "-map", "[a]", "-t", f"{d:.2f}",
           "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", "30",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", p["saida"]]
    subprocess.run(cmd, check=True)
    print(Path(p["saida"]).name, f"{d:.1f}s", brl(v["entrada"]), "/", brl(v["parcela"]), f"tarjas={len(tarjas)}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lote")
    ap.add_argument("--handle", required=True)
    a = ap.parse_args()
    lote = json.load(open(a.lote, encoding="utf-8"))
    tmp = Path(a.lote).parent / "_overlays"; tmp.mkdir(exist_ok=True)
    for p in lote:
        Path(p["saida"]).parent.mkdir(parents=True, exist_ok=True)
        editar(p, a.handle, tmp)


if __name__ == "__main__":
    main()
