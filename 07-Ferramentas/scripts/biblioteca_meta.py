"""Minera a Biblioteca de Anúncios da Meta via Chrome (Playwright), sem token.
Com print de cada anúncio (banco de referências).

Uso:
  python biblioteca_meta.py "compression socks" --pais US [--rolagens 8] [--exato] [--pagina ID] [--saida arquivo.json]
                            [--prints mineracao/<produto>/prints --max-prints 40 --prefixo <concorrente>]

Saída: JSON com cada anúncio + ranking de anunciantes no terminal
(nº de anúncios ativos, mais antigo em dias, criativos repetidos = sinal de escala).
"""
import argparse, json, re, sys, urllib.parse
from pathlib import Path
from collections import Counter, defaultdict
from datetime import date
from playwright.sync_api import sync_playwright

sys.path.insert(0, str(Path(__file__).resolve().parent / "mineracao"))
import registro_buscas  # noqa: E402  avisa termo já buscado e registra a busca (vai para o GitHub)

MESES = {"jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "jun": 6,
         "jul": 7, "ago": 8, "set": 9, "out": 10, "nov": 11, "dez": 12}
LIXO = {"​", "", "Plataformas", "Abrir menu suspenso", "Ver detalhes do anúncio",
        "Patrocinado", "Esse anúncio tem várias versões", "Ativo", "Inativo",
        "Ver resumo", "Ver detalhes do resumo", "Ver detalhes do anúncio"}


def montar_url(a):
    params = {"active_status": "all" if a.inativos else "active", "ad_type": "all",
              "country": a.pais, "media_type": "all"}
    if a.pagina:
        params.update(view_all_page_id=a.pagina, search_type="page")
    else:
        params.update(q=f'"{a.termo}"' if a.exato else a.termo,
                      search_type="keyword_exact_phrase" if a.exato else "keyword_unordered")
    return "https://www.facebook.com/ads/library/?" + urllib.parse.urlencode(params)


def parse_data(s):
    m = re.search(r"(\d{1,2}) de (\w{3})\w* de (\d{4})", s)
    return date(int(m.group(3)), MESES[m.group(2).lower()], int(m.group(1))) if m else None


def parse(texto):
    total = re.search(r"~?[\d\.]+ resultados?", texto)
    blocos = re.split(r"\n(?=Identificação da biblioteca:)", texto)[1:]
    ads = []
    for b in blocos:
        linhas = [l.strip() for l in b.split("\n")]
        ad = {"id": linhas[0].split(":")[-1].strip()}
        inicio = next((l for l in linhas if l.startswith("Veiculação iniciada")), "")
        d = parse_data(inicio)
        ad["inicio"] = d.isoformat() if d else None
        ad["dias_ativo"] = (date.today() - d).days if d else None
        rep = re.search(r"(\d+) anúncios usam", b)
        ad["copias_criativo"] = int(rep.group(1)) if rep else 1
        ad["varias_versoes"] = "várias versões" in b
        uteis = [l for l in linhas[1:] if l not in LIXO and not l.startswith(("Veiculação", "0:00"))
                 and not re.match(r"^\d+ anúncios usam", l) and l not in ("Ativo", "Inativo")]
        # 1ª linha útil = anunciante; demais = copy, URL, título, CTA
        ad["anunciante"] = uteis[0] if uteis else ""
        ad["link"] = next((l.lower() for l in uteis if l.upper().startswith(("HTTP", "WWW."))
                           or re.match(r"^[A-Z0-9\-]+\.(COM|NET|ORG)(\.BR)?", l)), "")
        ad["texto"] = " | ".join(uteis[1:6])[:600]
        ad["url"] = f"https://www.facebook.com/ads/library/?id={ad['id']}"
        ads.append(ad)
    return (total.group(0) if total else "n/d"), ads


def tirar_prints(pg, a):
    """Print do cartão inteiro de cada anúncio (texto + imagem/primeiro quadro), para o banco de referências.
    Sobe do rótulo "Identificação da biblioteca" até o primeiro bloco com altura de cartão."""
    pasta = Path(a.prints)
    pasta.mkdir(parents=True, exist_ok=True)
    rotulos = pg.get_by_text(re.compile(r"Identificação da biblioteca:\s*\d+"))
    feitos = {}
    for i in range(min(rotulos.count(), a.max_prints)):
        r = rotulos.nth(i)
        try:
            ident = re.search(r"\d{6,}", r.inner_text()).group()
            cartao = r.evaluate_handle(
                "el => { let e = el; while (e.parentElement && e.getBoundingClientRect().height < 380) "
                "e = e.parentElement; return e; }").as_element()
            nome = f"{a.prefixo + '-' if a.prefixo else ''}{ident}.png"
            # no centro da tela: a barra fixa do topo não cobre o cabeçalho (identificação e data)
            cartao.evaluate("e => e.scrollIntoView({block: 'center'})")
            pg.wait_for_timeout(800)
            cartao.screenshot(path=str(pasta / nome))
            feitos[ident] = f"prints/{nome}"
        except Exception as e:
            print("print falhou:", i, e, flush=True)
    print(f"prints salvos: {len(feitos)} em {pasta}", flush=True)
    return feitos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("termo", nargs="?", default="")
    ap.add_argument("--pais", default="BR")
    ap.add_argument("--rolagens", type=int, default=8, help="cada rolagem carrega ~30 anúncios")
    ap.add_argument("--exato", action="store_true")
    ap.add_argument("--inativos", action="store_true")
    ap.add_argument("--pagina", help="ID da página do anunciante")
    ap.add_argument("--saida")
    ap.add_argument("--ver", action="store_true", help="abre o Chrome visível")
    ap.add_argument("--prints", help="pasta onde salvar o print de cada anúncio")
    ap.add_argument("--max-prints", type=int, default=40)
    ap.add_argument("--prefixo", default="", help="início do nome do arquivo (ex.: o concorrente)")
    a = ap.parse_args()
    url = montar_url(a)
    chave = a.termo or f"pagina:{a.pagina}"
    registro_buscas.avisar(chave, "biblioteca_meta")

    with sync_playwright() as p:
        b = p.chromium.launch(channel="chrome", headless=not a.ver)
        pg = b.new_page(locale="pt-BR", user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36")
        pg.goto(url, timeout=60000)
        pg.wait_for_timeout(7000)
        for _ in range(a.rolagens):
            pg.mouse.wheel(0, 6000)
            pg.wait_for_timeout(2000)
        texto = pg.inner_text("body")
        prints = tirar_prints(pg, a) if a.prints else {}
        b.close()

    total, ads = parse(texto)
    for ad in ads:
        ad["print"] = prints.get(ad["id"], "")
    saida = a.saida or f"biblioteca_{re.sub(r'\W+', '_', a.termo or a.pagina)}.json"
    with open(saida, "w", encoding="utf-8") as f:
        json.dump({"url": url, "total": total, "ads": ads}, f, ensure_ascii=False, indent=1)
    registro_buscas.registrar("biblioteca_meta", chave, a.pais, ("inativos" if a.inativos else "ativos") if ads else "vazio",
                              len(ads), saida)

    por = defaultdict(list)
    for ad in ads:
        por[ad["anunciante"]].append(ad)
    print(f"Busca: {url}\nTotal na biblioteca: {total} | coletados: {len(ads)} | salvo em {saida}\n")
    print(f"{'Anunciante':38} {'ads':>4} {'+antigo(d)':>10} {'copias':>6} {'repet.':>6}  link")
    ranking = sorted(por.items(), key=lambda kv: (-len(kv[1]), -max(x["dias_ativo"] or 0 for x in kv[1])))
    for nome, lst in ranking:
        textos = Counter(x["texto"][:120] for x in lst)
        print(f"{nome[:38]:38} {len(lst):>4} {max(x['dias_ativo'] or 0 for x in lst):>10} "
              f"{sum(x['copias_criativo'] for x in lst):>6} {textos.most_common(1)[0][1]:>6}  "
              f"{next((x['link'] for x in lst if x['link']), '')[:40]}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
