---
tipo: modelo
atualizado: 2026-11-25
---
# Prompt padrão de mineração (para parceiros e vendedores)

**Como usar:**
1. Abra o Claude Code na **pasta raiz do cofre** (`MOVECON-Claude`).
2. Copie o bloco abaixo e preencha só a parte **PREENCHA**.
3. Cole e envie. O resto é fixo: não mude.

O Claude puxa o projeto, lê o que já foi feito, monta um plano adaptado ao seu nicho e **espera o seu OK** antes de buscar.

```
MINERAÇÃO (prompt padrão do cofre MOVECON-Claude)

=== PREENCHA ===
NICHO: <ex.: SUV e carro elétrico acima de R$ 140 mil / caminhão / trator / imóvel>
O QUE EU QUERO: <escolha 1: (A) vídeos de veículo para editar e postar | (B) ver o que os concorrentes anunciam e quem está escalando | (C) bens com fotos para o Marketplace>, e em palavras suas: <o que você quer descobrir ou receber>
REGIÃO: <Brasil todo / estado / cidade>
FAIXA DE PREÇO DO BEM: <ex.: R$ 140 mil a R$ 400 mil>
QUANTIDADE: <ex.: 10 vídeos / top 10 concorrentes / 20 bens>
CONTA ONDE VAI POSTAR (só se for A): <@conta>
=== FIM ===

Regras fixas (não altere):
0. Rode git pull na pasta do cofre. Se chegar commit novo, peça para eu fechar e abrir o Claude Code de novo na pasta raiz do cofre, e então continue.
1. Leia CLAUDE.md, 01-Regras/, 02-Funcoes/Minerador.md, 03-Padroes/Mineracao - o que procurar.md e 05-Operacao/Decisoes.md (a decisão mais nova vale).
2. Leia 06-Referencias/mineracao/Ja minerado.md e as notas ligadas ao meu nicho. Rode py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra do nicho> para cada palavra principal. Reaproveite tudo o que existe; não repita termo já buscado sem motivo.
3. Use a skill do tipo: A = minerar-criativos (seção 2), B = minerar-mercado (seção 3) + nota 0 a 10 de 07-Ferramentas/referencias/sinais-escala.md, C = minerar-bens (seção 1).
4. Adapte do modelo validado mais próximo, sem inventar:
   - A: o método dos brutos de caminhão (06-Referencias/mineracao/Brutos de caminhao (25-11).md). Termos na ordem que mais rendeu: palavra genérica do nicho, página inteira de loja boa, termo de unidade única ("único dono", "km original valor"), busca funda com --inativos pela palavra do modelo. Coleta com brutos_meta.py (Meta) ou, se o pedido for TikTok, com tiktok_links.py sobre os links que eu colar (a busca no TikTok sem login cai em captcha; não contorne). Peneira com triagem_brutos.py --palavras "<palavras do meu nicho>" --min-preco <mín> --max-preco <máx>. Só vertical nativo 9:16, veículo inteiro, sem texto, sem pessoa.
   - B: biblioteca_meta.py "termo" --pais BR --rolagens 8 --prints <pasta>/prints --saida <pasta>/<termo>.json. Nota de escala, RISCO (promessa de contemplação, venda de cota, "crédito na hora": registra, não modela) e ATENÇÃO ("sem entrada", "nome limpo": modela a ideia, sem copiar).
   - C: miner.py (Mobiauto), 6 a 10 fotos da mesma unidade, fora da praça proibida.
5. ANTES de buscar, me mostre o PLANO em até 12 linhas e ESPERE meu OK:
   - tipo e skill;
   - ferramenta;
   - lista de até 15 termos, com os já buscados marcados;
   - o que vai reaproveitar de minerações anteriores;
   - formato da entrega.
6. Regras que não se negociam:
   - sem login: nunca use perfil do BitBrowser nem conta logada para minerar;
   - nunca crie robô ou script novo;
   - só leitura;
   - uma busca por vez, 5 a 10 s entre elas, no máximo cerca de 15 buscas;
   - "Nenhum anúncio corresponde" num termo que tinha resultado = bloqueio: pare e avise; não disfarce nem contorne;
   - não invente número: tudo vem do JSON da coleta ou de print; o que faltar vira "sem dado".
7. Valores de entrada e parcela só com py -3 07-Ferramentas/scripts/calc_valores.py <valor> (--reel no caso A).
8. Entrega em 10-Trabalho/AAAA-MM-DD-<tipo>-<nicho>/ no modelo 04-Modelos/Entrega de mineracao.md.
9. No fim:
   - copie o ENTREGA.md e a planilha (sem foto nem vídeo de terceiro) para 06-Referencias/mineracao/AAAA-MM-DD-<nicho>/;
   - ponha uma linha no topo de Ja minerado.md;
   - faça commit + push, junto com 07-Ferramentas/referencias/buscas-feitas.csv e memoria-mineracao.jsonl;
   - se não tiver permissão de push, diga que eu preciso mandar o ENTREGA.md e a planilha para o Samuel.

REVISÃO OBRIGATÓRIA (responda em português, frases curtas):
- commit puxado e se o gancho de mineração apareceu;
- o que reaproveitou do que já existia;
- buscas feitas (quantas, quais) e se houve bloqueio;
- confirme que não usou conta logada nem criou script;
- resultado na quantidade pedida (ou quantos faltaram e por quê);
- itens RISCO ou reprovados, com o motivo;
- caminho da entrega e se o push foi feito.
```

**O que acontece se a pessoa pular o modelo:** se o pedido falar de mineração, o gancho do Claude Code (`antes_de_minerar.py`) injeta as regras e o índice do que já foi feito do mesmo jeito. O modelo só deixa o pedido completo desde o começo.
