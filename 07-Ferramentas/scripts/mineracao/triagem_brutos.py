"""Peneira automática de vídeos brutos (saída do brutos_meta.py). Feita para PC fraco: 1 processo, pouca RAM.

Para cada anúncio com UM preço, de caminhão, sem palavra proibida, fora da praça proibida e de loja que não
está na lista "ruins" (07-Ferramentas/referencias/lojas-brutos.json):
  1. capa: baixa só a imagem de capa (poucos KB). Rosto na capa = apresentador: reprova sem baixar o vídeo;
  2. lê os primeiros 30 s direto do link (sem salvar o vídeo), 1 quadro a cada 1,5 s, num ffmpeg só;
  3. descarta se não for 9:16;
  4. marca o quadro como sujo se tiver rosto ou "texto sobreposto" (caixa de texto que fica parada no mesmo
     lugar da tela enquanto a imagem muda: legenda, preço, logo, @). Texto físico anda com a câmera e não conta;
  5. aprova se tiver um trecho limpo de pelo menos --min-limpo segundos.
Nunca analisa duas vezes o mesmo anúncio, em nenhum PC: a memória fica em 07-Ferramentas/referencias/memoria-mineracao.jsonl
(vai para o GitHub; ver registro_buscas.py). Faça git pull antes e commit + push no fim.
O aprovado ainda passa pela conferência no olho: caminhão INTEIRO no começo do trecho e versão batendo com o texto.

Uso (de dentro da pasta do cofre):
  py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta da tarefa>/meta.json [mais.json] --pasta <pasta da tarefa>
"""
import argparse, json, os, re, subprocess, urllib.request
from io import BytesIO
from pathlib import Path

os.environ.setdefault("OMP_NUM_THREADS", "2")  # PC fraco: não deixar o OCR tomar a máquina toda
from PIL import Image, ImageChops, ImageStat

AQUI = Path(__file__).resolve().parent
COFRE = AQUI.parents[2]
LOJAS = COFRE / "07-Ferramentas" / "referencias" / "lojas-brutos.json"
import sys; sys.path.insert(0, str(AQUI))
import registro_buscas  # noqa: E402  memória compartilhada entre os PCs

PROIBIDO = re.compile(r"cons[óo]rcio|carta de cr[ée]dito|contempla|\bcota", re.I)
PRACA = re.compile(r"vit[óo]ria da conquista", re.I)
CAMINHAO = re.compile(r"caminh[ãa]o|cavalo|truck|\btoco\b|carreta|ba[úu]\b|basculante|munck|guindaste|scania|volvo\s?(fh|fm|vm|nh|nl)|"
                      r"accelo|atego|axor|actros|atron|arocs|(vw|volks\w*)\s?(constellation|delivery|worker)|constellation \d|ford\s?cargo|tector|stralis|daf\b|"
                      r"hi.?road|s.?way|frigor[ií]fico|\bmb\s?\d{4}|\bvw\s?\d{1,2}[\.\-]?\d{3}|\bl\s?1620|"
                      r"\b(vw|volks|volkswagen|mb|mercedes|ford|iveco)\s?\d{1,2}[\.\-]\d{3}\b", re.I)  # número solto pegava km ("122.000 km")
# anúncio de VENDA de veículo (a busca funda com anúncios antigos traz post qualquer que cita caminhão)
VENDA = re.compile(r"vend[ae]|seminov|valor|r\$|💲|\bkm\b|quil[ôo]metr|ano\s?/?\s?modelo|\bano\b|[uú]nico dono|estoque|dispon[ií]vel|"
                   r"financi|aceit[ao] troca|repasse|revisad|pronto para (trabalhar|rodar)", re.I)
# preço: "R$ 169.000", "R$: 169.000", "💲169.000,00", "💲🇧🇷 279.000,00", "Valor 169.000,00"
PRECO = re.compile(r"(?:R\$|💲|valor:?)\s?(?:🇧🇷)?\s?:?\s?([\d\.]{5,})(?:,\d{2})?", re.I)
UA = {"User-Agent": "Mozilla/5.0"}
PASSO, LIMITE = 1.5, 30


def preco_unico(texto, lo, hi):
    vs = {float(v.replace(".", "")) for v in PRECO.findall(texto)}
    vs = {v for v in vs if lo <= v <= hi}
    return vs.pop() if len(vs) == 1 else None


def quadros(fonte):
    """Primeiros 30 s, 1 quadro a cada 1,5 s, 360 px de largura, num ffmpeg só (lê direto do link)."""
    b = subprocess.run(["ffmpeg", "-v", "error", "-t", str(LIMITE), "-i", fonte, "-vf", f"fps=1/{PASSO},scale=360:-2",
                        "-f", "image2pipe", "-vcodec", "mjpeg", "-q:v", "5", "-"], capture_output=True, timeout=180).stdout
    out, i = [], 0
    while True:
        s = b.find(b"\xff\xd8", i)
        if s < 0:
            break
        e = b.find(b"\xff\xd9", s)
        if e < 0:
            break
        out.append(Image.open(BytesIO(b[s:e + 2])).convert("RGB"))
        i = e + 2
    return out


class Olho:
    """OCR só para ACHAR caixa de texto (sem ler) + detector de rosto carregado uma vez."""
    def __init__(self):
        from rapidocr_onnxruntime import RapidOCR
        import cv2, numpy as np
        self.cv2, self.np = cv2, np
        self.ocr = RapidOCR()
        self.face = cv2.FaceDetectorYN.create(str(AQUI / "yunet.onnx"), "", (360, 640), 0.75)

    def caixas(self, im):
        res, _ = self.ocr(im, use_det=True, use_cls=False, use_rec=False)
        out = []
        for box in res or []:
            xs = [p[0] for p in box]; ys = [p[1] for p in box]
            h = (max(ys) - min(ys)) / im.height
            if h < 0.012 or (max(xs) - min(xs)) < 8:
                continue
            out.append(((min(xs) + max(xs)) / 2 / im.width, (min(ys) + max(ys)) / 2 / im.height, h))
        return out

    def rostos(self, im):
        self.face.setInputSize((im.width, im.height))
        _, f = self.face.detect(self.cv2.cvtColor(self.np.array(im), self.cv2.COLOR_RGB2BGR))
        return 0 if f is None else len(f)


def analisar(olho, fr):
    cx = [olho.caixas(im) for im in fr]
    # rosto = apresentador; quadro preto ou de cor chapada = tela final / vinheta (não é filmagem)
    sujo = [olho.rostos(im) > 0 or ImageStat.Stat(im.convert("L")).stddev[0] < 12 for im in fr]
    for i in range(1, len(fr)):
        mudou = ImageStat.Stat(ImageChops.difference(fr[i].convert("L").resize((64, 114)),
                                                     fr[i - 1].convert("L").resize((64, 114)))).mean[0] > 10
        if not mudou:
            continue
        for a in cx[i]:
            for b in cx[i - 1]:
                if abs(a[0] - b[0]) < 0.05 and abs(a[1] - b[1]) < 0.03 and abs(a[2] - b[2]) < 0.4 * max(a[2], b[2]):
                    sujo[i] = sujo[i - 1] = True
    melhor, ini, trechos = (0.0, 0.0, 0.0), None, []
    for i, s in enumerate(sujo + [True]):
        if not s and ini is None:
            ini = i
        if s and ini is not None:
            a, b = ini * PASSO, (i - 1) * PASSO + PASSO
            if b - a >= 3:  # tomada curta aproveitável (decisão de 25/11: pode juntar tomadas)
                trechos.append([a, round(b, 1)])
            if b - a > melhor[0]:
                melhor = (b - a, a, b)
            ini = None
    return {"quadros": len(fr), "sujos": sum(sujo), "limpo_s": round(melhor[0], 1), "limpo_de": melhor[1], "limpo_ate": round(melhor[2], 1),
            "trechos": trechos, "soma_trechos": round(sum(b - a for a, b in trechos), 1)}


def gravar_memoria(novos):
    registro_buscas.gravar_memoria(novos)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("jsons", nargs="+")
    ap.add_argument("--pasta", required=True, help="pasta da tarefa (o resultado vai em triagem.json)")
    ap.add_argument("--min-preco", type=float, default=60000)
    ap.add_argument("--max-preco", type=float, default=900000)
    ap.add_argument("--min-limpo", type=float, default=12)
    ap.add_argument("--sem-preco", action="store_true", help="aceita anúncio sem preço (valor vem da FIPE depois, só com OK do gestor)")
    ap.add_argument("--parte", default="1/1", help="só em PC forte: divide a lista entre processos (1/4, 2/4...). Padrão: um processo só")
    a = ap.parse_args()
    k, n = map(int, a.parte.split("/"))
    pasta = Path(a.pasta); pasta.mkdir(parents=True, exist_ok=True)
    saida = pasta / ("triagem.json" if n == 1 else f"triagem-{k}de{n}.json")
    feitos = {r["id"]: r for r in json.loads(saida.read_text(encoding="utf-8"))} if saida.exists() else {}
    memoria = registro_buscas.ler_memoria()
    print(f"memória compartilhada: {len(memoria)} anúncios já analisados (não serão vistos de novo)", flush=True)
    lojas = json.loads(LOJAS.read_text(encoding="utf-8")) if LOJAS.exists() else {}
    ruins = set(lojas.get("ruins", {})); ruins_nome = re.compile("|".join(lojas.get("ruins_por_nome", ["$^"])), re.I)
    ads = {}
    for j in a.jsons:
        for ad in json.load(open(j, encoding="utf-8")):
            ads.setdefault(ad["id"], ad)
    olho = None
    pulados = {"já visto": 0, "texto/praça/preço": 0, "loja ruim": 0}
    for idx, ad in enumerate(ads.values()):
        if idx % n != k - 1:
            continue
        if ad["id"] in feitos or ad["id"] in memoria:
            pulados["já visto"] += 1; continue
        tx = ad["texto"]
        v = preco_unico(tx, a.min_preco, a.max_preco)
        if PROIBIDO.search(tx) or PRACA.search(tx) or not CAMINHAO.search(tx) or not VENDA.search(tx) or not ad.get("video") or (not v and not a.sem_preco):
            pulados["texto/praça/preço"] += 1; continue
        if ad.get("page_id") in ruins or ruins_nome.search((ad.get("page_name") or "") + " " + (ad.get("anunciante") or "")):
            pulados["loja ruim"] += 1; continue
        olho = olho or Olho()
        r = {"id": ad["id"], "anunciante": ad.get("page_name") or ad.get("anunciante", ""), "page_id": ad.get("page_id", ""), "valor": v}
        try:
            capa = None
            if ad.get("poster"):
                try:
                    capa = Image.open(BytesIO(urllib.request.urlopen(urllib.request.Request(ad["poster"], headers=UA), timeout=30).read())).convert("RGB")
                    capa.thumbnail((360, 640))
                except Exception:
                    capa = None
            if capa is not None and olho.rostos(capa) > 0:
                r.update(vertical=None, motivo="rosto na capa")
            else:
                fr = quadros(ad["video"])
                if not fr:
                    raise RuntimeError("vídeo não abriu")
                w, h = fr[0].size
                r["vertical"] = h >= 1.6 * w
                if r["vertical"]:
                    r.update(analisar(olho, fr))
                else:
                    r["motivo"] = "não é 9:16"
            r["passou"] = bool(r.get("vertical") and (r.get("limpo_s", 0) >= a.min_limpo or r.get("soma_trechos", 0) >= 10))
        except Exception as e:
            r.update(erro=str(e)[:120], passou=False)
        feitos[ad["id"]] = r
        if "erro" not in r:
            memoria[ad["id"]] = {"passou": r["passou"], "page_id": r["page_id"]}
            gravar_memoria({ad["id"]: memoria[ad["id"]]})
        saida.write_text(json.dumps(list(feitos.values()), ensure_ascii=False, indent=1), encoding="utf-8")
        print(ad["id"], r["anunciante"][:20], int(v or 0), r.get("motivo") or r.get("erro") or f"limpo {r.get('limpo_s')} s",
              "PASSOU" if r["passou"] else "-", flush=True)
    print("pulados sem baixar:", pulados)
    print("passaram:", sum(1 for x in feitos.values() if x["passou"]), "de", len(feitos), "analisados")


if __name__ == "__main__":
    main()
