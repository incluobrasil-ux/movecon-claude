#!/usr/bin/env python3
"""Prepare Marketplace leva-01 fotos-v1: cover plates and shop names only."""
from __future__ import annotations
import json, shutil
from pathlib import Path
from collections import defaultdict
from PIL import Image, ImageDraw, ImageFont
import math

BASE = Path("/workspace/movecon/marketplace/rascunhos-2026-11-19/leva-01")
WORK = Path("/workspace/movecon/marketplace/rascunhos-2026-11-19/_work")
LPD = json.loads((WORK / "lpd.json").read_text())

# Discard original files (copied to <asset>/_descartadas/, never deleted)
DISCARD = {
    "027-fiat-mobi-2025-33880568": [
        ("02.jpg", "pessoa com rosto identificável ao fundo (camisa laranja)")
    ],
}

# Skip LPD boxes: (asset prefix 3 digits or full name, file, x1, y1) approx match
# reason documented
SKIP_LPD = [
    # (asset, file, x1, y1, reason)
    ("001-fiat-cronos-2023-33924931", "01.jpg", 834, 391, "falso positivo, recorte minúsculo"),
    ("001-fiat-cronos-2023-33924931", "04.jpg", 720, 326, "falso positivo minúsculo"),
    ("001-fiat-cronos-2023-33924931", "09.jpg", 749, 225, "falso positivo no interior"),
    ("002-honda-hr-v-2017-33229992", "09.jpg", 173, 157, "falso positivo minúsculo"),
    ("004-volkswagen-6-160-2019-33940372", "01.jpg", 233, 272, "falso positivo / ilegível"),
    ("004-volkswagen-6-160-2019-33940372", "05.jpg", 509, 434, "bateria, não é placa"),
    ("006-volkswagen-polo-2025-21896758", "08.jpg", 0, 0, "falso positivo enorme no interior"),
    ("007-toyota-hilux-cabine-dupla-2020-33928801", "01.jpg", 697, 195, "recorte minúsculo ao fundo"),
    ("007-toyota-hilux-cabine-dupla-2020-33928801", "01.jpg", 678, 189, "recorte minúsculo ao fundo"),
    ("008-ford-ecosport-2019-4181874", "04.jpg", 112, 114, "emblema FIAT da estepe, não é placa"),
    ("009-volkswagen-express-2019-22329450", "04.jpg", 547, 288, "botão do painel, não é placa"),
    ("014-volvo-fh-460-2012-32317152", "04.jpg", 121, 59, "display do painel/hodômetro, não cobrir"),
    ("021-volkswagen-saveiro-2023-33824549", "07.jpg", 528, 625, "saídas de ar do painel"),
    ("021-volkswagen-saveiro-2023-33824549", "10.jpg", 528, 625, "saídas de ar do painel"),
    ("025-volkswagen-gol-2021-21896263", "05.jpg", 685, 48, "reflexo ilegível no para-brisa"),
    ("026-chevrolet-spin-2017-33444677", "08.jpg", 637, 256, "rádio (100.1 MHz), não é placa"),
    ("026-chevrolet-spin-2017-33444677", "10.jpg", 612, 196, "cluster/hodômetro, não cobrir"),
    ("028-ford-cargo-1119-2017-33928010", "04.jpg", 342, 935, "cartaz Feirão BV (banco/financiamento, fica)"),
]

# Manual boxes: asset, file, box (x1,y1,x2,y2), tipo, desc
MANUAL = [
    # 001 SACAR signs
    ("001-fiat-cronos-2023-33924931", "01.jpg", (520, 0, 900, 82), "loja", "letreiro parcial da loja no topo"),
    ("001-fiat-cronos-2023-33924931", "02.jpg", (0, 0, 435, 90), "loja", "letreiro VEÍCULOS e telefone (73) 9 9910-4936"),
    ("001-fiat-cronos-2023-33924931", "02.jpg", (498, 0, 805, 108), "loja", "letreiro COMPRA-VENDA e @SACARVEICULOS com telefone"),
    ("001-fiat-cronos-2023-33924931", "07.jpg", (300, 150, 530, 215), "loja", "letreiro TORQUE visível pelo para-brisa"),
    # 004 entrance sign
    ("004-volkswagen-6-160-2019-33940372", "01.jpg", (778, 12, 1024, 185), "loja", "letreiro ENTRADA 121 10 no vidro da loja"),
    # 005 missed tailgate plate QYP-1A68 + GM plate of this truck (LPD only got background GM plates)
    ("005-hyundai-hr-2020-33146492", "08.jpg", (275, 598, 455, 675), "placa", "placa verdadeira QYP-1A68 na tampa da caçamba"),
    ("005-hyundai-hr-2020-33146492", "08.jpg", (515, 798, 750, 885), "placa", "placa de loja GM AUTOSS no para-choque traseiro"),
    ("005-hyundai-hr-2020-33146492", "08.jpg", (1148, 385, 1280, 440), "placa", "placa de loja GM no carro ao fundo (direita), caixa LPD justa demais"),
    # 007 missed rear dealer plate
    ("007-toyota-hilux-cabine-dupla-2020-33928801", "06.jpg", (150, 328, 285, 390), "placa", "placa de loja JK VEÍCULOS na traseira (LPD não pegou)"),
    # 010 missed/improve rear plate AY06C23
    ("010-fiat-strada-2014-6645486", "04.jpg", (85, 528, 220, 665), "placa", "placa AY06C23 na traseira (LPD não pegou)"),
    ("010-fiat-strada-2014-6645486", "06.jpg", (240, 812, 545, 1050), "placa", "placa AY06C23 em close (cobrir inteira; LPD ficou curta)"),
    # 011 shop poster (financing 'aprovação imediata' stays)
    ("011-hyundai-hb20s-2024-30990823", "01.jpg", (415, 82, 552, 232), "loja", "cartaz MEGA FEIRÃO / sfmotors.com.br"),
    # 014 GUGA sign (plate via LPD, reinforced below)
    ("014-volvo-fh-460-2012-32317152", "01.jpg", (390, 125, 800, 340), "loja", "letreiro GUGA VEÍCULOS + @gugaveiculos01 + Guga Veiculos"),
    ("014-volvo-fh-460-2012-32317152", "01.jpg", (82, 800, 190, 862), "placa", "placa de loja GUGA VEÍCULOS (reforço da caixa LPD)"),
    # 015 missed plate + CAR STORE signs
    ("015-jeep-compass-2019-32019429", "02.jpg", (488, 412, 605, 458), "placa", "placa de loja CAR STORE na frente (LPD não pegou)"),
    ("015-jeep-compass-2019-32019429", "02.jpg", (308, 82, 535, 150), "loja", "letreiro suspenso CAR STORE"),
    ("015-jeep-compass-2019-32019429", "02.jpg", (638, 48, 715, 105), "loja", "letreiro suspenso DS ao fundo"),
    ("015-jeep-compass-2019-32019429", "03.jpg", (528, 0, 645, 95), "loja", "letreiro suspenso CAR STORE no alto"),
    # 016 DS VEÍCULOS sign + GOLDEN (Safra flag stays)
    ("016-fiat-argo-2022-32321805", "01.jpg", (498, 0, 1100, 122), "loja", "letreiro DS VEÍCULOS + telefones e @dsveiculos"),
    ("016-fiat-argo-2022-32321805", "01.jpg", (70, 95, 300, 240), "loja", "letreiro GOLDEN CAR / PEUGEOT no prédio vizinho"),
    ("016-fiat-argo-2022-32321805", "07.jpg", (498, 0, 1105, 128), "loja", "letreiro DS VEÍCULOS + telefones e @dsveiculos"),
    ("016-fiat-argo-2022-32321805", "07.jpg", (0, 95, 300, 250), "loja", "letreiro GOLDEN / PEUGEOT no prédio vizinho"),
    # 018 missed front plate + UP sign + background plate
    ("018-iveco-daily-chassi-2015-33944119", "01.jpg", (65, 678, 205, 765), "placa", "placa de loja UP PRIME na frente (LPD não pegou)"),
    ("018-iveco-daily-chassi-2015-33944119", "07.jpg", (1140, 0, 1280, 235), "loja", "letreiro UP VEÍCULOS + WhatsApp e site"),
    ("018-iveco-daily-chassi-2015-33944119", "07.jpg", (1175, 498, 1280, 558), "placa", "placa do carro vermelho ao fundo"),
    # 021 GS Autos facade
    ("021-volkswagen-saveiro-2023-33824549", "01.jpg", (675, 72, 800, 205), "loja", "letreiro GS Autos SEMINOVOS + @gsautos_seminovos"),
    # 027 background Chevy plate (02 discarded)
    # 030 shop slogan
    ("030-fiat-toro-2024-33882411", "02.jpg", (0, 78, 325, 185), "loja", "letreiro '...nho dos seus sonhos' na fachada"),

    # --- second pass ---
    # 005 angled rear plates
    ("005-hyundai-hr-2020-33146492", "09.jpg", (70, 498, 215, 575), "placa", "placa verdadeira QYP-1A68 na tampa (ângulo)"),
    ("005-hyundai-hr-2020-33146492", "09.jpg", (200, 615, 305, 680), "placa", "placa de loja GM AUTOSS no para-choque (ângulo)"),
    ("005-hyundai-hr-2020-33146492", "10.jpg", (80, 475, 235, 560), "placa", "placa verdadeira QYP-1A68 na tampa (ângulo)"),
    ("005-hyundai-hr-2020-33146492", "10.jpg", (225, 590, 345, 660), "placa", "placa de loja GM AUTOSS no para-choque (ângulo)"),
    # 012 election propaganda MUST cover + shop signs + bg plate
    ("012-ford-ranger-cabine-dupla-2025-33855783", "01.jpg", (700, 275, 800, 325), "placa", "placa do Toyota ao fundo"),
    ("012-ford-ranger-cabine-dupla-2025-33855783", "02.jpg", (298, 70, 405, 198), "bandeira", "outdoor eleitoral Cibele de Teobaldo 4478"),
    ("012-ford-ranger-cabine-dupla-2025-33855783", "03.jpg", (612, 0, 760, 200), "bandeira", "outdoor eleitoral Cibele de Teobaldo 4478"),
    ("012-ford-ranger-cabine-dupla-2025-33855783", "03.jpg", (198, 100, 355, 160), "loja", "letreiro RFCWORKING no prédio ao fundo"),
    ("012-ford-ranger-cabine-dupla-2025-33855783", "04.jpg", (0, 0, 175, 200), "loja", "letreiro AGILLI VEÍCULOS + Instagram e telefone"),
    ("012-ford-ranger-cabine-dupla-2025-33855783", "04.jpg", (248, 150, 400, 200), "loja", "letreiro Ortobom ao fundo"),
    # 015 leftover hanging signs in 01
    ("015-jeep-compass-2019-32019429", "01.jpg", (450, 215, 730, 280), "loja", "letreiros suspensos amarelo e azul no salão"),
    # 017 missed rear SPORT CAR plate
    ("017-toyota-corolla-2021-32169520", "05.jpg", (575, 435, 725, 505), "placa", "placa de loja SPORT CAR na traseira (LPD não pegou)"),
    # 018/02 missed plate + UP PRIME sign
    ("018-iveco-daily-chassi-2015-33944119", "02.jpg", (1050, 758, 1180, 840), "placa", "placa de loja UP PRIME na frente (LPD não pegou)"),
    ("018-iveco-daily-chassi-2015-33944119", "02.jpg", (650, 110, 895, 270), "loja", "letreiro UP PRIME VEÍCULOS atrás da cabine"),

    ("018-iveco-daily-chassi-2015-33944119", "07.jpg", (580, 788, 735, 860), "placa", "placa de loja UP PRIME na frente (LPD não pegou)"),
    ("018-iveco-daily-chassi-2015-33944119", "08.jpg", (590, 730, 715, 790), "placa", "placa de loja UP PRIME na traseira (LPD não pegou)"),
    ("018-iveco-daily-chassi-2015-33944119", "03.jpg", (785, 742, 885, 800), "placa", "placa de loja UP PRIME na traseira (LPD não pegou)"),
    # 019 plates at an angle + HAVAN
    ("019-nissan-frontier-2016-6805340", "01.jpg", (0, 615, 58, 710), "placa", "placa dianteira visível no ângulo"),
    ("019-nissan-frontier-2016-6805340", "01.jpg", (1095, 95, 1280, 240), "loja", "letreiro HAVAN no prédio ao fundo"),
    # 020 TAKE CAR flags + missed 03 plate
    ("020-volkswagen-taos-2023-33941317", "01.jpg", (40, 0, 125, 200), "loja", "bandeira TAKE CAR na fachada"),
    ("020-volkswagen-taos-2023-33941317", "03.jpg", (675, 298, 805, 365), "placa", "placa de loja TAKE CAR na traseira (LPD não pegou)"),
    ("020-volkswagen-taos-2023-33941317", "03.jpg", (755, 45, 835, 200), "loja", "bandeira TAKE CAR na fachada"),
    ("020-volkswagen-taos-2023-33941317", "02.jpg", (0, 0, 155, 55), "loja", "letreiro Shell V-Power no posto ao fundo"),
    # 023 missed rear plate
    ("023-honda-civic-2021-30025036", "04.jpg", (815, 348, 925, 405), "placa", "placa de loja MANOCAR na traseira (LPD não pegou)"),
    # 024 FOX sign + Instagram on glass
    ("024-chevrolet-tracker-2022-33229970", "09.jpg", (0, 0, 255, 95), "loja", "letreiro FOX PNEUS ao fundo"),
    ("024-chevrolet-tracker-2022-33229970", "09.jpg", (870, 0, 1024, 85), "loja", "letreiro de loja no alto à direita"),
    ("024-chevrolet-tracker-2022-33229970", "09.jpg", (475, 170, 630, 215), "loja", "adesivo @inovaveiculosba no vidro traseiro"),

]

CONF_MIN = 0.28
# Keep these low-conf LPD boxes (they are real plates)
KEEP_LOW = {
    ("022-mercedes-benz-axor-2020-21244558", "01.jpg"),
    ("022-mercedes-benz-axor-2020-21244558", "03.jpg"),
}

PAD_PLATE = 3  # px margin around LPD boxes


def assets():
    return sorted(p for p in BASE.iterdir() if p.is_dir() and p.name[0].isdigit())


def skip_lpd(asset, fn, box):
    for a, f, x1, y1, reason in SKIP_LPD:
        if a == asset and f == fn and abs(box["x1"] - x1) <= 8 and abs(box["y1"] - y1) <= 8:
            return reason
    return None


def lpd_for(asset, fn):
    for r in LPD:
        if r["asset"] == asset and r["file"] == fn:
            return r
    return {"boxes": []}


def collect_boxes(asset, fn):
    """Return list of {tipo, box:(x1,y1,x2,y2), desc, src}"""
    out = []
    rec = lpd_for(asset, fn)
    keep_low = (asset, fn) in KEEP_LOW
    for b in rec.get("boxes", []):
        reason = skip_lpd(asset, fn, b)
        if reason:
            continue
        if b["conf"] < CONF_MIN and not keep_low:
            continue
        x1, y1, x2, y2 = b["x1"], b["y1"], b["x2"], b["y2"]
        # pad
        x1 -= PAD_PLATE; y1 -= PAD_PLATE; x2 += PAD_PLATE; y2 += PAD_PLATE
        out.append({
            "tipo": "placa",
            "box": (x1, y1, x2, y2),
            "desc": f"placa detectada (conf {b['conf']:.2f})",
            "src": "lpd",
        })
    for a, f, box, tipo, desc in MANUAL:
        if a == asset and f == fn:
            out.append({"tipo": tipo, "box": box, "desc": desc, "src": "manual"})
    return out


def clamp_box(box, w, h):
    x1, y1, x2, y2 = box
    x1 = max(0, min(w - 1, int(x1)))
    y1 = max(0, min(h - 1, int(y1)))
    x2 = max(0, min(w, int(x2)))
    y2 = max(0, min(h, int(y2)))
    if x2 <= x1 or y2 <= y1:
        return None
    return (x1, y1, x2, y2)


def draw_bars(im: Image.Image, boxes):
    dr = ImageDraw.Draw(im)
    applied = []
    w, h = im.size
    for b in boxes:
        box = clamp_box(b["box"], w, h)
        if not box:
            continue
        dr.rectangle(box, fill=(0, 0, 0))
        applied.append({**b, "box": box})
    return applied


def main(write_finals=False):
    preview_root = WORK / "v1-preview"
    preview_root.mkdir(exist_ok=True)
    log = {}
    for d in assets():
        orig = d / "fotos-originais"
        fotos = sorted(orig.glob("*.jpg"), key=lambda p: int(p.stem))
        discards = {fn: why for fn, why in DISCARD.get(d.name, [])}
        kept = []
        notes = {}
        for f in fotos:
            boxes = collect_boxes(d.name, f.name)
            if f.name in discards:
                notes[f.name] = {"discard": discards[f.name], "boxes": boxes}
                continue
            notes[f.name] = {"discard": None, "boxes": boxes}
            kept.append(f)

        # build preview images (and finals if requested)
        dest_preview = preview_root / d.name
        dest_preview.mkdir(exist_ok=True)
        # overlay dir
        ov = dest_preview / "_overlay"
        ov.mkdir(exist_ok=True)

        finals_map = []  # (src name, dest num, applied, identical)
        n = 0
        for f in kept:
            n += 1
            dest_name = f"{n:02d}.jpg"
            applied_plan = notes[f.name]["boxes"]
            im = Image.open(f).convert("RGB")
            w, h = im.size
            applied = []
            if applied_plan:
                # work on a copy
                out = im.copy()
                applied = draw_bars(out, applied_plan)
                out.save(dest_preview / dest_name, quality=95, subsampling=0, optimize=True)
                # overlay (bars in red for QA)
                ovim = Image.open(f).convert("RGB")
                dr = ImageDraw.Draw(ovim, "RGBA") if False else ImageDraw.Draw(ovim)
                for b in applied:
                    x1, y1, x2, y2 = b["box"]
                    color = (255, 0, 0) if b["tipo"] == "placa" else (255, 180, 0)
                    dr.rectangle([x1, y1, x2, y2], outline=color, width=3)
                    # also fill semi? no, keep original visible around; fill black already on dest
                    # draw a translucent? PIL RGB can't. Just outline + a small label
                ovim.save(ov / dest_name, quality=85)
                identical = False
            else:
                shutil.copy2(f, dest_preview / dest_name)
                # overlay = just a copy for consistency (or skip)
                shutil.copy2(f, ov / dest_name)
                identical = True
                applied = []
            finals_map.append({
                "src": f.name, "dest": dest_name, "applied": applied,
                "identical": identical, "w": w, "h": h,
            })
            notes[f.name]["dest"] = dest_name
            notes[f.name]["applied"] = applied

        log[d.name] = {
            "kept": len(kept),
            "discarded": [(fn, why) for fn, why in discards.items()],
            "fora": len(kept) < 6,
            "map": finals_map,
            "notes": {
                k: {
                    "discard": v["discard"],
                    "dest": v.get("dest"),
                    "applied": [
                        {"tipo": b["tipo"], "box": b["box"], "desc": b["desc"], "src": b["src"]}
                        for b in v.get("applied", v.get("boxes", []))
                    ],
                } for k, v in notes.items()
            },
        }
        print(f"{d.name}: kept {len(kept)} discarded {len(discards)} fora={len(kept)<6}")

        if write_finals:
            # write to asset folders
            fv = d / "fotos-v1"
            if fv.exists():
                # don't delete; if rerunning, we overwrite jpgs and may leave extras — clean by renaming? 
                # Never delete. If previous run, write into fotos-v1 (overwrite jpgs).
                pass
            fv.mkdir(exist_ok=True)
            for item in finals_map:
                src_p = dest_preview / item["dest"]
                shutil.copy2(src_p, fv / item["dest"])
            if discards:
                dd = d / "_descartadas"
                dd.mkdir(exist_ok=True)
                for fn, why in discards.items():
                    shutil.copy2(orig / fn, dd / fn)

    (WORK / "v1-log.json").write_text(json.dumps(log, indent=2, ensure_ascii=False))
    return log


if __name__ == "__main__":
    import sys
    write = "--final" in sys.argv
    main(write_finals=write)
