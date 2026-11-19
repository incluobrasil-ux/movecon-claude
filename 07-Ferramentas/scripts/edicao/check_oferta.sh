#!/bin/bash
# check_oferta.sh video.mp4 outdir -> frames 0.5/3/7.5/14.8, ffprobe, volumedetect, md5
v=$1; d=$2; mkdir -p $d
for t in 0.5 3 7.5 14.8; do ffmpeg -v error -y -ss $t -i $v -frames:v 1 -q:v 3 $d/f_$t.jpg; done
ffmpeg -v error -y -i $d/f_0.5.jpg -i $d/f_3.jpg -i $d/f_7.5.jpg -i $d/f_14.8.jpg -filter_complex "[0][1][2][3]hstack=4,scale=1600:-1" $d/sheet.jpg
ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate,sample_rate,channels:format=duration -of compact $v
ffmpeg -hide_banner -i $v -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
md5sum $v
