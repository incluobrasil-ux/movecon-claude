"""Memória compartilhada da mineração (vai para o GitHub: quem puxa o cofre recebe tudo o que já foi feito).

- 07-Ferramentas/referencias/buscas-feitas.csv: toda busca feita na Biblioteca da Meta, de qualquer PC.
  Antes de buscar, o script avisa se o mesmo termo já foi buscado e onde ficou o resultado.
- 07-Ferramentas/referencias/memoria-mineracao.jsonl: todo anúncio já analisado pela peneira (um por linha).

Os dois arquivos só recebem linhas novas no fim. O .gitattributes junta as linhas de PCs diferentes no pull
(merge=union), sem conflito.

Ver o que já foi buscado:  py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py [palavra]
"""
import csv, json, os, socket, sys
from datetime import date, datetime
from pathlib import Path

COFRE = Path(__file__).resolve().parents[3]
REF = COFRE / "07-Ferramentas" / "referencias"
BUSCAS = REF / "buscas-feitas.csv"
MEMORIA = REF / "memoria-mineracao.jsonl"
MEMORIA_ANTIGA = COFRE / "10-Trabalho" / "_memoria-mineracao.json"  # antes de 25/11/2026 ficava fora do GitHub
CAMPOS = ["data", "ferramenta", "termo", "pais", "status", "coletados", "pc", "saida"]


def _norm(t):
    return " ".join(str(t).lower().split())


def buscas():
    if not BUSCAS.exists():
        return []
    with open(BUSCAS, encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f, delimiter=";"))


def avisar(termo, ferramenta):
    """Imprime as vezes em que o termo já foi buscado. Não bloqueia: quem decide repetir é quem minera."""
    ant = [b for b in buscas() if _norm(b["termo"]) == _norm(termo)]
    for b in ant[-3:]:
        print(f"  [JÁ BUSCADO] '{termo}' em {b['data']} ({b['ferramenta']}, {b['status']}, {b['coletados']} coletados, "
              f"pc {b['pc']}) -> {b['saida']}", flush=True)
    return ant


def registrar(ferramenta, termo, pais, status, coletados, saida):
    novo = not BUSCAS.exists()
    BUSCAS.parent.mkdir(parents=True, exist_ok=True)
    try:
        rel = str(Path(saida).resolve().relative_to(COFRE)).replace("\\", "/")
    except ValueError:
        rel = str(saida)
    with open(BUSCAS, "a", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter=";")
        if novo:
            w.writerow(CAMPOS)
        w.writerow([datetime.now().strftime("%Y-%m-%d %H:%M"), ferramenta, termo, pais, status, coletados,
                    os.environ.get("COMPUTERNAME") or socket.gethostname(), rel])


def ler_memoria():
    mem = {}
    if MEMORIA_ANTIGA.exists():
        try:
            mem.update(json.loads(MEMORIA_ANTIGA.read_text(encoding="utf-8")))
        except ValueError:
            pass
    if MEMORIA.exists():
        for linha in MEMORIA.read_text(encoding="utf-8").splitlines():
            if linha.strip():
                try:
                    r = json.loads(linha)
                    mem[r.pop("id")] = r
                except (ValueError, KeyError):
                    pass
    return mem


def gravar_memoria(novos):
    MEMORIA.parent.mkdir(parents=True, exist_ok=True)
    with open(MEMORIA, "a", encoding="utf-8") as f:
        for aid, r in novos.items():
            f.write(json.dumps({"id": aid, **r}, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    filtro = _norm(" ".join(sys.argv[1:]))
    lst = [b for b in buscas() if filtro in _norm(b["termo"])]
    print(f"{len(lst)} buscas registradas" + (f" com '{filtro}'" if filtro else "") + f" | {len(ler_memoria())} anúncios já analisados")
    for b in lst[-60:]:
        print(f"{b['data']:16} {b['ferramenta']:15} {b['status']:8} {b['coletados']:>5}  {b['termo']}  -> {b['saida']}")
