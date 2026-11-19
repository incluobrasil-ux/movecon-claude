"""Calcula entrada e parcela dos anuncios (Marketplace e Reels) a partir do valor do bem.

Uso:
  py -3 calc_valores.py 66900            -> padrao Marketplace (tabela 4076)
  py -3 calc_valores.py 66900 --reel     -> padrao dos videos (18% / 0,9%)

Regras (ver 03-Padroes/Calculo de entrada e parcela.md):
  Marketplace: entrada = 20% do valor, arredondada para cima, sem centavos.
               parcela = coluna 9a-150a da tabela 4076 (MOVECON 7, 150 meses, grupo U2011),
               na menor linha com credito >= 2x o valor do bem; se nenhuma alcanca, ultima linha.
  Reel:        entrada ~= 18% do valor; parcela ~= 0,9% do valor (decisao de 14/11/2026).
"""
import json
import math
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
TABELA = os.path.join(AQUI, "..", "tabelas", "tabela4076.json")


def brl(v, centavos=True):
    s = f"{v:,.2f}" if centavos else f"{v:,.0f}"
    return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")


def marketplace(valor):
    linhas = json.load(open(TABELA, encoding="utf-8"))["linhas"]
    dobro = 2 * valor
    escolhida, n = linhas[-1], len(linhas)
    for i, l in enumerate(linhas, start=1):
        if l["credito"] >= dobro:
            escolhida, n = l, i
            break
    return {
        "valor_bem": valor,
        "entrada": int(math.ceil(valor * 0.2 - 1e-9)),
        "parcela": escolhida["parcela_tabela"],
        "linha_tabela": n,
        "credito_da_linha": escolhida["credito"],
        "teto_usado": dobro > linhas[-1]["credito"],
    }


def reel(valor):
    # entrada arredondada a centena; parcela arredondada ao real, sem centavos (padrao do lote-v3, 14/11)
    return {"valor_bem": valor, "entrada": int(round(valor * 0.18 / 100.0) * 100), "parcela": int(round(valor * 0.009))}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    valor = float(sys.argv[1].replace(".", "").replace(",", ".")) if "," in sys.argv[1] else float(sys.argv[1])
    if "--reel" in sys.argv:
        r = reel(valor)
        print(f"Bem {brl(valor)} | Entrada de {brl(r['entrada'], False)} | Parcelas de {brl(r['parcela'], False)}")
    else:
        r = marketplace(valor)
        aviso = " (TETO: o dobro passou da ultima linha)" if r["teto_usado"] else ""
        print(f"Bem {brl(valor)} | ENTRADA DE {brl(r['entrada'], False)} | PARCELAS DE {brl(r['parcela'])} | linha {r['linha_tabela']}{aviso}")
    print(json.dumps(r, ensure_ascii=False))
