#!/usr/bin/env bash
# Uso: loudnorm-2pass.sh entrada.mp4 saida.mp4 [alvo_LUFS=-14] [true_peak=-1.5]
# Mede (passo 1) e aplica ganho linear (passo 2). Vídeo copiado sem recodificar.
set -euo pipefail
IN="$1"; OUT="$2"; I="${3:--14}"; TP="${4:--1.5}"; LRA=11
J=$(ffmpeg -hide_banner -nostats -i "$IN" -af loudnorm=I=$I:TP=$TP:LRA=$LRA:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -y -i "$IN" -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -c:v copy -c:a aac -b:a 192k -ar 48000 "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128 -f null - 2>&1 | grep -A2 "Integrated loudness" | tail -2
