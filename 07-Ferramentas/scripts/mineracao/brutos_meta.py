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


INATIVOS = [False]


def url(termo):
    """termo normal = busca por palavra; "pagina:<id>" = todos os vídeos ativos daquela página."""
    p = {"active_status": "all" if INATIVOS[0] else "active", "ad_type": "all", "country": "BR", "media_type": "video"}
    if termo.startswith("pagina:"):
        p.update(view_all_page_id=termo.split(":", 1)[1], search_type="page")
    else:
        p.update(q=termo, search_type="keyword_unordered")
    return "https://www.facebook.com/ads/library/?" + urllib.parse.urlencode(p)


def dias(texto):
    m = re.search(r"Veiculação iniciada em (\d{1,2}) de (\w{3})\w* de (\d{4})", texto)
    if not m:
        return None
    return (date.today() - date(int(m.group(3)), MESES.get(m.group(2).lower(), 1), int(m.group(1)))).days


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("termos", nargs="*")
    ap.add_argument("--lojas-boas", action="store_true", help="busca a página inteira de cada loja da lista 'boas' (07-Ferramentas/referencias/lojas-brutos.json)")
    ap.add_argument("--rolagens", type=int, default=4)
    ap.add_argument("--inativos", action="store_true", help="inclui anúncios encerrados (vídeo antigo de loja costuma ser filmagem crua e ninguém minerou)")
    ap.add_argument("--saida", required=True)
    a = ap.parse_args()
    INATIVOS[0] = a.inativos
    if a.lojas_boas:
        lj = json.load(open(Path(__file__).resolve().parents[3] / "07-Ferramentas" / "referencias" / "lojas-brutos.json", encoding="utf-8"))
        a.termos += [f"pagina:{pid}" for pid in lj.get("boas", {})]
    if not a.termos:
        ap.error("informe termos de busca ou --lojas-boas")
    todos = {}
    with sync_playwright() as p:
        br = p.chromium.launch(channel="chrome", headless=True)
        pg = br.new_page(locale="pt-BR", viewport={"width": 1400, "height": 1000})
        # PC fraco: não carrega imagem, vídeo nem fonte (os links vêm no HTML e nos dados da página)
        pg.route("**/*", lambda rota: rota.abort() if rota.request.resource_type in ("image", "media", "font") else rota.continue_())
        dados = {}  # id do anúncio -> campos tirados do JSON da página (não depende do player carregar)

        def campo(seg, nome):
            m = re.search(r'"%s":"((?:[^"\\]|\\.)*)"' % nome, seg)
            if not m:
                return ""
            try:
                return json.loads('"' + m.group(1) + '"')
            except Exception:
                return m.group(1)

        def ler_json(texto, termo):
            partes = re.split(r'"ad_archive_id":"', texto)
            for seg in partes[1:]:
                aid = re.match(r"(\d+)", seg)
                if not aid:
                    continue
                aid = aid.group(1); seg = seg[:30000]
                sd, hdv = campo(seg, "video_sd_url"), campo(seg, "video_hd_url")
                if not (sd or hdv) or aid in dados:
                    continue
                corpo = re.search(r'"body":\{"text":"((?:[^"\\]|\\.)*)"', seg)
                corpo = json.loads('"' + corpo.group(1) + '"') if corpo else ""
                extra = " | ".join(x for x in (campo(seg, "title"), campo(seg, "link_description"), campo(seg, "caption")) if x)
                ini = re.search(r'"start_date":(\d{9,})', seg)
                dados[aid] = {"id": aid, "termo": termo, "texto": (corpo + " | " + extra).strip(" |"),
                              "video": sd or hdv, "video_hd": hdv or sd, "poster": campo(seg, "video_preview_image_url"),
                              "page_id": campo(seg, "page_id") or (re.search(r'"page_id":"?(\d+)', seg) or [None, ""])[1],
                              "page_name": campo(seg, "page_name"),
                              "dias_ativo": (int(time.time()) - int(ini.group(1))) // 86400 if ini else None,
                              "url": f"https://www.facebook.com/ads/library/?id={aid}"}

        termo_atual = [""]

        def ao_responder(r):
            try:
                if ("graphql" in r.url or "ads/library" in r.url) and r.request.resource_type in ("xhr", "fetch", "document"):
                    ler_json(r.text(), termo_atual[0])
            except Exception:
                pass

        pg.on("response", ao_responder)
        for t in a.termos:
            termo_atual[0] = t
            antes = len(dados)
            pg.goto(url(t), wait_until="domcontentloaded", timeout=60000)
            pg.wait_for_timeout(7000)
            if "Nenhum anúncio corresponde" in pg.inner_text("body"):
                print(f"[{t}] nenhum anúncio (se o termo tinha resultado antes, é bloqueio: parar)")
                continue
            for _ in range(a.rolagens):
                pg.mouse.wheel(0, 6000); pg.wait_for_timeout(2500)
            print(f"[{t}] {len(dados) - antes} vídeos novos (total {len(dados)})", flush=True)
            time.sleep(8)
        br.close()
    for ad in dados.values():
        ad["anunciante"] = ad["page_name"]
        ad["precos"] = re.findall(r"R\$\s?[\d\.]{4,}(?:,\d{2})?", ad["texto"])
    todos = dados
    print("com capa:", sum(1 for x in todos.values() if x["poster"]), "de", len(todos))
    Path(a.saida).parent.mkdir(parents=True, exist_ok=True)
    json.dump(list(todos.values()), open(a.saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("salvo:", a.saida)


if __name__ == "__main__":
    main()
