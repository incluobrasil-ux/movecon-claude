"""Consulta a Central de Transparência de Anúncios do Google por domínio (banco de referências).
Com região e print da página.

Uso: python transparencia_google.py dominios.txt saida.json [--regiao US] [--prints mineracao/<produto>/prints]
Captura as respostas RPC (SearchCreatives) e o texto visível com a contagem de anúncios.
"""
import argparse, json, re, sys
from pathlib import Path
from playwright.sync_api import sync_playwright


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lista")
    ap.add_argument("saida")
    ap.add_argument("--regiao", default="US")
    ap.add_argument("--prints", help="pasta para o print da página de cada domínio")
    a = ap.parse_args()
    lista, saida = a.lista, a.saida
    doms = [l.strip() for l in open(lista, encoding="utf-8") if l.strip()]
    res = {}
    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=True)
        ctx = b.new_context(locale="en-US", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36")
        pg = ctx.new_page()
        rpc = []
        pg.on("response", lambda r: rpc.append(r) if "SearchCreatives" in r.url else None)
        for d in doms:
            rpc.clear()
            url = f"https://adstransparency.google.com/?region={a.regiao}&domain={d}"
            try:
                pg.goto(url, timeout=60000)
                pg.wait_for_timeout(7000)
                for _ in range(2):
                    pg.mouse.wheel(0, 5000)
                    pg.wait_for_timeout(1500)
                texto = pg.inner_text("body")
                if a.prints:
                    Path(a.prints).mkdir(parents=True, exist_ok=True)
                    pg.evaluate("window.scrollTo(0, 0)")
                    pg.screenshot(path=str(Path(a.prints) / f"google-{re.sub(r'[^a-z0-9]+', '-', d.lower())}.png"))
            except Exception as e:
                print("ERRO", d, e, flush=True)
                continue
            m = re.search(r"^(.{0,25}\d.{0,15}an[uú]ncios?)\s*$", texto, re.I | re.M)
            corpos = []
            for r in rpc:
                try:
                    corpos.append(r.text()[:20000])
                except Exception:
                    pass
            anunciantes = sorted(set(re.findall(r'"(AR\d{18,})"', " ".join(corpos))))
            nomes = sorted(set(re.findall(r'"\d":"([^"]{3,60})","\d":"AR\d', " ".join(corpos))))
            res[d] = {"url": url, "contagem": m.group(1) if m else None,
                      "anunciantes_id": anunciantes[:10], "texto": texto[:1500], "rpc": corpos[:1]}
            print(f"{d}: {res[d]['contagem']} | ids={len(anunciantes)}", flush=True)
        b.close()
    json.dump(res, open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
