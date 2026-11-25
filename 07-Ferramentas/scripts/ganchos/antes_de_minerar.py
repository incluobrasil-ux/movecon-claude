"""Gancho do Claude Code (UserPromptSubmit), ligado em .claude/settings.json.

Quando o pedido fala de mineração, injeta no contexto do Claude, antes de ele começar:
- o caminho validado (skill, ferramenta pronta, regras que não se negociam);
- o que já foi minerado (06-Referencias/mineracao/Ja minerado.md) e as buscas já feitas em qualquer PC.
Assim ninguém refaz trabalho nem inventa um robô novo. Nunca bloqueia o pedido: sai sempre com código 0.
"""
import csv, json, re, subprocess, sys
from pathlib import Path

COFRE = Path(__file__).resolve().parents[3]
GATILHO = re.compile(r"minera|minerar|biblioteca de an[uú]ncio|ads library|espion|concorrent|brutos?\b|criativos? (de|do|dos|que)|"
                     r"oferta(s)? escalad|o que est[aá] rodando|anunciantes?|pesquisa de mercado", re.I)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        dados = json.loads(sys.stdin.read() or "{}")
    except Exception:
        return
    pedido = dados.get("prompt", "")
    if not GATILHO.search(pedido):
        return
    s = []
    s.append("=== MINERAÇÃO: CONTEXTO OBRIGATÓRIO DO COFRE (gancho antes_de_minerar) ===")
    try:
        atras = subprocess.run(["git", "-C", str(COFRE), "rev-list", "--count", "HEAD..@{u}"], capture_output=True, text=True, timeout=5).stdout.strip()
        if atras and atras != "0":
            s.append(f"ATENÇÃO: o cofre está {atras} commit(s) atrás do GitHub. Rode `git pull` ANTES de minerar.")
    except Exception:
        pass
    s.append("""Siga o modelo validado. NÃO invente processo, robô ou ferramenta nova:
1. Ache o tipo do pedido e use a skill dele:
   - vídeos brutos para editar e postar  -> skill minerar-criativos (seção 2 de 03-Padroes/Mineracao - o que procurar.md)
   - concorrentes, ofertas, quem escala  -> skill minerar-mercado (seção 3) + nota 0 a 10 de 07-Ferramentas/referencias/sinais-escala.md
   - bens para o Marketplace             -> skill minerar-bens (seção 1)
2. Ferramentas prontas (não crie outra):
   - Biblioteca da Meta, concorrentes: py -3 07-Ferramentas/scripts/biblioteca_meta.py "termo" --pais BR --rolagens 8 --prints <pasta>/prints --saida <pasta>/x.json
   - Biblioteca da Meta, vídeos brutos: 07-Ferramentas/scripts/mineracao/brutos_meta.py e depois triagem_brutos.py --palavras "<palavras do nicho>" --min-preco/--max-preco (um processo só; sem --palavras a peneira só aceita caminhão)
   - TikTok, vídeos brutos: a busca sem login cai em captcha. A pessoa copia os links no app e roda mineracao/tiktok_links.py <links.txt> --saida <pasta>/tiktok.json; depois a mesma triagem_brutos.py
   - Os dois avisam quando o termo JÁ FOI BUSCADO e registram a busca em 07-Ferramentas/referencias/buscas-feitas.csv.
3. Regras que não se negociam:
   - SEM LOGIN. Nunca use perfil do BitBrowser nem conta logada para minerar (nenhum perfil do Perfil-do-operador é de mineração).
   - Só leitura. 1 busca a cada 5 a 10 s, uma coleta por vez, no máximo ~15 buscas. "Nenhum anúncio corresponde" em termo que tinha resultado = bloqueio: pare e volte em 1 a 2 h. Não disfarce nem contorne.
   - Promessa de contemplação, venda de cota, "crédito na hora" = RISCO: registra e não modela. "Sem entrada", "nome limpo" = ATENÇÃO.
   - Não invente número: tudo vem do JSON da coleta ou de print.
4. ANTES de buscar: leia 06-Referencias/mineracao/Ja minerado.md e rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra>`. Reaproveite o que existe; só busque o que falta.
4b. Mostre o PLANO (tipo, skill, ferramenta, até 15 termos marcando os já buscados, o que vai reaproveitar, formato da entrega) e espere o OK antes de buscar. Modelo de pedido: 04-Modelos/Prompt de mineracao.md.
5. NO FIM: entrega no modelo 04-Modelos/Entrega de mineracao.md, em 10-Trabalho/AAAA-MM-DD-<tipo>-<tema>/; copie ENTREGA.md e a planilha para 06-Referencias/mineracao/AAAA-MM-DD-<tema>/, ponha uma linha em Ja minerado.md e faça commit + push (se este PC não tiver permissão de push, mande ENTREGA.md e planilha para o Samuel).""")
    idx = COFRE / "06-Referencias" / "mineracao" / "Ja minerado.md"
    if idx.exists():
        linhas = [l for l in idx.read_text(encoding="utf-8").splitlines() if l.startswith("| 20")]
        if linhas:
            s.append("\nJá minerado (Ja minerado.md, mais novos primeiro):")
            s += linhas[:15]
    bus = COFRE / "07-Ferramentas" / "referencias" / "buscas-feitas.csv"
    if bus.exists():
        try:
            with open(bus, encoding="utf-8", newline="") as f:
                lst = list(csv.DictReader(f, delimiter=";"))
            datas = sorted({b["data"][:10] for b in lst})
            s.append(f"\nBuscas já feitas na Biblioteca: {len(lst)} (de {datas[0]} a {datas[-1]}). Ver com registro_buscas.py <palavra>.")
        except Exception:
            pass
    s.append("=== fim do contexto de mineração ===")
    print("\n".join(s))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
