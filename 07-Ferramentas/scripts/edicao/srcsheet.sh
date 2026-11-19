#!/bin/bash
# srcsheet.sh src out.jpg cols t1 t2 ...  (grid 192px source)
S=$1; O=$2; C=$3; shift 3; i=0; d=$(mktemp -d)
for t in "$@"; do ffmpeg -v error -y -ss $t -i "$S" -frames:v 1 -vf "scale=320:-2,drawgrid=w=32:h=1000:c=red@0.4,drawtext=text='$t':fontcolor=yellow:fontsize=20:x=4:y=4:box=1:boxcolor=black@0.5" $d/$(printf %03d $i).png; i=$((i+1)); done
ffmpeg -v error -y -pattern_type glob -i "$d/*.png" -vf "tile=${C}x$(( (i+C-1)/C ))" -frames:v 1 "$O"; rm -r $d
