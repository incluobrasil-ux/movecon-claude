#!/usr/bin/env python3
"""Gera links da Biblioteca de Anúncios da Meta já filtrados.

Uso:
  python gerar_urls.py "frete grátis brinquedo sensorial" "montessori" --pais BR --dias 7 --midia video
  python gerar_urls.py "yampi.com.br" --exato

Opções:
  --pais    código do país (padrão BR; use ALL para todos)
  --dias    só anúncios iniciados nos últimos N dias (pega quem está subindo verba agora)
  --midia   all | image | video (padrão all)
  --exato   busca a frase exata em vez de palavras soltas
  --inativos inclui anúncios encerrados
Saída: Markdown com um link por termo.
"""
import argparse
import datetime as dt
from urllib.parse import urlencode

BASE = "https://www.facebook.com/ads/library/"


def montar(termo, pais="BR", dias=None, midia="all", exato=False, inativos=False):
    params = {
        "active_status": "all" if inativos else "active",
        "ad_type": "all",
        "country": pais.upper(),
        "is_targeted_country": "false",
        "media_type": midia,
        "q": termo,
        "search_type": "keyword_exact_phrase" if exato else "keyword_unordered",
        "sort_data[direction]": "desc",
        "sort_data[mode]": "relevancy_monthly_grouped",
    }
    if dias:
        inicio = dt.date.today() - dt.timedelta(days=dias)
        params["start_date[min]"] = inicio.isoformat()
    return BASE + "?" + urlencode(params)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("termos", nargs="+")
    p.add_argument("--pais", default="BR")
    p.add_argument("--dias", type=int)
    p.add_argument("--midia", default="all", choices=["all", "image", "video"])
    p.add_argument("--exato", action="store_true")
    p.add_argument("--inativos", action="store_true")
    a = p.parse_args()
    for t in a.termos:
        url = montar(t, a.pais, a.dias, a.midia, a.exato, a.inativos)
        print(f"- [{t}]({url})")


if __name__ == "__main__":
    main()
