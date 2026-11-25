"""Acha placa legível no vídeo (OCR) e gera as tarjas que acompanham a placa.

Lê 5 quadros por segundo em 1080 px de largura, procura texto com cara de placa (ABC1D23 / ABC-1234),
junta as detecções próximas no tempo e devolve caixas pretas sólidas com margem.
Placa que o OCR não lê costuma estar longe e ilegível (não precisa de tarja), mas CONFIRA na folha de QA.

Uso: py -3 detecta_placas.py <video.mp4> <saida.json>
"""
import os as _os, sys as _sys
# a pasta edicao tem um copy.py antigo que esconde o módulo copy do Python: tira a pasta do caminho de import
_sys.path[:] = [x for x in _sys.path if _os.path.abspath(x or ".") != _os.path.dirname(_os.path.abspath(__file__))]

import json, re, subprocess, sys
from io import BytesIO

from PIL import Image
from rapidocr_onnxruntime import RapidOCR

PLACA = re.compile(r"^[A-Z]{3}\d[A-Z0-9]\d{2}$")
# telefone, site, @ e nome de loja (plaqueta da revenda no para-choque, adesivo): também levam tarja
LOJA = re.compile(r"\(?\d{2}\)?\s?\d{4,5}[\s\-\.]?\d{4}|@|www|\.com|caminh|ve[ií]cul|truck|motors|seminov|ltda|lima|multimarcas|p[aá]tio", re.I)
FPS = 5


def quadros(arq):
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", arq, "-vf", f"fps={FPS},scale=1080:-2", "-f", "image2pipe",
                        "-vcodec", "mjpeg", "-q:v", "3", "-"], capture_output=True).stdout
    i, n = 0, 0
    while True:
        s = b.find(b"\xff\xd8", i)
        if s < 0:
            return
        e = b.find(b"\xff\xd9", s)
        yield n / FPS, Image.open(BytesIO(b[s:e + 2])).convert("RGB")
        i, n = e + 2, n + 1


def limpa(t):
    t = re.sub(r"[^A-Z0-9]", "", t.upper())
    # troca comum do OCR nas 3 primeiras posições (letras)
    return t[:3].replace("0", "O").replace("1", "I").replace("5", "S").replace("8", "B") + t[3:]


def main():
    arq, saida = sys.argv[1], sys.argv[2]
    ocr = RapidOCR()
    achados = []
    for t, im in quadros(arq):
        res, _ = ocr(im)
        for box, txt, conf in res or []:
            if float(conf) > 0.5 and (PLACA.match(limpa(txt)) or LOJA.search(txt)):
                xs = [p[0] for p in box]; ys = [p[1] for p in box]
                achados.append([t, min(xs), min(ys), max(xs), max(ys)])
    caixas = []
    for t, x0, y0, x1, y1 in achados:
        mx, my = (x1 - x0) * 0.25, (y1 - y0) * 0.6
        caixas.append({"t0": max(0, t - 0.2), "t1": t + 0.2, "x": int(x0 - mx), "y": int(y0 - my),
                       "w": int(x1 - x0 + 2 * mx), "h": int(y1 - y0 + 2 * my)})
    json.dump({"placas_lidas": len(achados), "caixas": caixas}, open(saida, "w"), indent=1)
    print(arq, "placas lidas em", len(achados), "quadros")


if __name__ == "__main__":
    main()
