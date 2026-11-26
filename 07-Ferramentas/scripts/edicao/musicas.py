"""Músicas liberadas dos Reels: conferir, baixar (com o clique da pessoa) e pôr no vídeo.

A lista de faixas vem SEMPRE de 06-Referencias/edicao/Musicas liberadas.md (tabela). Música nova: inclua lá.

Comandos (rode na pasta do cofre):
  py -3 07-Ferramentas/scripts/edicao/musicas.py conferir
      mostra as 6 faixas, quais já estão na pasta de músicas e quais faltam.
  py -3 07-Ferramentas/scripts/edicao/musicas.py baixar
      abre no navegador a página de cada faixa que falta. A PESSOA clica em "Baixar" (Download).
      O script espera o arquivo aparecer em Downloads, renomeia com o nome certo e move para a pasta de músicas.
  py -3 07-Ferramentas/scripts/edicao/musicas.py por <video.mp4> --faixa 4 [--saida <novo.mp4>]
      põe a faixa no vídeo (no lugar do som dele), começando no "musica_in" da tabela, com entrada e
      saída suaves e volume em -14 LUFS. Não mexe na imagem. Serve para testar a música ou para bruto sem som.

Pasta de músicas: Documentos\\MOVECON-musicas (troque com --pasta). Downloads: troque com --downloads.
Regras (Musicas liberadas.md): só Pixabay, o robô não baixa sozinho, música viral só pelo app do Instagram.
"""
import argparse, os, re, shutil, subprocess, sys, time, webbrowser
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

COFRE = Path(__file__).resolve().parents[3]
TABELA = COFRE / "06-Referencias" / "edicao" / "Musicas liberadas.md"


def faixas():
    linhas = TABELA.read_text(encoding="utf-8").splitlines()
    out = []
    for ln in linhas:
        m = re.match(r"\|\s*`([^`]+\.mp3)`\s*\|\s*(https://pixabay\.com/\S+?)\s*\|\s*([^|]*)\|\s*([\d.,]+)\s*\|\s*([^|]*)\|", ln)
        if m:
            arq = m.group(1)
            ident = re.search(r"-(\d{5,})\.mp3$", arq).group(1)
            out.append({"n": len(out) + 1, "arquivo": arq, "id": ident, "url": m.group(2), "clima": m.group(3).strip(),
                        "inicio": float(m.group(4).replace(",", ".")), "uso": m.group(5).strip()})
    if not out:
        sys.exit(f"ERRO: não achei a tabela de músicas em {TABELA}. Rode git pull.")
    return out


def documentos():
    # Windows pode mandar Documentos para o OneDrive: tenta os caminhos comuns
    casa = Path.home()
    for p in [casa / "Documents", casa / "OneDrive" / "Documentos", casa / "OneDrive" / "Documents", casa / "Documentos"]:
        if p.exists():
            return p
    return casa


def pasta_padrao():
    return documentos() / "MOVECON-musicas"


def achar(f, pasta):
    """Arquivo da faixa na pasta, pelo número da Pixabay (aceita qualquer nome que tenha o número)."""
    if not pasta.exists():
        return None
    for p in pasta.glob("*.mp3"):
        if f["id"] in p.name:
            return p
    return None


def duracao(arq):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arq)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def tem_ffmpeg():
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        sys.exit("ERRO: ffmpeg não está instalado. Rode:  winget install Gyan.FFmpeg  e depois feche e abra o terminal.")


def conferir(a):
    tem_ffmpeg()
    pasta = Path(a.pasta)
    print(f"Pasta de músicas: {pasta}\n")
    faltam = 0
    for f in faixas():
        p = achar(f, pasta)
        if p and duracao(p) > 1:
            st = f"OK ({duracao(p):.0f} s)"
        elif p:
            st = "ARQUIVO ESTRAGADO: apague e baixe de novo"
            faltam += 1
        else:
            st = "FALTA"
            faltam += 1
        print(f"{f['n']}. {st:<12} {f['arquivo']}\n   clima: {f['clima']} | uso: {f['uso']} | começa em {f['inicio']} s")
    total = len(faixas())
    print(f"\n{total - faltam} prontas, {faltam} faltando." if faltam else "\nTodas as faixas estão prontas.")
    if faltam:
        print("Para baixar as que faltam:  py -3 07-Ferramentas/scripts/edicao/musicas.py baixar")
    return faltam


def baixar(a):
    pasta, dl = Path(a.pasta), Path(a.downloads)
    pasta.mkdir(parents=True, exist_ok=True)
    faltando = [f for f in faixas() if not achar(f, pasta)]
    if not faltando:
        print("Todas as faixas já estão na pasta:", pasta)
        return
    print(f"Faltam {len(faltando)} faixa(s). Vou abrir a página de uma por vez no navegador.")
    print("Em cada página: clique no botão verde 'Baixar' (ou 'Download'). Se pedir login, feche o aviso ou entre")
    print("com a sua conta da Pixabay (grátis). Eu não digito senha nem baixo por robô.\n")
    for f in faltando:
        print(f"-> {f['n']}. {f['arquivo']}\n   {f['url']}")
        webbrowser.open(f["url"])
        fim = time.time() + a.espera
        achou = None
        while time.time() < fim and not achou:
            time.sleep(2)
            for p in dl.glob("*.mp3"):
                # arquivo com o número da faixa (novo ou baixado antes) que parou de crescer (download terminou)
                if f["id"] in p.name:
                    t1 = p.stat().st_size; time.sleep(1.5)
                    if p.stat().st_size == t1 and t1 > 0:
                        achou = p; break
        if not achou:
            print(f"   Não vi o arquivo em {dl} em {a.espera} s. Pulei esta. Rode 'baixar' de novo quando quiser.\n")
            continue
        destino = pasta / f["arquivo"]
        shutil.move(str(achou), destino)
        print(f"   OK: salvo como {destino}\n")
    print("Fim. Confira com:  py -3 07-Ferramentas/scripts/edicao/musicas.py conferir")


def por(a):
    tem_ffmpeg()
    lista = faixas()
    if not 1 <= a.faixa <= len(lista):
        sys.exit(f"ERRO: --faixa vai de 1 a {len(lista)}. Veja a lista com 'conferir'.")
    f = lista[a.faixa - 1]
    mus = achar(f, Path(a.pasta))
    if not mus:
        sys.exit(f"ERRO: a faixa {f['n']} ({f['arquivo']}) não está em {a.pasta}. Rode 'baixar' primeiro.")
    video = Path(a.video)
    if not video.exists():
        sys.exit(f"ERRO: vídeo não encontrado: {video}")
    d = duracao(video)
    if d <= 0:
        sys.exit(f"ERRO: não consegui ler o vídeo {video}.")
    inicio = f["inicio"] if a.inicio is None else a.inicio
    if duracao(mus) - inicio < d:
        inicio = max(0.0, duracao(mus) - d)  # faixa curta: recua o começo para não acabar antes do vídeo
    saida = Path(a.saida) if a.saida else video.with_name(f"{video.stem}-musica{f['n']}.mp4")
    if saida.resolve() == video.resolve():
        sys.exit("ERRO: a saída não pode ter o mesmo nome do vídeo original. Nunca sobrescreva o bruto.")
    af = f"atrim=0:{d:.2f},asetpts=PTS-STARTPTS,afade=t=in:d=0.3,afade=t=out:st={max(0, d - 0.7):.2f}:d=0.7,loudnorm=I=-14:TP=-1.5:LRA=11"
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(video), "-ss", f"{inicio}", "-i", str(mus),
           "-map", "0:v:0", "-map", "1:a:0", "-af", af, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
           "-t", f"{d:.2f}", "-movflags", "+faststart", str(saida)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit("ERRO do ffmpeg:\n" + r.stderr[-1500:])
    print(f"OK: {saida}  ({d:.1f} s, faixa {f['n']} a partir de {inicio} s, -14 LUFS)")


def main():
    ap = argparse.ArgumentParser(description="Músicas liberadas: conferir, baixar e pôr no vídeo.")
    ap.add_argument("--pasta", default=str(pasta_padrao()), help="pasta de músicas (padrão: Documentos\\MOVECON-musicas)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("conferir")
    b = sub.add_parser("baixar")
    b.add_argument("--downloads", default=str(Path.home() / "Downloads"))
    b.add_argument("--espera", type=int, default=180, help="segundos esperando cada download (padrão 180)")
    p = sub.add_parser("por")
    p.add_argument("video")
    p.add_argument("--faixa", type=int, required=True, help="número da faixa (1 a 6, veja 'conferir')")
    p.add_argument("--saida")
    p.add_argument("--inicio", type=float, help="onde a música começa, em segundos (padrão: o da tabela)")
    # --pasta também depois do subcomando
    for s in (b, p, sub.choices["conferir"]):
        s.add_argument("--pasta", default=argparse.SUPPRESS)
    a = ap.parse_args()
    {"conferir": conferir, "baixar": baixar, "por": por}[a.cmd](a)


if __name__ == "__main__":
    main()
