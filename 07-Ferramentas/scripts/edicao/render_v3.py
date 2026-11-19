#!/usr/bin/env python3
"""Render de uma peça do lote-v3 a partir de trechos reais (foto ou vídeo).

Uso:
  python3 render_v3.py --piece 01 --clips clips.json --out 01.mp4
  python3 render_v3.py --piece 01 --clips clips.json --tarjas tarjas.json --out 01.mp4
  python3 render_v3.py --piece C01 --clip '/path/a.mp4:2.0:5.5' --clip '/path/b.mp4:0:3.2' --out C01.mp4

clips.json (lista de trechos):
  [
    {"file": "/caminho/video.mp4", "in": 1.2, "out": 4.8},
    {"file": "/caminho/foto.jpg",  "in": 0,   "out": 3.0, "focus": [0.50, 0.45]}
  ]
  Também aceita um .txt com linhas:  arquivo,in,out

tarjas.json (placa / nome de loja), coordenadas no QUADRO-FONTE, tempos no relógio do arquivo-fonte:
  [
    {"file": "/caminho/video.mp4", "x": 120, "y": 840, "w": 220, "h": 48, "t0": 1.4, "t1": 4.8},
    {"clip": 0, "x": 10, "y": 10, "w": 80, "h": 30, "t0": 0.0, "t1": 3.0}
  ]
  "clip" é o índice 0-based na lista de trechos (alternativa a "file").

O overlay de valores (pílulas + nome + @) entra estático desde 0 s.
O CTA (overlays/cta-sprite.png) entra em 1 s com um pop, no próprio PNG.

Corte seco, 12–15 s no total. Sem esticar o tempo (nada acima de 10%, de fato
nenhum atempo). Crop 9:16 e escala no máximo 2×; se 2× não preencher a tela,
o restante é fundo desfocado do próprio quadro (não é IA).
Correção de cor leve e natural. Música do lote-v2, loudnorm e fade-out.

Saída: 1080x1920 H.264 High yuv420p, CFR 30, AAC 48 kHz, +faststart, nice -n 19.

Variante: só a B (entrada + parcelas), por decisão do Samuel às 22h12.
--variant A é recusado. --variant B é aceito e ignorado.
"""
from __future__ import annotations

import argparse
import json
import math
import subprocess
import sys
from pathlib import Path

WORK = Path("/workspace/movecon/redes/tanan-intermediacoes/editados-2026-11-14/lote-v3/_work")
PIECES_JSON = WORK / "pieces.json"
OVERLAYS = WORK / "overlays"
W, H, FPS = 1080, 1920, 30
MAX_SCALE = 2.0
MIN_DUR, MAX_DUR = 12.0, 15.0

FF_V = [
    "-c:v", "libx264", "-preset", "medium", "-crf", "18",
    "-profile:v", "high", "-level:v", "4.1",
    "-pix_fmt", "yuv420p", "-r", "30", "-fps_mode", "cfr",
    "-movflags", "+faststart",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
]
FF_A = ["-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2"]

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp"}


def die(msg, code=1):
    print("ERRO:", msg, file=sys.stderr)
    sys.exit(code)


def even(n):
    n = int(round(n))
    return n if n % 2 == 0 else n - 1


def is_image(path: Path) -> bool:
    return path.suffix.lower() in IMAGE_EXT


def probe(path: Path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,duration,r_frame_rate,nb_frames",
         "-show_entries", "format=duration",
         "-of", "json", str(path)],
        capture_output=True, text=True,
    )
    if r.returncode != 0:
        die(f"ffprobe falhou em {path}:\n{r.stderr}")
    data = json.loads(r.stdout)
    st = (data.get("streams") or [{}])[0]
    fmt = data.get("format") or {}
    w = int(st.get("width") or 0)
    h = int(st.get("height") or 0)
    dur = st.get("duration") or fmt.get("duration") or 0
    try:
        dur = float(dur)
    except (TypeError, ValueError):
        dur = 0.0
    return {"w": w, "h": h, "duration": dur}


def load_pieces():
    if not PIECES_JSON.exists():
        die(f"Não achei {PIECES_JSON}. Rode scripts/generate_overlays.py antes.")
    return json.loads(PIECES_JSON.read_text())


def parse_clips(args) -> list[dict]:
    clips = []
    if args.clips:
        p = Path(args.clips)
        if not p.exists():
            die(f"Arquivo de trechos não existe: {p}")
        if p.suffix.lower() == ".json":
            raw = json.loads(p.read_text())
            if not isinstance(raw, list):
                die("clips.json deve ser uma lista de {file, in, out}.")
            for i, c in enumerate(raw):
                if isinstance(c, dict):
                    clips.append(c)
                elif isinstance(c, (list, tuple)) and len(c) >= 3:
                    clips.append({"file": c[0], "in": c[1], "out": c[2]})
                else:
                    die(f"Trecho {i} inválido: {c}")
        else:
            for line in p.read_text().splitlines():
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = [x.strip() for x in line.split(",")]
                if len(parts) < 3:
                    die(f"Linha inválida em {p}: {line}")
                clips.append({"file": parts[0], "in": float(parts[1]), "out": float(parts[2])})
    for item in args.clip or []:
        # file:in:out  (o caminho pode conter ':', então separamos pelos dois últimos)
        if ":" not in item:
            die(f"--clip precisa de arquivo:in:out, recebi: {item}")
        file, tin, tout = item.rsplit(":", 2)
        clips.append({"file": file, "in": float(tin), "out": float(tout)})
    if not clips:
        die("Informe os trechos com --clips arquivo.json ou --clip arquivo:in:out")

    out = []
    for i, c in enumerate(clips):
        path = Path(c["file"]).expanduser()
        if not path.exists():
            die(f"Trecho {i}: arquivo não existe: {path}")
        try:
            t0 = float(c.get("in", 0))
            t1 = float(c.get("out"))
        except (TypeError, ValueError, KeyError):
            die(f"Trecho {i}: 'in' e 'out' numéricos são obrigatórios")
        if t1 <= t0:
            die(f"Trecho {i}: out ({t1}) deve ser maior que in ({t0})")
        dur = t1 - t0
        info = probe(path)
        if info["w"] <= 0 or info["h"] <= 0:
            die(f"Trecho {i}: não consegui ler o tamanho de {path}")
        if not is_image(path) and info["duration"] and t1 > info["duration"] + 0.05:
            print(f"AVISO: trecho {i} out={t1:.2f}s passa da duração do arquivo ({info['duration']:.2f}s)",
                  file=sys.stderr)
        focus = c.get("focus", [0.5, 0.5])
        if not (isinstance(focus, (list, tuple)) and len(focus) == 2):
            die(f"Trecho {i}: focus deve ser [fx, fy] em 0–1")
        out.append({
            "file": path,
            "in": t0,
            "out": t1,
            "dur": dur,
            "w": info["w"],
            "h": info["h"],
            "focus": (float(focus[0]), float(focus[1])),
            "image": is_image(path),
            "zoom": float(c.get("zoom", 1.0)),
        })
    return out


def parse_tarjas(path, clips) -> list[dict]:
    if not path:
        return []
    p = Path(path)
    if not p.exists():
        die(f"Arquivo de tarjas não existe: {p}")
    raw = json.loads(p.read_text())
    if not isinstance(raw, list):
        die("tarjas.json deve ser uma lista.")
    out = []
    for i, t in enumerate(raw):
        if not isinstance(t, dict):
            if isinstance(t, (list, tuple)) and len(t) >= 6:
                # x,y,w,h,t0,t1  (aplica no trecho 0, ou veja o 7º campo como clip)
                t = {"x": t[0], "y": t[1], "w": t[2], "h": t[3], "t0": t[4], "t1": t[5],
                     "clip": t[6] if len(t) > 6 else 0}
            else:
                die(f"Tarja {i} inválida")
        idx = t.get("clip", None)
        if idx is None and t.get("file"):
            want = Path(t["file"]).expanduser().resolve()
            idx = next((j for j, c in enumerate(clips) if c["file"].resolve() == want), None)
            if idx is None:
                die(f"Tarja {i}: file {t['file']} não está na lista de trechos")
        if idx is None:
            idx = 0
        idx = int(idx)
        if idx < 0 or idx >= len(clips):
            die(f"Tarja {i}: clip {idx} fora da lista")
        try:
            box = {k: float(t[k]) for k in ("x", "y", "w", "h", "t0", "t1")}
        except KeyError as e:
            die(f"Tarja {i}: falta o campo {e}")
        box["clip"] = idx
        out.append(box)
    return out


def crop_window(cw_src, ch_src, focus, zoom=1.0):
    """Janela 9:16 no quadro-fonte, centrada em focus (0–1). Devolve x,y,w,h.
    zoom>1 = janela menor (recorte para tirar loja/pessoa da borda); a escala final continua ≤2×."""
    target_aspect = W / H  # 9/16
    src_aspect = cw_src / ch_src
    if src_aspect > target_aspect:
        # mais largo que 9:16: corta as laterais
        crop_h = ch_src
        crop_w = int(round(ch_src * target_aspect))
    else:
        crop_w = cw_src
        crop_h = int(round(cw_src / target_aspect))
    if zoom and zoom > 1.0:
        crop_w = crop_w / zoom
        crop_h = crop_h / zoom
    crop_w = max(2, even(crop_w))
    crop_h = max(2, even(crop_h))
    fx, fy = focus
    cx = fx * cw_src
    cy = fy * ch_src
    x = int(round(cx - crop_w / 2))
    y = int(round(cy - crop_h / 2))
    x = max(0, min(cw_src - crop_w, x))
    y = max(0, min(ch_src - crop_h, y))
    return x, y, crop_w, crop_h


def scale_for(crop_w, crop_h):
    """Escala para cobrir 1080x1920, limitada a 2×. Devolve (out_w, out_h, scale, fills)."""
    need = max(W / crop_w, H / crop_h)
    scale = min(need, MAX_SCALE)
    out_w = even(crop_w * scale)
    out_h = even(crop_h * scale)
    # se arredondar para baixo e ficar ímpar já tratamos; garante mínimo 2
    out_w = max(2, out_w)
    out_h = max(2, out_h)
    fills = out_w >= W and out_h >= H
    return out_w, out_h, scale, fills, need


def color_filter():
    # leve e natural: um pouco mais de contraste e saturação, brilho bem baixo
    return "eq=contrast=1.035:brightness=0.015:saturation=1.05"


def clip_filter(clip, idx, tarjas):
    """Filtro de um trecho: tarja no fonte, crop 9:16, escala ≤2×, cor, 30 fps."""
    x, y, cw, ch = crop_window(clip["w"], clip["h"], clip["focus"], clip.get("zoom", 1.0))
    out_w, out_h, scale, fills, need = scale_for(cw, ch)
    if need > MAX_SCALE + 0.02:
        # Fallback de fundo desfocado DESATIVADO (regra do Samuel 01/11: filmagem sempre em tela cheia).
        die(f"Trecho {idx} precisaria de {need:.2f}× (>2×) para preencher 9:16. Troque o trecho.")
    fills = True

    parts = []
    # tarjas no quadro-fonte, no relógio original (antes do trim/setpts)
    mine = [t for t in tarjas if t["clip"] == idx]
    for j, t in enumerate(mine):
        # clipa a caixa ao quadro
        bx = int(t["x"]); by = int(t["y"]); bw = int(t["w"]); bh = int(t["h"])
        parts.append(
            f"drawbox=x={bx}:y={by}:w={bw}:h={bh}:color=black@1:t=fill:"
            f"enable='between(t,{t['t0']:.4f},{t['t1']:.4f})'"
        )

    # recorte do intervalo e reset de PTS (sem alterar a velocidade).
    # Foto: o input já entra loopado pela duração pedida, começando em t=0.
    if clip["image"]:
        parts.append("setpts=PTS-STARTPTS")
    else:
        parts.append(f"trim=start={clip['in']}:end={clip['out']},setpts=PTS-STARTPTS")
    parts.append(f"crop={cw}:{ch}:{x}:{y}")

    if fills:
        # cobre a tela em ≤2×: escala direto para 1080x1920
        parts.append("scale=1080:1920:flags=lanczos")
        body = ",".join(parts)
        chain = f"[{idx}:v]{body},{color_filter()},fps={FPS},setsar=1,format=yuv420p[v{idx}]"
    else:
        # escala no teto de 2× e centra sobre fundo desfocado do mesmo recorte
        parts.append(f"scale={out_w}:{out_h}:flags=lanczos")
        body = ",".join(parts)
        chain = (
            f"[{idx}:v]{body},setsar=1,split=2[fg{idx}][bg{idx}];"
            f"[bg{idx}]scale=1080:1920:force_original_aspect_ratio=increase:flags=bilinear,"
            f"crop=1080:1920,boxblur=18:6,eq=brightness=-0.06[bg{idx}b];"
            f"[fg{idx}]{color_filter()}[fg{idx}c];"
            f"[bg{idx}b][fg{idx}c]overlay=(W-w)/2:(H-h)/2,fps={FPS},setsar=1,format=yuv420p[v{idx}]"
        )
    meta = {
        "crop": [x, y, cw, ch],
        "scale": round(scale, 4),
        "need": round(need, 4),
        "out": [out_w, out_h],
        "fills": fills,
    }
    return chain, meta


def load_cta_meta():
    p = OVERLAYS / "cta-meta.json"
    if not p.exists():
        die(f"Não achei {p}. Rode scripts/generate_overlays.py antes.")
    return json.loads(p.read_text())


def build_command(piece, clips, tarjas, out: Path, music: Path):
    n = len(clips)
    total = sum(c["dur"] for c in clips)
    if total > MAX_DUR + 1e-3:
        overflow = total - MAX_DUR
        last = clips[-1]
        if last["dur"] - overflow < 0.6:
            die(f"A soma dos trechos é {total:.2f}s (>15s) e o último trecho não tem como ser cortado "
                f"para caber. Ajuste os in/out.")
        print(f"AVISO: soma {total:.2f}s > 15s; corto o último trecho em {overflow:.2f}s.",
              file=sys.stderr)
        last["out"] -= overflow
        last["dur"] -= overflow
        total = MAX_DUR
    if total < MIN_DUR:
        print(f"AVISO: soma dos trechos é {total:.2f}s (<12s). Não estico o tempo; "
              f"o vídeo sai com {total:.2f}s. Inclua mais trechos quando o material chegar.",
              file=sys.stderr)
    if total <= 0:
        die("Duração total nula.")

    overlay = OVERLAYS / f"{piece['id']}.png"
    cta_sprite = OVERLAYS / "cta-sprite.png"
    if not overlay.exists() or not cta_sprite.exists():
        die("Overlays ausentes. Rode scripts/generate_overlays.py antes.")
    cta = load_cta_meta()
    cx, cy = int(cta["cx"]), int(cta["cy"])

    # entradas: vídeos/fotos + overlay estático + sprite do CTA + música
    cmd = ["nice", "-n", "19", "ffmpeg", "-y", "-hide_banner", "-v", "warning", "-threads", "4"]
    for c in clips:
        if c["image"]:
            # ainda assim respeitamos a duração pedida; sem interpolação
            cmd += ["-loop", "1", "-framerate", str(FPS), "-t", f"{c['dur']:.4f}", "-i", str(c["file"])]
        else:
            cmd += ["-i", str(c["file"])]
    cmd += ["-loop", "1", "-framerate", str(FPS), "-t", f"{total:.4f}", "-i", str(overlay)]
    cmd += ["-loop", "1", "-framerate", str(FPS), "-t", f"{total:.4f}", "-i", str(cta_sprite)]
    cmd += ["-i", str(music)]
    ov_idx = n
    cta_idx = n + 1
    mus_idx = n + 2

    filters = []
    metas = []
    for i, c in enumerate(clips):
        ch, meta = clip_filter(c, i, tarjas)
        filters.append(ch)
        metas.append(meta)

    concat_in = "".join(f"[v{i}]" for i in range(n))
    filters.append(f"{concat_in}concat=n={n}:v=1:a=0[base]")

    # overlay de valores desde 0 s, estático
    filters.append(f"[base][{ov_idx}:v]overlay=0:0:format=auto[vvals]")

    # CTA: pop a partir de 1 s, escala em torno do centro do bloco
    # 1.00–1.12: 0.70 → 1.08 (overshoot); 1.12–1.22: 1.08 → 1.00; depois 1.00
    pop = (
        "if(lt(t,1.0),0.70,"
        "if(lt(t,1.12),0.70+0.38*(t-1.0)/0.12,"
        "if(lt(t,1.22),1.08-0.08*(t-1.12)/0.10,1)))"
    )
    filters.append(
        f"[{cta_idx}:v]format=rgba,"
        f"scale=w='trunc(iw*({pop})/2)*2':h='trunc(ih*({pop})/2)*2':eval=frame[ctas]"
    )
    filters.append(
        f"[vvals][ctas]overlay=x='{cx}-w/2':y='{cy}-h/2':enable='gte(t,1)':format=auto,"
        f"format=yuv420p,setsar=1,fps={FPS}[vout]"
    )

    fade_out_start = max(0.0, total - 0.55)
    filters.append(
        f"[{mus_idx}:a]atrim=start=0:duration={total:.4f},asetpts=PTS-STARTPTS,"
        f"afade=t=in:st=0:d=0.12,afade=t=out:st={fade_out_start:.4f}:d=0.55,"
        f"loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,"
        f"aformat=channel_layouts=stereo[aout]"
    )

    cmd += [
        "-filter_complex", ";".join(filters),
        "-map", "[vout]", "-map", "[aout]",
        *FF_V, *FF_A,
        "-t", f"{total:.4f}",
        str(out),
    ]
    return cmd, {"duration": total, "clips": metas, "cta": {"cx": cx, "cy": cy}}


def run(cmd, logpath: Path):
    logpath.parent.mkdir(parents=True, exist_ok=True)
    pretty = " ".join(str(c) for c in cmd)
    print("RUN", pretty, flush=True)
    with logpath.open("w") as f:
        f.write(pretty + "\n\n")
        r = subprocess.run(cmd, stdout=f, stderr=subprocess.STDOUT)
        f.write(f"\nexit={r.returncode}\n")
    if r.returncode != 0:
        print(logpath.read_text()[-4000:], file=sys.stderr)
        die(f"ffmpeg falhou (log em {logpath})")
    print("OK", logpath.name)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--piece", required=True, help="id da peça: 01, 02, …, 14, C01, C02, C03, C04, C06")
    ap.add_argument("--clips", help="JSON ou TXT com a lista de trechos (arquivo, in, out)")
    ap.add_argument("--clip", action="append", default=[],
                    help="Trecho avulso no formato arquivo:in:out (pode repetir)")
    ap.add_argument("--tarjas", help="JSON com tarjas da placa (x,y,w,h,t0,t1)")
    ap.add_argument("--out", required=True, help="MP4 de saída 1080x1920")
    ap.add_argument("--music", help="Sobrescreve a música da peça (padrão: a do lote-v2)")
    ap.add_argument("--variant", default="B", help="Só B é aceita (entrada+parcelas). A é recusada.")
    ap.add_argument("--print-cmd", action="store_true", help="Só imprime o comando, não renderiza")
    ap.add_argument("--log", help="Arquivo de log do ffmpeg (padrão: _work/teste/logs/<peça>.log)")
    args = ap.parse_args(argv)

    if str(args.variant).upper() == "A":
        die("A variante A (3 linhas, com crédito) foi cancelada. "
            "Decisão do Samuel às 22h12: só entrada e parcelas (variante B).")

    catalog = load_pieces()
    by_id = {p["id"]: p for p in catalog["pieces"]}
    pid = str(args.piece).upper() if str(args.piece).upper().startswith("C") else str(args.piece).zfill(2)
    # aceita "01", "1", "C01", "c01"
    if str(args.piece) in by_id:
        pid = str(args.piece)
    elif pid in by_id:
        pass
    else:
        die(f"Peça desconhecida: {args.piece}. Válidas: {', '.join(by_id)}")
    piece = by_id[pid]

    clips = parse_clips(args)
    tarjas = parse_tarjas(args.tarjas, clips)
    music = Path(args.music) if args.music else Path(piece["music"])
    if not music.exists():
        die(f"Música não encontrada: {music}")

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if out.exists():
        # rascunho: o chamador decide; não recusamos overwrite no teste, mas avisamos
        print(f"AVISO: vou sobrescrever {out}", file=sys.stderr)

    cmd, meta = build_command(piece, clips, tarjas, out, music)
    print(json.dumps({"piece": pid, "style": piece["style"], "align": piece["align"],
                       "music": str(music), **meta}, ensure_ascii=False, indent=2))
    if args.print_cmd:
        print(" ".join(str(c) for c in cmd))
        return 0

    log = Path(args.log) if args.log else (WORK / "teste" / "logs" / f"{pid}.log")
    run(cmd, log)
    # QC rápido
    info = probe(out)
    print(f"SAIDA {out}  {info['w']}x{info['h']}  {info['duration']:.3f}s")
    if info["w"] != W or info["h"] != H:
        die(f"Resolução inesperada: {info['w']}x{info['h']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
