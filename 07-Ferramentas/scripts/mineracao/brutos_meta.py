"""Minera vídeos brutos de veículos na Biblioteca de Anúncios da Meta (só leitura, sem login).

Para cada anúncio de VÍDEO ativo no Brasil, guarda: id, anunciante, dias no ar, texto, preço achado no texto
e a URL do mp4. Não baixa nada; o download é outro passo (baixar só os candidatos).

Uso:
  py -3 brutos_meta.py "caminhão seminovo" "scania à venda" --rolagens 4 --saida <pasta>/meta.json
Regra: uma busca por vez, 5 a 10 s entre buscas. "Nenhum anúncio" em termo que tinha resultado = bloqueio: parar.
"""
import argparse, json, re, time, urllib.parse
from datetime import date
from pathlib import Path
from playwright.sync_api import sync_playwright

MESES = {"jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "jun": 6, "jul": 7, "ago": 8, "set": 9, "out": 10, "nov": 11, "dez": 12}
JS = r"""
() => {
  const out = [];
  const labels = [...document.querySelectorAll('span, div')].filter(e => /^Identificação da biblioteca:\s*\d+/.test(e.textContent.trim()) && e.children.length === 0);
  for (const l of labels) {
    let card = l; while (card.parentElement && card.getBoundingClientRect().height < 380) card = card.parentElement;
    const v = card.querySelector('video');
    if (!v) continue;
    out.push({id: (l.textContent.match(/\d{6,}/) || [''])[0], texto: card.innerText.slice(0, 1500),
              video: v.currentSrc || v.src || (v.querySelector('source') || {}).src || '', poster: v.poster || ''});
  }
  return out;
}
"""


def url(termo):
    p = {"active_status": "active", "ad_type": "all", "country": "BR", "media_type": "video",
         "q": termo, "search_type": "keyword_unordered"}
    return "https://www.facebook.com/ads/library/?" + urllib.parse.urlencode(p)


def dias(texto):
    m = re.search(r"Veiculação iniciada em (\d{1,2}) de (\w{3})\w* de (\d{4})", texto)
    if not m:
        return None
    return (date.today() - date(int(m.group(3)), MESES.get(m.group(2).lower(), 1), int(m.group(1)))).days


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("termos", nargs="+")
    ap.add_argument("--rolagens", type=int, default=4)
    ap.add_argument("--saida", required=True)
    a = ap.parse_args()
    todos = {}
    with sync_playwright() as p:
        br = p.chromium.launch(channel="chrome", headless=True)
        pg = br.new_page(locale="pt-BR", viewport={"width": 1400, "height": 1000})
        hd = {}  # id do anúncio -> URL do vídeo em alta (vem no JSON da página, não no player)

        def pegar_hd(texto):
            for m in re.finditer(r'"ad_archive_id":"(\d+)"', texto):
                trecho = texto[m.end():m.end() + 20000]
                v = re.search(r'"video_hd_url":"([^"]+)"', trecho)
                if v and m.group(1) not in hd:
                    hd[m.group(1)] = v.group(1).encode().decode("unicode_escape").replace("\\/", "/")

        def ao_responder(r):
            try:
                if ("graphql" in r.url or "ads/library" in r.url) and r.request.resource_type in ("xhr", "fetch", "document"):
                    pegar_hd(r.text())
            except Exception:
                pass

        pg.on("response", ao_responder)
        for t in a.termos:
            pg.goto(url(t), wait_until="domcontentloaded", timeout=60000)
            pg.wait_for_timeout(7000)
            if "Nenhum anúncio corresponde" in pg.inner_text("body"):
                print(f"[{t}] nenhum anúncio (se o termo tinha resultado antes, é bloqueio: parar)")
                continue
            for _ in range(a.rolagens):
                pg.mouse.wheel(0, 6000); pg.wait_for_timeout(2500)
            novos = 0
            for ad in pg.evaluate(JS):
                if not ad["id"] or ad["id"] in todos or not ad["video"]:
                    continue
                tx = ad["texto"]
                linhas = [l.strip() for l in tx.split("\n") if l.strip()]
                anun = next((linhas[i + 1] for i, l in enumerate(linhas) if l.startswith("Ver detalhes")), "")
                precos = re.findall(r"R\$\s?[\d\.]{4,}(?:,\d{2})?", tx)
                todos[ad["id"]] = {"id": ad["id"], "termo": t, "anunciante": anun, "dias_ativo": dias(tx),
                                   "precos": precos, "texto": tx, "video": ad["video"], "video_hd": hd.get(ad["id"], ""),
                                   "url": f"https://www.facebook.com/ads/library/?id={ad['id']}"}
                novos += 1
            print(f"[{t}] {novos} vídeos novos (total {len(todos)})", flush=True)
            time.sleep(8)
        br.close()
    for ad in todos.values():
        ad["video_hd"] = ad["video_hd"] or hd.get(ad["id"], "")
    print("com link HD:", sum(1 for x in todos.values() if x["video_hd"]), "de", len(todos))
    Path(a.saida).parent.mkdir(parents=True, exist_ok=True)
    json.dump(list(todos.values()), open(a.saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("salvo:", a.saida)


if __name__ == "__main__":
    main()
