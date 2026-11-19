#!/usr/bin/env python3
"""Uso: checar-midia.py <arquivo> <rede> <formato>
rede: instagram | facebook | tiktok | marketplace
formato: feed | carrossel | reels | video | foto
Só lê o arquivo (ffprobe). Saída: OK / ALERTA / ERRO por item."""
import json, os, subprocess, sys

SPECS = {
 ("instagram","feed"):     dict(kind="img", ratio=(0.8,1.91), maxmb=8, w=(320,1440), ext=("jpg","jpeg")),
 ("instagram","carrossel"):dict(kind="any", ratio=(0.8,1.91), maxmb=8, w=(320,1440), ext=("jpg","jpeg","mp4","mov")),
 ("instagram","reels"):    dict(kind="vid", ratio=(0.5625,0.5625), maxmb=300, dur=(3,900), fps=(23,60), maxw=1920, ext=("mp4","mov")),
 ("facebook","feed"):      dict(kind="img", ratio=(0.8,0.8), maxmb=30, w=(600,99999), ext=("jpg","jpeg","png")),
 ("facebook","reels"):     dict(kind="vid", ratio=(0.5625,0.5625), maxmb=1024, dur=(3,90), fps=(24,60), minwh=(540,960), ext=("mp4",)),
 ("tiktok","video"):       dict(kind="vid", ratio=(0.5625,0.5625), maxmb=4096, dur=(3,180), fps=(23,60), side=(360,4096), ext=("mp4","mov","webm")),
 ("tiktok","foto"):        dict(kind="img", ratio=(0.5625,0.8), maxmb=20, maxside=1920, ext=("jpg","jpeg","webp")),
 ("marketplace","foto"):   dict(kind="img", ratio=(0.5,2.0), maxmb=30, ext=("jpg","jpeg","png")),
}
TOL = 0.03

def probe(p):
    out = subprocess.run(["ffprobe","-v","error","-print_format","json","-show_streams","-show_format",p],capture_output=True,text=True)
    return json.loads(out.stdout or "{}")

def main():
    if len(sys.argv)!=4: print(__doc__); sys.exit(2)
    p, rede, fmt = sys.argv[1], sys.argv[2].lower(), sys.argv[3].lower()
    s = SPECS.get((rede,fmt))
    if not s: print("ERRO: combinação rede/formato desconhecida. Opções:", sorted(SPECS)); sys.exit(2)
    if not os.path.isfile(p): print("ERRO: arquivo não existe:", p); sys.exit(2)
    res=[]; ok=True
    ext=p.rsplit(".",1)[-1].lower()
    if ext not in s["ext"]: res.append(f"ERRO formato .{ext}; aceito: {s['ext']}"); ok=False
    mb=os.path.getsize(p)/1048576
    if mb>s["maxmb"]: res.append(f"ERRO tamanho {mb:.1f} MB > {s['maxmb']} MB"); ok=False
    else: res.append(f"OK tamanho {mb:.1f} MB")
    info=probe(p); v=[x for x in info.get("streams",[]) if x.get("codec_type")=="video"]
    if not v: print("ERRO: não consegui ler a mídia"); sys.exit(1)
    v=v[0]; w,h=int(v["width"]),int(v["height"]); r=w/h
    lo,hi=s["ratio"]
    if lo*(1-TOL)<=r<=hi*(1+TOL): res.append(f"OK proporção {w}x{h} ({r:.3f})")
    else: res.append(f"ERRO proporção {w}x{h} ({r:.3f}) fora de {lo:.3f}–{hi:.3f}"); ok=False
    if "w" in s and not (s["w"][0]<=w<=s["w"][1]): res.append(f"ALERTA largura {w} fora de {s['w']} (a rede reescala)")
    if "maxw" in s and w>s["maxw"]: res.append(f"ERRO largura {w} > {s['maxw']}"); ok=False
    if "minwh" in s and (w<s["minwh"][0] or h<s["minwh"][1]): res.append(f"ERRO resolução abaixo de {s['minwh']}"); ok=False
    if "side" in s and not all(s["side"][0]<=x<=s["side"][1] for x in (w,h)): res.append(f"ERRO lados fora de {s['side']}"); ok=False
    if "maxside" in s and max(w,h)>s["maxside"]: res.append(f"ERRO maior lado {max(w,h)} > {s['maxside']}"); ok=False
    isvid = v.get("codec_name") not in ("mjpeg","png","webp") and float(info.get("format",{}).get("duration",0) or 0)>0.5
    if s["kind"]=="vid" or (s["kind"]=="any" and isvid):
        d=float(info["format"].get("duration",0))
        if "dur" in s:
            if s["dur"][0]<=d<=s["dur"][1]: res.append(f"OK duração {d:.1f}s")
            else: res.append(f"ERRO duração {d:.1f}s fora de {s['dur']}"); ok=False
        num,den=(v.get("avg_frame_rate","0/1").split("/")+["1"])[:2]
        fps=float(num)/float(den or 1) if float(den or 1) else 0
        if "fps" in s:
            if s["fps"][0]<=round(fps)<=s["fps"][1]: res.append(f"OK fps {fps:.1f}")
            else: res.append(f"ERRO fps {fps:.1f} fora de {s['fps']}"); ok=False
        if v.get("codec_name") not in ("h264","hevc","vp9","av1"): res.append(f"ALERTA codec {v.get('codec_name')} (preferir h264)")
    if s["kind"]=="vid" and abs(r-0.5625)<0.01:
        res.append("LEMBRETE zona segura 9:16: IG/FB 14% topo, 35% base, 6% lados; TikTok 240/660/120 px + coluna direita 180 px")
    print("\n".join(res)); print("RESULTADO:", "OK" if ok else "REPROVADO"); sys.exit(0 if ok else 1)
main()
