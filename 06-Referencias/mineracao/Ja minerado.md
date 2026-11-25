---
tipo: referencia
atualizado: 2026-11-25
---
# Já minerado (leia ANTES de qualquer mineração)

> **Decisão do Samuel, 25/11/2026:** "sempre que uma pessoa puxar o projeto e subir um prompt de mineração tudo que já trabalhamos deve ser ativado pra não deixar ela fazer o retrabalho".

Esta é a lista de tudo o que já foi minerado, do mais novo para o mais antigo. O gancho do Claude Code (`.claude/settings.json` → `07-Ferramentas/scripts/ganchos/antes_de_minerar.py`) mostra esta tabela sozinho quando alguém pede mineração.

**Pedido de mineração de parceiro ou vendedor:** use o [[Prompt de mineracao]] (04-Modelos). Basta preencher nicho, o que quer, região, faixa e quantidade.

**Antes de buscar:**
1. `git pull`.
2. Leia a linha do tema aqui e a nota ou pasta dela.
3. Rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py <palavra>`. Ele mostra se o termo já foi buscado, quando, em que PC e onde ficou o resultado.
4. Os anúncios já analisados pela peneira ficam em `07-Ferramentas/referencias/memoria-mineracao.jsonl`. A `triagem_brutos.py` pula esses anúncios sozinha.

**No fim de toda mineração** (obrigatório, senão o próximo refaz):
1. Copie o `ENTREGA.md` e a planilha para `06-Referencias/mineracao/AAAA-MM-DD-<tema>/`. Nada de foto ou vídeo de terceiro: o repositório é público.
2. Ponha uma linha nesta tabela, no topo.
3. Faça commit e push. `buscas-feitas.csv` e `memoria-mineracao.jsonl` vão junto. Se o PC não tiver permissão de push, mande o `ENTREGA.md` e a planilha para o Samuel.

| Data | Tipo | Tema | O que achou | Onde está |
|---|---|---|---|---|
| 2026-11-25 | brutos (seção 2) | caminhão, vídeo vertical de loja para Reel | 3.650 anúncios coletados em 88 termos; 882 analisados pela peneira; 18 aprovados, 15 editados e aprovados (@lais.iconsorcio). O que mais rendeu: palavra genérica do nicho e página inteira de loja boa | [[Brutos de caminhao (25-11)]], `2026-11-25-brutos-caminhao/` |
| 2026-11-13 | criativos (seção 2) | consórcio de carro, caminhonete e caminhão, Meta BR ativos | 319 anúncios únicos em 15 buscas, lote de 10 para modelar | [[Criativos Meta de veiculos - leia-me (13-11)]] |
| 2026-11-13 | mercado (seção 3) | concorrentes no Marketplace, Vitória da Conquista e região | 177 anúncios abertos, 66 válidos, 29 com RISCO | [[Concorrentes no Marketplace (13-11)]], [[Concorrentes regionais VdC (13-11)]], [[Base de anuncios regionais VdC (13-11)]] |
| 2026-11-13 | mercado | o que mais vende na região (frota, emplacamento) | ranking de carros, caminhonetes, vans, caminhões e imóveis | [[Ranking de bens da regiao (13-11)]] |
| 2026-11-12 | mercado | trator e máquina pesada de alto valor (MT) | pacote montado com a coleta de 21 e 22/10 | [[Pacote trator alto ticket (12-11)]] |
| 2026-11-12 | mercado | Marketplace por região (coleta de 24/10) | 895 anúncios em 4 regiões, 75 selecionados | [[Marketplace por regiao (12-11)]] |
| 2026-11-03 | criativos | Reels de concorrentes de consórcio por nicho (Instagram) | 478 Reels únicos; lista do que replicar | [[Mineracao Instagram (03-11)]], [[O que replicar (03-11)]] |

## Temas ainda não minerados pelo cofre
- Carros elétricos, SUVs e carros acima de R$ 140 mil (concorrentes no Brasil todo): **em andamento por um parceiro em 25/11/2026**. Quando terminar, a linha entra aqui.
