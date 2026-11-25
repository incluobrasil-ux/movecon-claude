# Exemplos de marcação de placa (sementes) do lote de caminhão aprovado em 25/11/2026

Arquivos de entrada do `tampa_plaquetas.py`, copiados de `10-Trabalho/2026-11-25-brutos-caminhao/edicao/sementes/`. Os vídeos ficam fora do GitHub; aqui está só o formato.

- `01.json` e `02.json`: plaqueta comum. Uma semente por tomada, com `de` e `ate` separando os cortes de cena.
- `05.json` e `16.json`: `"fundo": "fora"`, para adesivo no vidro. Reconstrói pelo entorno.
- `14.json`: `"fundo": "escuro"`, para letreiro de letra clara.

Cada semente: `{"t": <segundo>, "q": [[x,y],[x,y],[x,y],[x,y]]}`. São os 4 cantos da área a tampar, em pixels do clipe, no instante `t`.

**Como marcar:**
1. Tire o quadro com `ffmpeg -ss <t> -i clipe.mp4 -frames:v 1 q.jpg`.
2. Olhe o quadro e anote os 4 cantos.
3. Rode o `tampa_plaquetas.py` com `--debug`, que desenha o contorno, e confira.
4. Rode sem `--debug`.
