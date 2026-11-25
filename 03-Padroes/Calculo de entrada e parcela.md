---
tipo: padrao
atualizado: 2026-11-19
---
# Cálculo de entrada e parcela

**Nunca calcule de cabeça.** Use a calculadora:
```
py -3 07-Ferramentas/scripts/calc_valores.py <valor do bem>          (Marketplace)
py -3 07-Ferramentas/scripts/calc_valores.py <valor do bem> --reel   (vídeos)
```
Grave o resultado no `calculo.md` da pasta do bem.

## Marketplace (regra em vigor desde 12–13/11/2026)
1. **Valor do bem** = preço do anúncio real de onde vieram as fotos (link na `fonte.txt`). Nunca inventar nem arredondar.
2. **Entrada** = 20% do valor, arredondada para cima, sem centavos. Ex.: R$ 66.900 → ENTRADA DE R$ 13.380.
3. **Parcela** = coluna "9ª a 150ª" da tabela **4076** (MOVECON 7 Pesados, 150 meses, grupo U2011), na **menor linha cujo crédito seja pelo menos o dobro do valor do bem**. Se nenhuma linha chega ao dobro, usa a última (linha 26, R$ 3.890,84).
4. **Campo de preço do classificado = a entrada.**
5. No texto: "Entrada de R$ X" e "Parcelas de R$ Y", **sem o número de parcelas** e sem somar lance.

Conferência (valores reais das levas de 19/11):
| Bem | Valor | Entrada | Parcela | Linha |
|---|---|---|---|---|
| Cronos 2023 | R$ 66.900 | R$ 13.380 | R$ 1.459,06 | 1 |
| Tracker 2022 | R$ 92.900 | R$ 18.580 | R$ 1.653,61 | 3 |
| Hilux 2020 | R$ 168.000 | R$ 33.600 | R$ 3.015,40 | 17 |
| FH 460 2012 | R$ 285.000 | R$ 57.000 | R$ 3.890,84 | 26 (teto) |

Todo bem até cerca de R$ 81.971 cai na linha 1 (R$ 1.459,06).

Origem: "MOVECON 7 com carta = 2x o valor do bem" (12/11, 22h41); entrada de 20% (13/11, 11h43). Tabela em `07-Ferramentas/tabelas/tabela4076.json`; transcrição de todas as tabelas da Alpha em `07-Ferramentas/tabelas/resumo-tabelas-alpha-2026-10-22.md`. As tabelas valem independente do "válida até" impresso (24/10). Não usar as tabelas 4051, 4052, 4168 e 4169 (22/10, 03h52).

## Vídeos e Reels (regra em vigor desde 14/11/2026, 08h40)
- **Bruto sem preço no anúncio (25/11/2026):** identifique o modelo, estime o ano pelo vídeo e use a **média de mercado (FIPE)** desse modelo e ano. Não precisa ser o preço exato. Marque "valor médio estimado" na planilha.
- **Entrada ≈ 18% do valor do bem. Parcela ≈ 0,9% do valor do bem.** Sem tabela e sem número de meses.
- Exceções aprovadas uma a uma ficam em [[Decisoes]] (ex.: 14/11 09h13: Hilux 35 mil, SW4 40 mil, Ducato 20 mil, Daily 35 mil de entrada).
- Regras antigas substituídas: "1ª + 50% lance" (12/11), "20% do bem" (13/11 06h51), "parcela 30% abaixo da tabela" (13/11 15h01).

## Planos de alto ticket (funil BMW e máquinas; status "a confirmar com a Alpha")
| Crédito | 1ª parcela | Demais | Lance do bolso | Lance livre |
|---|---|---|---|---|
| R$ 306 mil | R$ 16.620,70 | 120x R$ 3.478,40 ou 60x R$ 6.956,80 | — | R$ 120.225,34 |
| R$ 696 mil | R$ 37.812,18 | 79x R$ 7.704,86 | R$ 248.647,85 | R$ 273.512,64 |
| R$ 902 mil | R$ 49.031,20 | 79x R$ 9.990,72 | R$ 322.422,49 | R$ 354.664,74 |
Todos com 30% de lance embutido. Os planos de 696 e 902 não aparecem em nenhum PDF da Alpha transcrito: confirmar antes de usar.
