---
tipo: referencia
data: 2026-11-25
---
# Brutos de caminhão: mineração de 25/11/2026

**O que foi:** vídeos reais de caminhão à venda (loja, vertical 9:16, sem texto na tela) para editar e postar como Reel. Seção 2 de [[Mineracao - o que procurar]].
**Resultado:** 15 Reels editados e aprovados pelo Samuel ("ficou excelente") para a @lais.iconsorcio. Os arquivos da entrega estão em `2026-11-25-brutos-caminhao/`: ENTREGA.md, planilha e IDs dos aprovados.

## Como foi feito
1. **Coleta sem login** com `brutos_meta.py`: Chrome sem imagem nem vídeo, lendo os dados da página, com o link em 720p.
2. **Peneira** com `triagem_brutos.py`:
   - pula loja ruim e anúncio já visto;
   - reprova rosto na capa;
   - lê os primeiros 30 s e procura texto parado na tela.
3. **Conferência no olho** do que passou: caminhão inteiro, 9:16 e versão igual à do texto.
4. **Valores** pelo `calc_valores.py --reel`. Sem preço no anúncio: FIPE ou valor médio (decisão de 25/11).
5. **Edição** com `editar_reel.py`. Placa e nome de loja tampados com `tampa_plaquetas.py`.

## Números
- Primeiro teste:
  - Meta: 15 buscas, 369 anúncios de vídeo, 26 baixados, 2 aprovados.
  - YouTube: 8 buscas, 9 baixados, 3 aprovados. Depois os 3 foram reprovados por serem horizontais.
- Rodada dos 20:
  - 3.650 anúncios únicos coletados em 88 termos ou páginas;
  - 882 passaram pela peneira, agora na memória compartilhada;
  - 18 aprovados.
- Origem dos 13 primeiros aprovados:

  | Origem | Aprovados |
  |---|---|
  | palavra genérica do nicho | 5 |
  | página inteira de loja boa | 3 (o que mais rendeu por anúncio) |
  | termo de unidade única | 3 |
  | busca funda em anúncios antigos | 1 |
  | nome da loja | 1 |

## Termos já usados (não repetir sem motivo)
A lista completa, com quantos anúncios cada termo trouxe, está em `07-Ferramentas/referencias/buscas-feitas.csv`. Para ver, rode `py -3 07-Ferramentas/scripts/mineracao/registro_buscas.py caminh`.

Os que mais trouxeram: cavalo mecânico, caminhão toco, caminhão truck, caminhão à venda, caminhão seminovo, caminhão basculante, ford cargo, constellation, scania, caminhão 3/4, caminhão munck, volvo fh, actros, caminhão baú, atego, accelo.

## O que aprendemos
O detalhe está em [[Minerador]], na seção Aprendizados.
- O que mais reprova: apresentador; legenda, preço ou logo por cima; letreiro de loja; vídeo que não é 9:16.
- Com mais de 6 downloads ao mesmo tempo, a Meta recusa conexão por cerca de 20 minutos.
- O bloqueio de busca veio depois de cerca de 130 buscas em 1 hora, com 4 coletas em paralelo. O padrão é uma coleta por vez.
