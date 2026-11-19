#!/usr/bin/env python3
"""Gera os PNG de overlay 1080x1920 do lote-v3 (decisão do Samuel 13/11 22h12).

Só 2 linhas de valores: "Entrada de R$ X" e "Parcelas de R$ X" (valores exatos do lote-v2.csv).
Sem crédito, sem CTA neste PNG, sem meses, sem %, sem lance, sem contemplação.

O CTA "CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP" vai em overlays/cta.png
(e cta-sprite.png), com tempo próprio no render (entra em 1 s com pop).

Nome do bem: pílula pequena logo abaixo das pílulas de valor.
@tanan_intermediacoes: pílula pequena no canto superior direito.

Medidas copiadas dos exemplos 720x1280, escaladas 1,5x para 1080x1920.
"""
from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path("/workspace/movecon/redes/tanan-intermediacoes/editados-2026-11-14/lote-v6/_work")
OUT = ROOT / "overlays"
W, H = 1080, 1920
SS = 2  # supersample

FONT_DIR_P = Path("/usr/share/fonts/truetype/sand-box/google/Poppins")
FONT_DIR_B = Path("/usr/share/fonts/truetype/sand-box/google/Barlow Condensed")
FONT_VAL = str(FONT_DIR_P / "Poppins-ExtraBold.ttf")
FONT_NAME = str(FONT_DIR_P / "Poppins-Bold.ttf")
FONT_HANDLE = str(FONT_DIR_P / "Poppins-SemiBold.ttf")
FONT_CTA = str(FONT_DIR_B / "BarlowCondensed-ExtraBold.ttf")

# Cores medidas nos quadros dos exemplos (mediana dos pixels).
RED = (227, 19, 47, 255)          # colchete ex01/ex05 #E3132F
YELLOW_TOP = (255, 201, 74, 255)  # degradê leve do colchete ex02
YELLOW_BOT = (232, 162, 32, 255)
YELLOW_FLAT = (247, 181, 45, 255) # mediana #F7B52D
RED_PILL = (193, 0, 19, 255)      # pílula e tarja ex04 #C10013
WHITE = (255, 255, 255, 255)
INK = (18, 18, 18, 255)
HANDLE_INK = (25, 25, 25, 255)

# Layout a 1080x1920 (1,5 × as medidas em 720x1280).
PILL_H = 90
PILL_GAP = 10
PILL_PAD_X = 28
PILL_RADIUS = 14
VAL_SIZE = 58

BRACKET_THICK_RED = 18
BRACKET_THICK_YEL = 32
BRACKET_ARM_RED = 128
BRACKET_ARM_YEL = 118
BRACKET_EXT = 38          # quanto o colchete sobe/desce além das pílulas
BRACKET_GAP = 20          # vão entre a barra e a pílula
BRACKET_LEFT = 236        # x externo do colchete no alinhamento à esquerda (ex01)
BRACKET_RAD_RED = 12
BRACKET_RAD_YEL = 6

EX04_PILL_H = 111
EX04_PAD_X = 36
EX04_VAL_SIZE = 64
EX04_RED_H = 69
EX04_RED_SIZE = 42
EX04_RED_PAD_X = 24
EX04_TAB = (86, 18)
EX04_TAB_INSET = 27
EX04_TAB_ABOVE = 10
EX04_OVERLAP = 9
EX04_RED_OVERHANG = 84
EX04_LEFT = 126

NAME_SIZE = 32
NAME_H = 54
NAME_PAD_X = 22
NAME_GAP = 22
NAME_RADIUS = 12

HANDLE_SIZE = 22
HANDLE_PAD_X = 16
HANDLE_PAD_Y = 8
HANDLE_MARGIN_R = 40
HANDLE_MARGIN_T = 78
HANDLE_TEXT = "@tanan_intermediacoes"

# CTA: bloco centrado por volta de 85% da altura (centro ~1630).
CTA_L1 = "CLIQUE NO LINK"
CTA_L2 = "E FALE DIRETAMENTE NO WHATSAPP"
CTA_SIZE = 52
CTA_TRACKING = 1
CTA_LINE_GAP = 10
CTA_CENTER_Y = 1630


PIECES = [
    # id, short name, entrada, parcela, style, align, y_pills
    # style: red | yellow | ex04
    ("01",  "Hilux SRX",           "R$ 35.000",   "R$ 3.122", "red",    "left",   330),
    ("02",  "SW4 SRX Platinum",    "R$ 40.000",   "R$ 3.821", "yellow", "left",   390),
    ("03",  "Poer Exclusive",      "R$ 44.500",   "R$ 2.223", "ex04",   "center", 316),
    ("04",  "Strada Endurance",    "R$ 21.100",   "R$ 1.053", "red",    "center", 350),
    ("05",  "Onix LT",             "R$ 21.800",   "R$ 1.089", "yellow", "left",   330),
    ("06",  "Onix Plus Premier",   "R$ 22.800",   "R$ 1.139", "ex04",   "left",   316),
    ("07",  "HB20 Limited",        "R$ 18.100",   "R$ 903", "red",    "left",   330),
    ("08",  "HB20S Comfort",       "R$ 19.000",   "R$ 948", "yellow", "center", 390),
    ("09",  "Toro Volcano",        "R$ 33.600",   "R$ 1.678", "ex04",   "center", 316),
    ("10",  "Argo Trekking",       "R$ 18.700",   "R$ 936", "red",    "center", 350),
    ("11",  "Cronos Precision",    "R$ 22.700",   "R$ 1.134", "yellow", "left",   390),
    ("14",  "Pulse Drive",         "R$ 21.100",   "R$ 1.053", "ex04",   "left",   316),
    ("C01", "Accelo 815",          "R$ 40.700",   "R$ 2.033", "red",    "left",   330),
    ("C02", "Delivery Express",    "R$ 44.800",   "R$ 2.241", "yellow", "center", 350),
    ("C03", "Cargo 2428",          "R$ 42.300",   "R$ 2.115", "ex04",   "left",   316),
    ("C04", "Daily 35-150",        "R$ 35.000",   "R$ 2.228", "red",    "center", 350),
    ("C06", "Ducato Maxicargo",    "R$ 20.000",   "R$ 2.718", "yellow", "left",   330),
]

MUSIC = {
    "01":  "/workspace/movecon/criativos/musica/2026-11-03/bombinsound-happy-advertising-hip-hop-628139.mp3",
    "02":  "/workspace/movecon/criativos/musica/2026-11-01/kulakovka-summertime-620526.mp3",
    "03":  "/workspace/movecon/criativos/musica/2026-11-03/331music-sport-upbeat-rock-indie-627773.mp3",
    "04":  "/workspace/movecon/criativos/musica/2026-11-01/kontraa-hype-drill-music-438398.mp3",
    "05":  "/workspace/movecon/criativos/musica/2026-11-02/deltax-music-honey-kisses-413841.mp3",
    "06":  "/workspace/movecon/criativos/musica/2026-11-02/freemusiclab-charming-phonk-i-free-background-music-i-free-music-lab-release-513626.mp3",
    "07":  "/workspace/movecon/criativos/musica/2026-11-02/itswatr-ever-flowing-12277.mp3",
    "08":  "/workspace/movecon/criativos/musica/2026-11-02/kontraa-no-sleep-hiphop-music-473847.mp3",
    "09":  "/workspace/movecon/criativos/musica/2026-11-02/kulakovka-adrenaline-sport-620584.mp3",
    "10":  "/workspace/movecon/criativos/musica/2026-11-02/miromaxmusic-club-no-copyright-618622.mp3",
    "11":  "/workspace/movecon/criativos/musica/2026-11-02/rockot-dusty-trail-jams-comedy-cinematic-hip-hop-315882.mp3",
    "14":  "/workspace/movecon/criativos/musica/2026-11-02/miromaxmusic-stylish-funk-smooth-party-no-copyright-620664.mp3",
    "C01": "/workspace/movecon/criativos/musica/2026-11-03-oferta/audioknap-an-corporate-upbeat-629215.mp3",
    "C02": "/workspace/movecon/criativos/musica/2026-11-01/kontraa-into-the-night-uk-drill-music-20928.mp3",
    "C03": "/workspace/movecon/criativos/musica/2026-11-02/kulakovka-gym-phonk-620567.mp3",
    "C04": "/workspace/movecon/criativos/musica/2026-11-03-oferta/prettyjohn1-corporate-music-629143.mp3",
    "C06": "/workspace/movecon/criativos/musica/2026-11-03-oferta/luminewave-wild-amazons-629430.mp3",
}


def font(path, size):
    return ImageFont.truetype(path, int(size))


def text_wh(f, text, tracking=0):
    if not text:
        return 0, 0
    if tracking == 0:
        l, t, r, b = f.getbbox(text)
        return r - l, b - t
    w = 0
    h = 0
    for i, ch in enumerate(text):
        l, t, r, b = f.getbbox(ch)
        w += (r - l)
        if i < len(text) - 1:
            w += tracking
        h = max(h, b - t)
    return w, h


def draw_text(draw, x, y, text, f, fill, tracking=0):
    """Desenha com o canto superior esquerdo da caixa da letra em (x, y)."""
    if tracking == 0:
        l, t, r, b = f.getbbox(text)
        draw.text((x - l, y - t), text, font=f, fill=fill)
        return r - l, b - t
    cx = x
    maxh = 0
    for i, ch in enumerate(text):
        l, t, r, b = f.getbbox(ch)
        draw.text((cx - l, y - t), ch, font=f, fill=fill)
        cx += (r - l) + (tracking if i < len(text) - 1 else 0)
        maxh = max(maxh, b - t)
    return cx - x, maxh


def paste_shadow(canvas, sprite, x, y, blur=10, opacity=90, dy=4, dx=0):
    """Sombra suave atrás de um sprite RGBA já recortado."""
    if sprite.mode != "RGBA":
        sprite = sprite.convert("RGBA")
    pad = blur * 2 + abs(dx) + abs(dy)
    sh = Image.new("RGBA", (sprite.width + pad * 2, sprite.height + pad * 2), (0, 0, 0, 0))
    alpha = sprite.split()[-1].point(lambda a: min(255, int(a * opacity / 255)))
    black = Image.new("RGBA", sprite.size, (0, 0, 0, 255))
    black.putalpha(alpha)
    sh.paste(black, (pad, pad), black)
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    canvas.alpha_composite(sh, (int(x - pad + dx), int(y - pad + dy)))
    canvas.alpha_composite(sprite, (int(x), int(y)))


def make_pill(text, fnt, fill, ink, h, pad_x, radius):
    tw, th = text_wh(fnt, text)
    w = tw + pad_x * 2
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=fill)
    tx = pad_x
    ty = (h - th) // 2
    draw_text(d, tx, ty, text, fnt, ink)
    return img


def draw_bracket_shape(size, thick, arm, ext_unused, radius, color, gradient=None):
    """Colchete '[' em um canvas do tamanho (w, h) = (arm, bloco)."""
    w, h = size
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # três barras que se encontram, com cantos arredondados
    d.rounded_rectangle((0, 0, arm - 1, thick - 1), radius=radius, fill=color)
    d.rounded_rectangle((0, h - thick, arm - 1, h - 1), radius=radius, fill=color)
    d.rounded_rectangle((0, 0, thick - 1, h - 1), radius=radius, fill=color)
    if gradient is not None:
        # aplica degradê só nos pixels do colchete
        arr = np.array(img)
        mask = arr[:, :, 3] > 0
        g = np.linspace(0, 1, h).reshape(h, 1)
        c0 = np.array(gradient[0][:3], dtype=np.float32)
        c1 = np.array(gradient[1][:3], dtype=np.float32)
        col = (c0 * (1 - g) + c1 * g).astype(np.uint8)  # h x 3
        rgb = np.repeat(col[:, None, :], w, axis=1)
        arr[mask, :3] = rgb[mask]
        img = Image.fromarray(arr, "RGBA")
    return img


def build_bracket_overlay(entrada, parcela, name, style, align, y_pills, ss=SS):
    """Monta o canvas supersampled e devolve o PNG 1080x1920."""
    sw, sh = W * ss, H * ss

    def S(v):
        return int(round(v * ss))

    canvas = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))

    if style in ("red", "yellow"):
        fval = font(FONT_VAL, S(VAL_SIZE))
        line1 = f"Entrada de {entrada}"
        line2 = f"Parcelas de {parcela}"
        pill1 = make_pill(line1, fval, WHITE, INK, S(PILL_H), S(PILL_PAD_X), S(PILL_RADIUS))
        pill2 = make_pill(line2, fval, WHITE, INK, S(PILL_H), S(PILL_PAD_X), S(PILL_RADIUS))
        pw = max(pill1.width, pill2.width)
        # pílulas com a mesma largura visual? Nos exemplos cada uma se ajusta ao texto.
        # mantemos largura própria, alinhadas à esquerda do bloco.

        thick = BRACKET_THICK_RED if style == "red" else BRACKET_THICK_YEL
        arm = BRACKET_ARM_RED if style == "red" else BRACKET_ARM_YEL
        rad = BRACKET_RAD_RED if style == "red" else BRACKET_RAD_YEL
        color = RED if style == "red" else YELLOW_FLAT

        pills_h = S(PILL_H) * 2 + S(PILL_GAP)
        br_h = pills_h + S(BRACKET_EXT) * 2
        br_w = S(arm)
        gradient = (YELLOW_TOP, YELLOW_BOT) if style == "yellow" else None
        br = draw_bracket_shape((br_w, br_h), S(thick), S(arm), S(BRACKET_EXT), S(rad), color, gradient)

        # grupo: colchete à esquerda, pílulas à direita com vão
        pills_x_in_group = S(thick) + S(BRACKET_GAP)
        group_w = pills_x_in_group + max(pill1.width, pill2.width)
        group_h = br_h

        if align == "left":
            gx = S(BRACKET_LEFT)
        else:
            gx = (sw - group_w) // 2

        gy = S(y_pills) - S(BRACKET_EXT)
        # pílulas
        px = gx + pills_x_in_group
        py1 = S(y_pills)
        py2 = py1 + S(PILL_H) + S(PILL_GAP)

        paste_shadow(canvas, br, gx, gy, blur=S(6), opacity=70, dy=S(2))
        paste_shadow(canvas, pill1, px, py1, blur=S(8), opacity=80, dy=S(3))
        paste_shadow(canvas, pill2, px, py2, blur=S(8), opacity=80, dy=S(3))

        block_bottom = max(gy + br_h, py2 + pill2.height)
        # nome alinhado com as pílulas (não com o colchete)
        name_x_ref = px
        name_center = align == "center"
        name_box_w = max(pill1.width, pill2.width)

    else:  # ex04
        f1 = font(FONT_VAL, S(EX04_VAL_SIZE))
        f2 = font(FONT_VAL, S(EX04_RED_SIZE))
        line1 = f"Entrada de {entrada}"
        line2 = f"Parcelas de {parcela}"
        white = make_pill(line1, f1, WHITE, INK, S(EX04_PILL_H), S(EX04_PAD_X), S(PILL_RADIUS))
        redp = make_pill(line2, f2, RED_PILL, WHITE, S(EX04_RED_H), S(EX04_RED_PAD_X), S(PILL_RADIUS))

        # tarja vermelha no topo esquerdo da pílula branca
        tab_w, tab_h = S(EX04_TAB[0]), S(EX04_TAB[1])
        tab = Image.new("RGBA", (tab_w, tab_h), (0, 0, 0, 0))
        ImageDraw.Draw(tab).rounded_rectangle((0, 0, tab_w - 1, tab_h - 1), radius=S(3), fill=RED_PILL)

        # agrupamento: pílula vermelha à direita, com overhang, mas sem sair da tela
        margin = S(40)
        red_x_in = white.width + S(EX04_RED_OVERHANG) - redp.width
        red_x_in = max(red_x_in, white.width // 2)
        group_w = max(white.width, red_x_in + redp.width)
        group_h = S(EX04_TAB_ABOVE) + S(EX04_PILL_H) + S(EX04_RED_H) - S(EX04_OVERLAP)

        if align == "left":
            gx = S(EX04_LEFT)
        else:
            gx = (sw - group_w) // 2
        # se o grupo ultrapassa a margem direita, empurra para a esquerda;
        # se ainda não couber, reduz o overhang.
        if gx + group_w > sw - margin:
            gx = sw - margin - group_w
        if gx < margin:
            gx = margin
            red_x_in = min(red_x_in, sw - margin - gx - redp.width)
            red_x_in = max(0, red_x_in)
            group_w = max(white.width, red_x_in + redp.width)

        white_y = S(y_pills)
        tab_y = white_y - S(EX04_TAB_ABOVE)
        tab_x = gx + S(EX04_TAB_INSET)
        red_y = white_y + S(EX04_PILL_H) - S(EX04_OVERLAP)
        red_x = gx + red_x_in

        paste_shadow(canvas, white, gx, white_y, blur=S(8), opacity=80, dy=S(3))
        canvas.alpha_composite(tab, (tab_x, tab_y))
        paste_shadow(canvas, redp, red_x, red_y, blur=S(8), opacity=80, dy=S(3))

        block_bottom = red_y + redp.height
        name_x_ref = gx
        name_center = align == "center"
        name_box_w = white.width

    # nome do bem, pílula pequena abaixo das pílulas de valor
    fname = font(FONT_NAME, S(NAME_SIZE))
    name_pill = make_pill(name, fname, WHITE, INK, S(NAME_H), S(NAME_PAD_X), S(NAME_RADIUS))
    ny = block_bottom + S(NAME_GAP)
    if name_center:
        nx = name_x_ref + (name_box_w - name_pill.width) // 2
        # se o bloco é o grupo todo e o nome é menor, centra no grupo de valores
        if style == "ex04":
            # centra em relação à pílula branca
            nx = name_x_ref + (name_box_w - name_pill.width) // 2
        else:
            nx = name_x_ref + (name_box_w - name_pill.width) // 2
    else:
        nx = name_x_ref
    paste_shadow(canvas, name_pill, nx, ny, blur=S(6), opacity=70, dy=S(2))

    # @ no canto superior direito, pílula pequena (legível em céu claro ou pátio)
    fh = font(FONT_HANDLE, S(HANDLE_SIZE))
    handle = make_pill(HANDLE_TEXT, fh, WHITE, HANDLE_INK, S(HANDLE_SIZE + HANDLE_PAD_Y * 2),
                       S(HANDLE_PAD_X), S(14))
    hx = sw - S(HANDLE_MARGIN_R) - handle.width
    hy = S(HANDLE_MARGIN_T)
    paste_shadow(canvas, handle, hx, hy, blur=S(6), opacity=70, dy=S(2))

    # downscale lanczos
    out = canvas.resize((W, H), Image.Resampling.LANCZOS)
    return out


def build_cta(ss=SS):
    sw, sh = W * ss, H * ss

    def S(v):
        return int(round(v * ss))

    canvas = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    f = font(FONT_CTA, S(CTA_SIZE))
    w1, h1 = text_wh(f, CTA_L1, tracking=S(CTA_TRACKING))
    w2, h2 = text_wh(f, CTA_L2, tracking=S(CTA_TRACKING))
    block_h = h1 + S(CTA_LINE_GAP) + h2
    block_w = max(w1, w2)
    y0 = S(CTA_CENTER_Y) - block_h // 2
    x1 = (sw - w1) // 2
    x2 = (sw - w2) // 2

    # sombra preta: camadas + blur, como nos exemplos
    shadow = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    ds = ImageDraw.Draw(shadow)
    for ox, oy in ((0, S(3)), (0, S(4)), (S(2), S(3)), (-S(1), S(3)), (0, S(2))):
        draw_text(ds, x1 + ox, y0 + oy, CTA_L1, f, (0, 0, 0, 255), tracking=S(CTA_TRACKING))
        draw_text(ds, x2 + ox, y0 + h1 + S(CTA_LINE_GAP) + oy, CTA_L2, f, (0, 0, 0, 255),
                  tracking=S(CTA_TRACKING))
    # usa o alpha como máscara de sombra
    a = shadow.split()[-1]
    black = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    black.putalpha(a.point(lambda v: min(255, int(v * 0.85))))
    black = black.filter(ImageFilter.GaussianBlur(S(3)))
    canvas.alpha_composite(black)

    d = ImageDraw.Draw(canvas)
    draw_text(d, x1, y0, CTA_L1, f, WHITE, tracking=S(CTA_TRACKING))
    draw_text(d, x2, y0 + h1 + S(CTA_LINE_GAP), CTA_L2, f, WHITE, tracking=S(CTA_TRACKING))

    full = canvas.resize((W, H), Image.Resampling.LANCZOS)

    # sprite apertado para o pop no lugar (o render escala em torno do centro)
    arr = np.array(full)
    ys, xs = np.where(arr[:, :, 3] > 0)
    if len(xs):
        pad = 16
        x0, x1b = max(0, xs.min() - pad), min(W, xs.max() + pad + 1)
        y0b, y1b = max(0, ys.min() - pad), min(H, ys.max() + pad + 1)
        sprite = full.crop((x0, y0b, x1b, y1b))
        meta = {
            "x": int(x0),
            "y": int(y0b),
            "w": int(x1b - x0),
            "h": int(y1b - y0b),
            "cx": int((x0 + x1b) / 2),
            "cy": int((y0b + y1b) / 2),
            "enter_s": 1.0,
            "lines": [CTA_L1, CTA_L2],
            "font": "Barlow Condensed ExtraBold",
            "size_px": CTA_SIZE,
            "center_y": CTA_CENTER_Y,
        }
    else:
        sprite, meta = full, {}
    return full, sprite, meta


def write_pieces_json(path: Path):
    data = []
    for pid, name, entrada, parcela, style, align, y in PIECES:
        data.append({
            "id": pid,
            "nome": name,
            "entrada": entrada,
            "parcela": parcela,
            "linha_entrada": f"Entrada de {entrada}",
            "linha_parcela": f"Parcelas de {parcela}",
            "style": style,
            "align": align,
            "y_pills": y,
            "overlay": f"overlays/{pid}.png",
            "music": MUSIC[pid],
        })
    path.write_text(json.dumps({"cta": "overlays/cta.png",
                                 "cta_sprite": "overlays/cta-sprite.png",
                                 "cta_meta": "overlays/cta-meta.json",
                                 "pieces": data}, ensure_ascii=False, indent=2) + "\n")


def generate_all():
    OUT.mkdir(parents=True, exist_ok=True)
    for pid, name, entrada, parcela, style, align, y in PIECES:
        im = build_bracket_overlay(entrada, parcela, name, style, align, y)
        dest = OUT / f"{pid}.png"
        im.save(dest, "PNG")
        print("wrote", dest, im.size)

    cta, sprite, meta = build_cta()
    cta.save(OUT / "cta.png", "PNG")
    sprite.save(OUT / "cta-sprite.png", "PNG")
    (OUT / "cta-meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n")
    print("wrote", OUT / "cta.png", "sprite", sprite.size, "meta", meta)

    write_pieces_json(ROOT / "pieces.json")
    print("wrote", ROOT / "pieces.json")


def make_preview(path: Path | None = None):
    """Contact sheet de todas as peças + CTA, fundo cinza."""
    path = path or (ROOT / "preview-overlays.jpg")
    cols = 6
    thumb_w, thumb_h = 270, 480
    gap = 12
    label_h = 36
    rows = int(np.ceil(len(PIECES) / cols))
    # +1 slot for a CTA-on-gray swatch if we want; we composite CTA on every thumb
    # so collisions can be checked.
    title_h = 64
    Wg = gap + cols * (thumb_w + gap)
    Hg = title_h + gap + rows * (thumb_h + label_h + gap)
    gray = (110, 110, 110, 255)
    sheet = Image.new("RGB", (Wg, Hg), (110, 110, 110))
    d = ImageDraw.Draw(sheet)
    title_font = font(FONT_NAME, 26)
    lab_font = font(FONT_HANDLE, 16)
    d.text((gap, 18), "lote-v6 overlays  (valores + nome + @ + CTA)  •  fundo cinza  •  rascunho",
           font=title_font, fill=(30, 30, 30))

    cta = Image.open(OUT / "cta.png").convert("RGBA")
    for i, (pid, name, entrada, parcela, style, align, y) in enumerate(PIECES):
        r, c = divmod(i, cols)
        x = gap + c * (thumb_w + gap)
        y0 = title_h + gap + r * (thumb_h + label_h + gap)
        cell = Image.new("RGBA", (W, H), gray)
        ov = Image.open(OUT / f"{pid}.png").convert("RGBA")
        cell.alpha_composite(ov)
        cell.alpha_composite(cta)
        thumb = cell.resize((thumb_w, thumb_h), Image.Resampling.LANCZOS).convert("RGB")
        sheet.paste(thumb, (x, y0))
        label = f"{pid} {name}"
        sub = f"{style}/{align}"
        d.text((x, y0 + thumb_h + 4), label, font=lab_font, fill=(30, 30, 30))
        d.text((x, y0 + thumb_h + 20), sub, font=lab_font, fill=(50, 50, 50))

    sheet.save(path, "JPEG", quality=90, optimize=True)
    print("wrote", path, sheet.size)
    return path


import sys as _s; _s.path.insert(0, str(Path(__file__).parent))
from pieces_v5 import PIECES, MUSIC  # lote-v6

if __name__ == "__main__":
    generate_all()
    make_preview()
