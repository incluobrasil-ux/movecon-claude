# Rubrica de nota de escala (0–10)

Some os pontos de cada bloco. Teto em 10. Arredonde para inteiro.

## Volume (até 3 pts)
- Anúncios ativos na oferta/página: 5–9 = 1 · 10–29 = 2 · 30+ = 3
- "X anúncios usam este criativo e texto" ≥ 10 em pelo menos um criativo = +1 (limite do bloco continua 3)

## Momento (até 2 pts)
- 5+ anúncios novos nos últimos 7 dias = 1
- 15+ anúncios novos nos últimos 7 dias = 2

## Longevidade (até 2 pts)
- Algum criativo ativo há 30+ dias = 1
- Algum criativo ativo há 90+ dias = 2

## Validação de mercado (até 2 pts)
- Mesma oferta/produto em 2+ anunciantes diferentes = 1
- Em 2+ países/idiomas = 1

## Teste ativo (até 1 pt)
- 3+ variações do mesmo ângulo (muda hook/abertura, mantém corpo) = 1

## Penalidades
- Página criada há menos de 30 dias sem outro histórico: −1
- Todos os anúncios lançados no mesmo dia e nada mais: −1
- Sinal de risco de política (saúde, renda fácil, antes/depois exagerado): −2 e marcar ⚠️

## Leitura da nota
- 9–10: escalada pesada, prioridade máxima
- 7–8: escalando, vale modelar
- 5–6: em teste, monitorar (revisitar em 7 dias)
- 0–4: descartar

## Com dados do AdWhispr
- `longevity` alto + `estimated_revenue` alto no mesmo anúncio = sinal mais forte que qualquer contagem isolada.
- `performance_score` serve de desempate, não de critério único.
- Sem contagem de duplicatas no retorno, use nº de anúncios ativos com mesmo hook/landing como proxy.
