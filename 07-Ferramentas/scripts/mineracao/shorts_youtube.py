"""Vídeos brutos do YouTube Shorts, SEM LOGIN (26/11/2026).

Por que existe: no nicho agro (trator, colheitadeira, máquina pesada) quase ninguém paga anúncio de vídeo na Meta,
mas as revendas postam muito Shorts. A busca do YouTube abre sem conta.
  1. busca cada termo no YouTube (yt-dlp, sem login) e pega os N primeiros resultados;
  2. lê cada vídeo (título, descrição, canal, data, formato) e fica SÓ com vídeo em pé (altura > largura) e curto;
  3. grava no MESMO formato do brutos_meta.py: siga com a peneira de sempre
     py -3 07-Ferramentas/scripts/mineracao/triagem_brutos.py <pasta>/shorts.json --pasta <pasta> --palavras "..."

Vídeo já analisado em qualquer PC (memoria-mineracao.jsonl) é pulado. Cada busca vai para buscas-feitas.csv.
"Sign in to confirm you're not a bot" = bloqueio: PARA e avisa (não contorne).
"dias_ativo" aqui é dias desde a POSTAGEM.

Uso: py -3 07-Ferramentas/scripts/mineracao/shorts_youtube.py "colheitadeira à venda" "trator 7230j" --saida <pasta>/shorts.json [--por-termo 30] [--max-dur 180]
"""
import argparse, json, re, subprocess, sys, time
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import registro_buscas  # noqa: E402

TRAVA = re.compile(r"confirm you.re not a bot|Sign in to confirm|HTTP Error 429", re.I)
ESPERA = 2  # segundos entre leituras de vídeo


def ytdlp(*args, timeout=180):
    r = subprocess.run([sys.executable, "-m", "yt_dlp", *args], capture_output=True, text=True, encoding="utf-8", errors="ignore", timeout=timeout)
    if TRAVA.search(r.stderr or ""):
        raise SystemExit("PAREI: o YouTube pediu confirmação de robô/login. Não contorne; tente mais tarde.\n" + r.stderr[-300:])
    return r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("termos", nargs="+")
    ap.add_argument("--saida", required=True)
    ap.add_argument("--por-termo", type=int, default=30)
    ap.add_argument("--max-dur", type=int, default=180)
    a = ap.parse_args()
    saida = Path(a.saida); saida.parent.mkdir(parents=True, exist_ok=True)
    dados = {x["id"]: x for x in json.loads(saida.read_text(encoding="utf-8"))} if saida.exists() else {}
    memoria = registro_buscas.ler_memoria()
    for termo in a.termos:
        registro_buscas.avisar(termo, "shorts_youtube")
        r = ytdlp("--flat-playlist", "-J", f"ytsearch{a.por_termo}:{termo} shorts")
        try:
            ents = json.loads(r.stdout).get("entries", [])
        except Exception:
            ents = []
        novos = 0
        for e in ents:
            vid = e.get("id")
            if not vid or ("yt" + vid) in dados or ("yt" + vid) in memoria:
                continue
            dur = e.get("duration") or 0
            if dur and dur > a.max_dur:
                continue
            rr = ytdlp("-j", "--skip-download", f"https://www.youtube.com/shorts/{vid}")
            time.sleep(ESPERA)
            try:
                j = json.loads(rr.stdout.splitlines()[0])
            except Exception:
                continue
            w, h = j.get("width") or 0, j.get("height") or 0
            if not (h > w):
                continue
            fm = [f for f in j.get("formats", []) if f.get("vcodec") not in (None, "none") and f.get("url") and (f.get("height") or 0) <= 1920]
            best = max(fm, key=lambda f: ((f.get("height") or 0), f.get("acodec") not in (None, "none"))) if fm else {}
            up = j.get("upload_date")
            dias = (datetime.now() - datetime.strptime(up, "%Y%m%d")).days if up else None
            texto = (j.get("title") or "") + " | " + (j.get("description") or "")
            dados["yt" + vid] = {"id": "yt" + vid, "texto": texto[:1500], "video": best.get("url", ""), "poster": j.get("thumbnail", ""),
                                 "page_id": "youtube:" + (j.get("channel_id") or ""), "page_name": j.get("channel") or j.get("uploader") or "",
                                 "dias_ativo": dias, "postado_em": up, "url": j.get("webpage_url"), "w": w, "h": h, "dur": j.get("duration"),
                                 "precos": re.findall(r"R\$\s?[\d\.]{4,}(?:,\d{2})?", texto), "termo": termo}
            novos += 1
        print(f"[{termo}] {novos} Shorts em pé novos (total {len(dados)})", flush=True)
        registro_buscas.registrar("shorts_youtube", termo, "BR", "ativos" if novos else "vazio", novos, str(saida))
        saida.write_text(json.dumps(list(dados.values()), ensure_ascii=False, indent=1), encoding="utf-8")
        time.sleep(5)
    print("salvo:", saida)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
