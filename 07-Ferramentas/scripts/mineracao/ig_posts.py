"""Lê posts PÚBLICOS do Instagram a partir de links, SEM LOGIN, e grava no formato do brutos_meta.py (26/11/2026).

Entrada: o JSON do ig_tags.mjs ({código: {...}}) ou um .txt com links instagram.com/p/<código>/ ou /reel/<código>/
(a pessoa pode copiar os links no celular, só olhando, e colar num .txt).
Para cada post: yt-dlp sem login lê legenda (preço), perfil, data, formato e o link do vídeo. Post só de foto é pulado.
Post já analisado em qualquer PC (memoria-mineracao.jsonl) é pulado.
Depois: py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta>/ig.json --pasta <pasta> --palavras "..." [--sem-preco]

Uso: py -3 07-Ferramentas/scripts/mineracao/ig_posts.py <links.json|links.txt> --saida <pasta>/ig.json [--espera 3]
"""
import argparse, json, re, subprocess, sys, time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import registro_buscas  # noqa: E402

TRAVA = re.compile(r"login required|rate-limit|HTTP Error 429|Please wait a few minutes", re.I)


def codigos(arq):
    p = Path(arq); txt = p.read_text(encoding="utf-8", errors="ignore")
    if p.suffix.lower() == ".json":
        d = json.loads(txt)
        return list(d) if isinstance(d, dict) else [x.get("codigo") or x for x in d]
    return list(dict.fromkeys(re.findall(r"instagram\.com/(?:[^/\s]+/)?(?:p|reel|reels)/([A-Za-z0-9_-]+)", txt)))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("links")
    ap.add_argument("--saida", required=True)
    ap.add_argument("--espera", type=float, default=3)
    a = ap.parse_args()
    saida = Path(a.saida); saida.parent.mkdir(parents=True, exist_ok=True)
    dados = {x["id"]: x for x in json.loads(saida.read_text(encoding="utf-8"))} if saida.exists() else {}
    memoria = registro_buscas.ler_memoria()
    cs = [c for c in codigos(a.links) if ("ig" + c) not in dados and ("ig" + c) not in memoria]
    print(f"{len(cs)} posts para ler (já vistos foram pulados)", flush=True)
    import yt_dlp  # um processo só (bem mais rápido que chamar o programa a cada post)
    ydl = yt_dlp.YoutubeDL({"quiet": True, "no_warnings": True, "skip_download": True})
    seguidos = 0
    for k, c in enumerate(cs, 1):
        erro = ""
        try:
            j = ydl.extract_info(f"https://www.instagram.com/p/{c}/", download=False)
        except Exception as e:
            j, erro = None, str(e)
        time.sleep(a.espera)
        if TRAVA.search(erro):
            seguidos += 1
            if seguidos >= 3:
                print("PAREI: o Instagram limitou a leitura sem login (3 seguidas). Tente mais tarde.", flush=True); break
            continue
        seguidos = 0
        if not j or j.get("_type") == "playlist":
            j = (j or {}).get("entries", [None])[0] if j else None
        if not j:
            continue
        fm = [f for f in j.get("formats", []) if f.get("vcodec") not in (None, "none") and f.get("url")]
        best = max(fm, key=lambda f: (f.get("height") or 0)) if fm else {}
        ts = j.get("timestamp")
        texto = j.get("description") or ""
        dados["ig" + c] = {"id": "ig" + c, "texto": texto[:1500], "video": best.get("url") or j.get("url", ""), "poster": j.get("thumbnail", ""),
                           "page_id": "instagram:" + (j.get("channel") or j.get("uploader_id") or ""), "page_name": j.get("uploader") or j.get("channel") or "",
                           "dias_ativo": int((time.time() - ts) // 86400) if ts else None, "url": f"https://www.instagram.com/p/{c}/",
                           "w": j.get("width"), "h": j.get("height"), "dur": j.get("duration"),
                           "precos": re.findall(r"R\$\s?[\d\.]{4,}(?:,\d{2})?", texto)}
        if k % 20 == 0:
            saida.write_text(json.dumps(list(dados.values()), ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"{k}/{len(cs)} lidos, {len(dados)} vídeos", flush=True)
    saida.write_text(json.dumps(list(dados.values()), ensure_ascii=False, indent=1), encoding="utf-8")
    registro_buscas.registrar("ig_posts(sem login)", Path(a.links).name, "BR", "ativos", len(dados), str(saida))
    print("salvo:", saida, "|", len(dados), "vídeos")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
