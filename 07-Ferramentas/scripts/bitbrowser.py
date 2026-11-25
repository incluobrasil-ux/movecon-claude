"""Conexão do Claude com um perfil do BitBrowser (API local + Playwright via CDP).

Uso:
    import sys; sys.path.insert(0, r"<pasta desta skill>")
    from bitbrowser import session, close, listar

    with session("NOME-EXATO-DO-PERFIL") as pg:
        pg.goto("https://www.facebook.com/", wait_until="domcontentloaded")
        pg.screenshot(path="prova.png")
    close("NOME-EXATO-DO-PERFIL")

Linha de comando:
    python bitbrowser.py listar            -> mostra nome, número (seq) e id dos perfis
    python bitbrowser.py fechar "PERFIL"   -> fecha a janela do perfil
    python bitbrowser.py porta "PERFIL"    -> porta CDP do perfil (para o ig-postar-lote.mjs)

Requisitos: BitBrowser aberto e logado (API local em 127.0.0.1:54345) e `pip install playwright`.
"""
import contextlib
import json
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright

API = "http://127.0.0.1:54345"


def api(path, body):
    req = urllib.request.Request(API + path, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=60).read().decode())


def listar():
    return api("/browser/list", {"page": 0, "pageSize": 200})["data"]["list"]


def profile_id(profile):
    """Id do perfil pelo nome EXATO (ou pelo próprio id). Se houver dois nomes parecidos, para com erro em vez de chutar."""
    lst = listar()
    name = profile.strip()
    hit = [b for b in lst if b["id"] == name] or [b for b in lst if b["name"].strip() == name]
    if not hit:
        hit = [b for b in lst if b["name"].strip().lower() == name.lower()]
    if len(hit) != 1:
        raise SystemExit(f"perfil {'nao encontrado' if not hit else 'ambiguo'} no BitBrowser: {profile} "
                         + str([(b["name"], b.get("seq"), b["id"]) for b in hit]) + " (use o nome exato ou o id)")
    return hit[0]["id"]


def ws_for(profile):
    """Abre o perfil (se preciso) e devolve o endpoint CDP. Na 1ª abertura o BitBrowser às vezes responde sem `ws`."""
    pid = profile_id(profile)
    r = {}
    for _ in range(3):
        r = api("/browser/open", {"id": pid})
        d = r.get("data")
        if isinstance(d, dict) and d.get("ws"):
            return d["ws"]
        print("BitBrowser abriu sem ws:", r.get("msg") or r, "- tentando de novo")
        time.sleep(5)
    raise SystemExit(f"BitBrowser nao abriu o perfil {profile}: {r.get('msg') or r}")


def close(profile):
    """Fecha a janela do perfil (fazer sempre no fim da tarefa, num comando separado)."""
    return api("/browser/close", {"id": profile_id(profile)})


@contextlib.contextmanager
def session(profile, width=1400, height=1000):
    """Abre UMA aba nova no perfil e fecha só ela ao sair. As abas que já estavam abertas não são tocadas."""
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(ws_for(profile))
        page = browser.contexts[0].new_page()
        page.set_viewport_size({"width": width, "height": height})
        try:
            yield page
        finally:
            try:
                page.close()
            except Exception:
                pass


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    cmd = sys.argv[1] if len(sys.argv) > 1 else "listar"
    if cmd == "listar":
        for b in listar():
            print(f"{b.get('seq', ''):>4}  {b['name']}  ({b['id']})")
    elif cmd == "porta" and len(sys.argv) > 2:
        # porta de depuração (CDP) do perfil: se já estiver aberto, só lê; se estiver fechado, abre
        import re as _re
        m = _re.search(r":(\d+)/", ws_for(sys.argv[2]))
        print(m.group(1) if m else "sem porta")
    elif cmd == "fechar" and len(sys.argv) > 2:
        print(close(sys.argv[2]))
    else:
        print(__doc__)
