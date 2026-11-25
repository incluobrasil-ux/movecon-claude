"""Vídeos brutos do TikTok a partir de LINKS (25/11/2026).

Por que links: sem login, o TikTok mostra captcha ("Arraste o controle") na busca, na hashtag e no perfil, e a regra
do cofre proíbe resolver ou contornar captcha. A página de UM vídeo abre sem login. Então:
  1. a pessoa procura no app do TikTok do jeito normal (só olhando) e copia o link dos vídeos bons;
  2. este script abre cada link num Chrome sem login, lê a legenda (preço), a data, o perfil e o formato,
     e baixa o vídeo na maior qualidade da página (até 1080x1920);
  3. a saída tem o MESMO formato do brutos_meta.py: siga com a peneira de sempre
     py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta>/tiktok.json --pasta <pasta> [--palavras ...]

Link já analisado em qualquer PC (memoria-mineracao.jsonl) é pulado. Captcha ou pedido de login: PARA tudo e avisa.
"dias_ativo" aqui é dias desde a POSTAGEM (TikTok não mostra tempo de anúncio no ar).

Uso: py -3 07-Ferramentas/scripts/mineracao/tiktok_links.py <links.txt> --saida <pasta>/tiktok.json [--termo "o que foi buscado no app"]
"""
import argparse, json, re, subprocess, sys, time
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import registro_buscas  # noqa: E402

from playwright.sync_api import sync_playwright

TRAVA = re.compile(r"Arraste o controle|Drag the slider|Verifique para continuar|Verify to continue|Fa[çc]a login para|Log in to TikTok", re.I)
ESPERA = 8  # segundos entre um link e outro (ritmo do cofre: 5 a 10 s)


def ler_links(arq):
    txt = Path(arq).read_text(encoding="utf-8", errors="ignore")
    vistos, out = set(), []
    for u in re.findall(r"https?://(?:www\.|vm\.|vt\.|m\.)?tiktok\.com/[^\s\"'<>]+", txt):
        u = u.rstrip(").,;")
        if u not in vistos:
            vistos.add(u); out.append(u)
    return out


def melhor_variante(v):
    """Maior altura até 1920 (1080x1920 > 720x1280 > 576x1024)."""
    op = []
    for bi in v.get("bitrateInfo") or []:
        pa = bi.get("PlayAddr") or {}
        urls = pa.get("UrlList") or []
        if urls:
            op.append((pa.get("Height") or 0, pa.get("Width") or 0, urls[0]))
    op = [o for o in op if o[0] <= 1920]
    if op:
        return max(op)
    return (v.get("height") or 0, v.get("width") or 0, v.get("playAddr") or v.get("downloadAddr") or "")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("links", help="arquivo de texto com os links (um por linha; pode colar texto com links no meio)")
    ap.add_argument("--saida", required=True, help="<pasta da tarefa>/tiktok.json")
    ap.add_argument("--termo", default="", help="o que foi buscado no app (fica registrado em buscas-feitas.csv)")
    a = ap.parse_args()
    saida = Path(a.saida); pasta_v = saida.parent / "tiktok-videos"; pasta_v.mkdir(parents=True, exist_ok=True)
    feitos = {r["id"]: r for r in json.loads(saida.read_text(encoding="utf-8"))} if saida.exists() else {}
    memoria = registro_buscas.ler_memoria()
    links = ler_links(a.links)
    print(f"{len(links)} links | memória compartilhada: {len(memoria)} já analisados", flush=True)
    novos, parou = 0, ""
    with sync_playwright() as p:
        br = p.chromium.launch(channel="chrome", headless=True)
        ctx = br.new_context(locale="pt-BR", viewport={"width": 1300, "height": 1000})
        pg = ctx.new_page()
        for i, u in enumerate(links):
            m = re.search(r"/video/(\d{15,})", u)
            if m and ("tt" + m.group(1) in memoria or "tt" + m.group(1) in feitos):
                print(f"[{m.group(1)}] já analisado: pulei"); continue
            if i:
                time.sleep(ESPERA)
            try:
                pg.goto(u, timeout=60000, wait_until="domcontentloaded")
                pg.wait_for_timeout(8000)
            except Exception as e:
                print(f"[{u}] não abriu: {str(e)[:80]}"); continue
            m = re.search(r'<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)</script>', pg.content(), re.S)
            det = json.loads(m.group(1)).get("__DEFAULT_SCOPE__", {}).get("webapp.video-detail", {}) if m else {}
            it = (det.get("itemInfo") or {}).get("itemStruct") or {}
            if not it:
                if TRAVA.search(pg.inner_text("body")):
                    parou = "o TikTok pediu captcha ou login"; break
                print(f"[{u}] página sem dados do vídeo (apagado ou privado): pulei"); continue
            vid = "tt" + str(it["id"])
            if vid in memoria or vid in feitos:
                print(f"[{it['id']}] já analisado: pulei"); continue
            v = it.get("video") or {}
            h, w, url_v = melhor_variante(v)
            arq = pasta_v / f"{it['id']}.mp4"
            if url_v and not arq.exists():
                r = ctx.request.get(url_v, headers={"Referer": "https://www.tiktok.com/"}, timeout=120000)
                if r.status == 200 and len(r.body()) > 50000:
                    arq.write_bytes(r.body())
            if not arq.exists():
                print(f"[{it['id']}] vídeo não baixou: pulei"); continue
            autor = it.get("author") or {}
            criado = int(it.get("createTime") or 0)
            feitos[vid] = {"id": vid, "fonte": "tiktok", "termo": a.termo or "links", "texto": it.get("desc") or "",
                           "video": str(arq.resolve()), "video_hd": str(arq.resolve()), "poster": v.get("cover") or "",
                           "page_id": "tiktok:" + (autor.get("uniqueId") or ""), "page_name": "@" + (autor.get("uniqueId") or ""),
                           "anunciante": "@" + (autor.get("uniqueId") or ""),
                           "dias_ativo": (int(time.time()) - criado) // 86400 if criado else None,
                           "postado_em": datetime.fromtimestamp(criado).strftime("%Y-%m-%d") if criado else "sem dado",
                           "largura": w, "altura": h, "duracao": v.get("duration"),
                           "url": f"https://www.tiktok.com/@{autor.get('uniqueId', '')}/video/{it['id']}",
                           "precos": re.findall(r"R\$\s?[\d\.]{4,}(?:,\d{2})?", it.get("desc") or "")}
            novos += 1
            saida.write_text(json.dumps(list(feitos.values()), ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"[{it['id']}] @{autor.get('uniqueId', '')} {w}x{h} {v.get('duration')} s, postado {feitos[vid]['postado_em']}, "
                  f"preço: {', '.join(feitos[vid]['precos']) or 'sem'}", flush=True)
        br.close()
    registro_buscas.registrar("tiktok_links", a.termo or f"links ({Path(a.links).name})", "BR",
                              "parou" if parou else "ok", novos, saida)
    print(f"novos: {novos} | total no arquivo: {len(feitos)} | salvo em {saida}")
    if parou:
        print(f"PAREI: {parou}. Não tente de novo agora; volte em 1 a 2 h e avise o operador.")
    print(f"Próximo passo: py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py {saida} --pasta {saida.parent}")


if __name__ == "__main__":
    main()
