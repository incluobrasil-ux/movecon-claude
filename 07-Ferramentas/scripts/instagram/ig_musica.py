"""Reel com música em alta, postado do PC, pela API OFICIAL de áudio do Instagram (Meta, 01/06/2026).

Por que existe: música viral não pode ser colada dentro do arquivo (o Instagram reconhece e deixa mudo) e o
Instagram no computador não tem o botão de música. Pela API, a Meta anexa a música na hora de publicar,
com a licença dela, e o Reel sai com o nome da música, igual ao feito no celular.

Configuração (uma vez, feita pelo Samuel): 06-Referencias/edicao/Musica em alta pela API.md
O token fica SÓ em %USERPROFILE%\\.movecon\\meta-instagram.json (fora do cofre e do GitHub). Nunca cole o token no chat.

Comandos (na pasta do cofre):
  py -3 07-Ferramentas/scripts/instagram/ig_musica.py configurar
      cria o arquivo do token e abre no Bloco de Notas para a pessoa colar.
  py -3 07-Ferramentas/scripts/instagram/ig_musica.py contas
      mostra as contas do Instagram que o token alcança e quando o token vence.
  py -3 07-Ferramentas/scripts/instagram/ig_musica.py em-alta --conta <@conta> [--tipo musica|original] [--busca "sertanejo"]
      lista as músicas (ou áudios originais) em alta, numeradas, e salva a lista em 10-Trabalho/.
  py -3 07-Ferramentas/scripts/instagram/ig_musica.py postar <video.mp4> --conta <@conta> --audio <audio_id>
        --legenda <arquivo.txt ou texto> [--vol-musica 100] [--vol-video 0] [--url <link público do mp4>] [--publicar]
      SEM --publicar é teste: envia o vídeo, prepara o Reel com a música e PARA sem publicar (expira em 24 h).
      COM --publicar: publica, confere a música no ar e mostra o link. Só com OK escrito do Samuel.

Regras: nada vai ao ar sem OK escrito; um post por vez, no ritmo da agenda; parou com erro de conta,
limite ou verificação: pare e avise. A API não deixa escolher o trecho da música (toca do ponto padrão da Meta).
"""
import argparse, csv, datetime as dt, json, os, re, subprocess, sys, time, urllib.error, urllib.parse, urllib.request
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

COFRE = Path(__file__).resolve().parents[3]
CONFIG = Path(os.environ.get("USERPROFILE", str(Path.home()))) / ".movecon" / "meta-instagram.json"
GRAPH = "https://graph.facebook.com"
MODELO = {"token": "COLE_AQUI_O_TOKEN_DE_60_DIAS", "contas": {}}
ERROS = {  # subcódigos conhecidos (docs da Meta e projetos que já usaram a API)
    2207065: "essa música não está liberada para esta conta. Escolha outra da lista em-alta.",
    2207042: "a conta passou do limite de posts pela API em 24 h. Pare e tente amanhã.",
    2207026: "o vídeo não está no formato aceito (veja duração, tamanho e codec).",
}


def sair(msg, code=1):
    print(msg)
    sys.exit(code)


# ---------------- configuração ----------------
def ler_config():
    if not CONFIG.exists():
        sair(f"ERRO: falta configurar o token. Rode: py -3 07-Ferramentas/scripts/instagram/ig_musica.py configurar\n"
             f"(passo a passo em 06-Referencias/edicao/Musica em alta pela API.md)")
    try:
        cfg = json.loads(CONFIG.read_text(encoding="utf-8-sig"))
    except json.JSONDecodeError as e:
        sair(f"ERRO: o arquivo {CONFIG} ficou com erro de digitação ({e}). Abra e confira as aspas.")
    tok = str(cfg.get("token", "")).strip()
    if not tok or tok.startswith("COLE_AQUI"):
        sair(f"ERRO: o token ainda não foi colado em {CONFIG}. Rode 'configurar'.")
    cfg["token"] = tok
    cfg.setdefault("contas", {})
    return cfg


def salvar_config(cfg):
    CONFIG.parent.mkdir(parents=True, exist_ok=True)
    CONFIG.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")


def mascarar(t):
    return t[:6] + "…" + t[-4:] if len(t) > 12 else "…"


# ---------------- chamadas à API ----------------
def chamar(metodo, caminho, params=None, token=None, dados=None, headers=None, url=None):
    params = dict(params or {})
    if token and not headers:
        params["access_token"] = token
    alvo = url or f"{GRAPH}/{caminho.lstrip('/')}"
    corpo = None
    if metodo == "GET":
        alvo += ("&" if "?" in alvo else "?") + urllib.parse.urlencode(params)
    elif dados is not None:
        corpo = dados
    else:
        corpo = urllib.parse.urlencode(params).encode()
    req = urllib.request.Request(alvo, data=corpo, method=metodo, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=600) as r:
            txt = r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        txt = e.read().decode("utf-8", "replace")
        try:
            j = json.loads(txt)
        except json.JSONDecodeError:
            raise RuntimeError(f"HTTP {e.code}: {txt[:500]}")
        raise RuntimeError(explicar(j))
    except urllib.error.URLError as e:
        raise RuntimeError(f"sem conexão com a Meta ({e.reason}). Confira a internet.")
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        return {"_texto": txt}


def explicar(j):
    e = j.get("error") or j.get("debug_info") or j
    sub = e.get("error_subcode")
    base = f"{e.get('message') or e}"
    extra = ""
    if sub in ERROS:
        extra = " → " + ERROS[sub]
    elif e.get("code") == 190:
        extra = " → o token venceu ou foi trocado a senha. Gere outro (passo 4 do guia) e rode 'configurar'."
    elif e.get("code") in (10, 200):
        extra = " → falta permissão no token (instagram_basic, instagram_content_publish, pages_show_list...)."
    elif e.get("code") in (4, 17, 32, 613):
        extra = " → limite de uso da API. PARE e tente mais tarde."
    return f"Meta respondeu: {base} (código {e.get('code')}, sub {sub}){extra}"


def contas_do_token(tok):
    r = chamar("GET", "me/accounts", {"fields": "name,instagram_business_account{id,username}", "limit": 100}, tok)
    out = {}
    for p in r.get("data", []):
        ig = p.get("instagram_business_account")
        if ig and ig.get("username"):
            out[ig["username"].lower()] = {"id": ig["id"], "pagina": p.get("name", "")}
    return out


def id_da_conta(cfg, conta):
    nome = conta.lstrip("@").lower().strip()
    if nome not in cfg["contas"]:
        cfg["contas"] = {k: v["id"] for k, v in contas_do_token(cfg["token"]).items()}
        salvar_config(cfg)
    if nome not in cfg["contas"]:
        sair(f"ERRO: a conta @{nome} não aparece neste token. Ela precisa ser profissional (criador ou comercial) "
             f"e estar ligada a uma Página do Facebook. Rode 'contas' para ver as que aparecem.")
    return cfg["contas"][nome]


# ---------------- comandos ----------------
def cmd_configurar(a):
    if not CONFIG.exists():
        salvar_config(MODELO)
        print(f"Criei {CONFIG}.")
    print("Abrindo no Bloco de Notas. Cole o token no lugar de COLE_AQUI_O_TOKEN_DE_60_DIAS, salve e feche.")
    print("NUNCA cole o token no chat do Claude nem em arquivo do cofre.")
    if os.name == "nt":
        subprocess.run(["notepad.exe", str(CONFIG)])
    else:
        print(f"Edite: {CONFIG}")
    cfg = ler_config()
    print("Token lido:", mascarar(cfg["token"]), "→ agora rode: ... ig_musica.py contas")


def cmd_contas(a):
    cfg = ler_config()
    try:
        info = chamar("GET", "debug_token", {"input_token": cfg["token"]}, cfg["token"]).get("data", {})
        vence = info.get("expires_at") or info.get("data_access_expires_at")
        if vence:
            d = dt.datetime.fromtimestamp(vence)
            print(f"Token {mascarar(cfg['token'])} vence em {d:%d/%m/%Y %H:%M} ({(d - dt.datetime.now()).days} dias).")
        perms = info.get("scopes")
        if perms:
            falta = [p for p in ("instagram_basic", "instagram_content_publish", "pages_show_list") if p not in perms]
            print("Permissões:", ", ".join(perms), "| FALTAM: " + ", ".join(falta) if falta else "| ok")
    except RuntimeError as e:
        print("(não consegui ler a validade do token:", e, ")")
    contas = contas_do_token(cfg["token"])
    if not contas:
        sair("Nenhuma conta do Instagram apareceu. Ligue a conta profissional a uma Página do Facebook (passo 2 do guia).")
    cfg["contas"] = {k: v["id"] for k, v in contas.items()}
    salvar_config(cfg)
    print("\nContas que este token alcança:")
    for k, v in contas.items():
        print(f"  @{k}  (id {v['id']}, página {v['pagina']})")


def cmd_em_alta(a):
    cfg = ler_config()
    uid = id_da_conta(cfg, a.conta)
    tipo = {"musica": "music", "original": "original_sound"}[a.tipo]
    params = {"audio_type": tipo, "user_id": uid}
    if a.busca:
        params["search_query"] = a.busca
    itens, prox = [], None
    try:
        r = chamar("GET", "ig_audio", params, cfg["token"])
        while True:
            itens += r.get("audio") or r.get("data") or []
            prox = (r.get("paging") or {}).get("next")
            if len(itens) >= a.qtd or not prox:
                break
            r = chamar("GET", "", url=prox)
    except RuntimeError as e:
        sair(f"ERRO: {e}")
    itens = itens[: a.qtd]
    if not itens:
        sair("A Meta não devolveu nenhum áudio para essa busca. Tente outra palavra ou sem --busca (em alta).")
    pasta = COFRE / "10-Trabalho" / f"{dt.date.today():%Y-%m-%d}-musicas-em-alta"
    pasta.mkdir(parents=True, exist_ok=True)
    rot = re.sub(r"[^a-z0-9]+", "-", (a.busca or "em-alta").lower()).strip("-")
    arq = pasta / f"{a.conta.lstrip('@')}-{a.tipo}-{rot}.csv"
    with open(arq, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["n", "audio_id", "titulo", "artista_ou_perfil", "duracao_s", "pode_anuncio", "previa"])
        for i, x in enumerate(itens, 1):
            quem = x.get("display_artist") or x.get("ig_username") or ""
            prev = x.get("on_platform_audio_preview_link") or x.get("download_url") or ""
            ads = {True: "sim", False: "não"}.get(x.get("is_ads_eligible"), "sem dado")
            seg = round((x.get("duration_in_ms") or 0) / 1000)
            w.writerow([i, x.get("audio_id"), x.get("title", ""), quem, seg, ads, prev])
            print(f"{i:>2}. {x.get('title', '')[:45]:<45} | {quem[:25]:<25} | {seg:>3} s | anúncio: {ads:<8} | id {x.get('audio_id')}")
    print(f"\nLista salva em {arq}")
    print("Ouça pela prévia (coluna 'previa' da planilha) antes de escolher. Música com palavrão: não use.")


def checar_video(v):
    if not v.exists():
        sair(f"ERRO: vídeo não encontrado: {v}")
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,width,height,sample_rate",
                        "-of", "json", str(v)], capture_output=True, text=True)
    if r.returncode:
        sair("ERRO: não consegui ler o vídeo com o ffprobe (o ffmpeg está instalado?).")
    j = json.loads(r.stdout)
    d = float(j["format"]["duration"])
    vid = next((s for s in j["streams"] if s["codec_type"] == "video"), {})
    aud = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    mb = v.stat().st_size / 1e6
    prob = []
    if not 3 <= d <= 900: prob.append(f"duração {d:.1f} s (Reel pela API: 3 s a 15 min)")
    if mb > 300: prob.append(f"{mb:.0f} MB (máximo 300 MB)")
    if vid.get("codec_name") not in ("h264", "hevc"): prob.append(f"vídeo em {vid.get('codec_name')} (use H.264)")
    if aud and aud.get("sample_rate") not in ("44100", "48000"): prob.append(f"áudio em {aud.get('sample_rate')} Hz (use 48000)")
    if prob:
        sair("ERRO: o vídeo não passa no formato do Reel: " + "; ".join(prob))
    print(f"Vídeo ok: {v.name} | {d:.1f} s | {vid.get('width')}x{vid.get('height')} | {mb:.1f} MB | som: {'sim' if aud else 'não'}")
    return d


def ler_legenda(x):
    p = Path(x)
    if p.exists() and p.is_file():
        return p.read_text(encoding="utf-8-sig").strip()
    return x.strip()


def ja_no_ar(tok, uid, legenda):
    chave = legenda.splitlines()[0].strip()[:80] if legenda else ""
    if not chave:
        return None
    r = chamar("GET", f"{uid}/media", {"fields": "caption,permalink", "limit": 15}, tok)
    for m in r.get("data", []):
        if chave and chave in (m.get("caption") or ""):
            return m.get("permalink")
    return None


def cmd_postar(a):
    cfg = ler_config()
    tok, uid = cfg["token"], id_da_conta(cfg, a.conta)
    video = Path(a.video)
    checar_video(video)
    legenda = ler_legenda(a.legenda)
    if len(legenda) > 2200:
        sair(f"ERRO: legenda com {len(legenda)} caracteres (máximo 2.200).")
    try:
        link = ja_no_ar(tok, uid, legenda)
    except RuntimeError as e:
        sair(f"ERRO ao conferir o que já está no ar: {e}")
    if link:
        sair(f"PULADO: essa legenda já está no ar em {link}. Nada foi enviado.", 0)
    # a API aceita volume de 1 a 100; vídeo editado com "musica": "app" já sai mudo, então 1 = sem som do vídeo
    audio = {"audio_id": str(a.audio), "audio_volume": max(1, min(100, a.vol_musica)), "video_volume": max(1, min(100, a.vol_video))}
    base = {"media_type": "REELS", "caption": legenda, "share_to_feed": "true", "audio_configuration": json.dumps(audio)}
    try:
        if a.url:
            print("Enviando pelo link público…")
            c = chamar("POST", f"{uid}/media", {**base, "video_url": a.url}, tok)
            cid = c["id"]
        else:
            print("Enviando o arquivo direto para a Meta…")
            c = chamar("POST", f"{uid}/media", {**base, "upload_type": "resumable"}, tok)
            cid, uri = c["id"], c.get("uri") or f"https://rupload.facebook.com/ig-api-upload/{c['id']}"
            dados = video.read_bytes()
            r = chamar("POST", "", url=uri, dados=dados,
                       headers={"Authorization": f"OAuth {tok}", "offset": "0", "file_size": str(len(dados)),
                                "Content-Type": "application/octet-stream"})
            if not r.get("success", True):
                raise RuntimeError(f"envio direto recusado: {r}")
    except RuntimeError as e:
        sair(f"ERRO: {e}\nSe foi no envio do arquivo, tente de novo com --url <link público do mp4> (veja o guia).")
    print(f"Reel preparado (container {cid}). Esperando a Meta processar…")
    fim = time.time() + 600
    st = {}
    while time.time() < fim:
        try:
            st = chamar("GET", cid, {"fields": "status_code,status"}, tok)
        except RuntimeError as e:
            sair(f"ERRO ao acompanhar o processamento: {e}. Nada foi publicado.")
        if st.get("status_code") in ("FINISHED", "ERROR", "EXPIRED"):
            break
        time.sleep(6)
    if st.get("status_code") != "FINISHED":
        sair(f"ERRO: a Meta não terminou de processar: {st}. Nada foi publicado.")
    saida = {"data": dt.datetime.now().isoformat(timespec="seconds"), "conta": a.conta, "video": str(video),
             "audio": audio, "container": cid}
    if not a.publicar:
        print("TESTE OK: vídeo processado com a música, NÃO publicado (o rascunho some sozinho em 24 h).")
        print("Para publicar de verdade, com OK escrito do Samuel, rode o mesmo comando com --publicar.")
        return
    try:
        pub = chamar("POST", f"{uid}/media_publish", {"creation_id": cid}, tok)
        mid = pub["id"]
        info = chamar("GET", mid, {"fields": "permalink,media_audio_type,caption,timestamp"}, tok)
    except RuntimeError as e:
        sair(f"ERRO ao publicar: {e}")
    saida.update({"media_id": mid, "link": info.get("permalink"), "tipo_audio": info.get("media_audio_type")})
    reg = video.with_suffix(".postado-api.json")
    reg.write_text(json.dumps(saida, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"PUBLICADO: {info.get('permalink')}")
    print(f"Áudio no ar: {info.get('media_audio_type') or 'sem dado'} (MUSIC = música da biblioteca; confira no Reel)")
    print(f"Registro: {reg}. Copie a linha para 05-Operacao/registros/publicados-AAAA-MM.md.")


def main():
    ap = argparse.ArgumentParser(description="Reel com música em alta pela API oficial do Instagram.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("configurar")
    sub.add_parser("contas")
    e = sub.add_parser("em-alta")
    e.add_argument("--conta", required=True)
    e.add_argument("--tipo", choices=["musica", "original"], default="musica")
    e.add_argument("--busca")
    e.add_argument("--qtd", type=int, default=30)
    p = sub.add_parser("postar")
    p.add_argument("video")
    p.add_argument("--conta", required=True)
    p.add_argument("--audio", required=True)
    p.add_argument("--legenda", required=True)
    p.add_argument("--vol-musica", type=int, default=100)
    p.add_argument("--vol-video", type=int, default=0)
    p.add_argument("--url")
    p.add_argument("--publicar", action="store_true")
    a = ap.parse_args()
    {"configurar": cmd_configurar, "contas": cmd_contas, "em-alta": cmd_em_alta, "postar": cmd_postar}[a.cmd](a)


if __name__ == "__main__":
    main()
