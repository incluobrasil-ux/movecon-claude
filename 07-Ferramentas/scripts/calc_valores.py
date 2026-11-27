"""Calcula entrada e parcela dos anuncios (Marketplace e Reels) a partir do valor do bem.

Uso:
  py -3 calc_valores.py 66900            -> padrao Marketplace (tabela 4076)
  py -3 calc_valores.py 66900 --reel     -> padrao dos videos (18% / 0,9%)
  py -3 calc_valores.py 300000 --hp1 [--lance 0.30] [--embutido 0]
                                         -> teste HP1 (hiper 1, tabela 4659): 1a parcela + lance do bolso

Regras (ver 03-Padroes/Calculo de entrada e parcela.md):
  Marketplace: entrada = 20% do valor, arredondada para cima, sem centavos.
               parcela = coluna 9a-150a da tabela 4076 (MOVECON 7, 150 meses, grupo U2011),
               na menor linha com credito >= 2x o valor do bem; se nenhuma alcanca, ultima linha.
  Reel:        entrada ~= 18% do valor; parcela ~= 0,9% do valor (decisao de 14/11/2026).
  HP1:         tabela 4659 (MOVECON 1, 80 meses). A maior carta e R$ 163.943,64, entao junta N cartas iguais:
               N = menor numero de cartas que cobre o bem; linha = menor linha em que N x credito cobre o bem
               (com lance embutido E, o bem precisa caber em N x credito x (1 - E)).
               1a parcela = N x "Pcls 1 a 1"; lance do bolso = (lance - E) x N x credito.
               Lance padrao 0,30 = grupos 0030 e 0031 (lance de 30%): o cliente poe 30% do proprio bolso sobre o
               credito (correcao do Samuel, 27/11/2026). Sem garantia de contemplacao.
"""
import json
import math
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
TABELA = os.path.join(AQUI, "..", "tabelas", "tabela4076.json")
TABELA_HP1 = os.path.join(AQUI, "..", "tabelas", "tabela4659.json")


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


def hp1(valor, lance=0.30, embutido=0.0):
    linhas = json.load(open(TABELA_HP1, encoding="utf-8"))["linhas"]
    util = 1.0 - embutido
    maior = linhas[-1]["credito"]
    n = max(1, math.ceil(valor / (maior * util) - 1e-9))
    escolhida = next(l for l in linhas if n * l["credito"] * util >= valor - 1e-6)
    carta = n * escolhida["credito"]
    return {
        "valor_bem": valor, "cartas": n, "linha_tabela": escolhida["linha"], "credito_por_carta": escolhida["credito"],
        "carta_total": round(carta, 2), "lance_pct": lance, "embutido_pct": embutido,
        "primeira_parcela": round(n * escolhida["parcela_1"], 2),
        "parcelas_2_a_8": round(n * escolhida["parcela_2_a_8"], 2),
        "parcelas_9_a_80": round(n * escolhida["parcela_9_a_80"], 2),
        "lance_do_bolso": round((lance - embutido) * carta, 2),
        "lance_embutido_valor": round(embutido * carta, 2),
        "sobra_para_o_bem": round(carta * util, 2),
    }


def _arg(nome, padrao):
    if nome in sys.argv:
        return float(sys.argv[sys.argv.index(nome) + 1].replace(",", "."))
    return padrao


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    valor = float(sys.argv[1].replace(".", "").replace(",", ".")) if "," in sys.argv[1] else float(sys.argv[1])
    if "--hp1" in sys.argv:
        r = hp1(valor, _arg("--lance", 0.30), _arg("--embutido", 0.0))
        print(f"Bem {brl(valor)} | {r['cartas']} carta(s) de {brl(r['credito_por_carta'])} (linha {r['linha_tabela']}) = {brl(r['carta_total'])}")
        print(f"  TELA: 1a parcela de {brl(round(r['primeira_parcela']), False)} | Lance de {brl(round(r['lance_do_bolso']), False)}")
        print(f"  exato: 1a {brl(r['primeira_parcela'])} | 2a a 8a {brl(r['parcelas_2_a_8'])} | 9a a 80a {brl(r['parcelas_9_a_80'])} | "
              f"lance do bolso {brl(r['lance_do_bolso'])} ({(r['lance_pct'] - r['embutido_pct']) * 100:.0f}% da carta)"
              + (f" + embutido {brl(r['lance_embutido_valor'])}" if r['embutido_pct'] else ""))
    elif "--reel" in sys.argv:
        r = reel(valor)
        print(f"Bem {brl(valor)} | Entrada de {brl(r['entrada'], False)} | Parcelas de {brl(r['parcela'], False)}")
    else:
        r = marketplace(valor)
        aviso = " (TETO: o dobro passou da ultima linha)" if r["teto_usado"] else ""
        print(f"Bem {brl(valor)} | ENTRADA DE {brl(r['entrada'], False)} | PARCELAS DE {brl(r['parcela'])} | linha {r['linha_tabela']}{aviso}")
    print(json.dumps(r, ensure_ascii=False))
