---
tipo: padrao
atualizado: 2026-11-19
---
# Reel do Instagram (oferta de veículo)

> **Regra absoluta desde 24/11/2026:** [[Padrao minimo de edicao]] (padrão dos perfis @pedroabreu.consultor e @tanan_intermediacoes). Se esta nota discordar dela, ela vence.

Modelo atual: lote-v3 e v5 (13 e 14/11/2026), copiado dos 5 exemplos que o gestor mandou em 13/11 às 22h08. Notas de origem: [[Nota do modelo lote-v3]], [[Modelo exemplos do Samuel]], [[Regra tela cheia 9x16]].

## Formato técnico
- 9:16, **1080x1920, tela cheia**. Proibido: meia tela, fundo desfocado, faixas pretas (regra oficial desde 01/11).
- H.264 High, yuv420p, 30 fps constante, áudio AAC 48 kHz, cerca de **−14 LUFS** (`07-Ferramentas/scripts/edicao/loudnorm-2pass.sh`).
- **12 a 15 s.** Cerca de 5 cortes secos de 2 a 5 s, sem transição, sem acelerar nem esticar. Ampliação de no máximo 2x; se não preenche a tela, descarta o trecho.

## Imagem
- Filmagem **real**, feita na mão, de **uma unidade só** por peça: exterior, roda, interior, painel. Nada de IA, foto oficial ou estúdio.
- Nenhum quadro com pessoa, letreiro ou nome de loja. Placa: tarja preta só do tamanho da placa, acompanhando a placa no vídeo (`tarja_boxes.py`).

## Texto na tela
- **Só entrada e parcelas** (13/11, 22h12): 2 pílulas brancas com texto preto, "Entrada de R$ X" e "Parcelas de R$ Y", fixas desde o início, no terço de cima, com colchete vermelho ou amarelo. Variação: pílula da parcela vermelha; alinhamento à esquerda ou ao centro.
- Nome do modelo pequeno, embaixo das pílulas.
- **Sem** crédito, número de meses, porcentagem ou lance na tela.
- Rodapé: **"CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP"**, branco, condensado, caixa alta, com sombra, a cerca de 85% da altura, entrando com um pop em 1 s.
- Selo: sem logo. Só o @ da conta, discreto, no canto de cima à direita. **Cada conta com o seu @** (a @pedroabreu.consultor nunca leva o selo da Tanan, 19/11 11h16).
- Nunca na tela: aviso legal, "imagem/vídeo ilustrativo", MOVECON.

## Valores
- Entrada ≈ 18% do bem, arredondada à centena. Parcela ≈ 0,9% do bem, arredondada ao real. Use `calc_valores.py <valor> --reel`. Ver [[Calculo de entrada e parcela]].
- Exceção aprovada pelo gestor vale só para aquela peça e fica em [[Decisoes]].

## Áudio
- Vídeo com **voz** (narração de vendedor): troca o áudio por **uma** música contínua, sem emendas nos cortes (14/11, 14h11 e 16h56).
- Vídeo só com música ou som ambiente: mantém o original.
- Música sem letra com palavrão. Para anúncio pago, só música da biblioteca comercial.
- Só as versões revisadas (sufixo `v5b` ou posteriores) vão ao ar (19/11, 07h40).

## Legenda
```
🛻 Ford Ranger XLS com entrada de R$ 48.100!

💰 Entrada: R$ 48.100
📆 Parcelas de R$ 2.403

📲 Clique no link da bio e fale direto no nosso WhatsApp, ou chama no direct que a gente te passa todos os detalhes!

#fordrangerxls #picape #caminhonete #carrosavenda #financiamento #tananintermediacoes
```
- Emoji do tipo (🚗 carro, 🛻 picape, 🚚 caminhão) + "Modelo com entrada de R$ X!", depois 💰 Entrada, 📆 Parcelas, o CTA e as hashtags (modelo, categoria, #carrosavenda, #financiamento e a hashtag da conta).
- Os valores da legenda são **os mesmos da tela**. Confira antes de postar.
- Na @pedroabreu.consultor: mesma estrutura, **sem #tananintermediacoes** (19/11, 10h44).
- "Vídeo ilustrativo" na legenda quando o vídeo é de terceiro (regra de 21/10). Ver o conflito em [[Pendencias]].

## Vídeo de venda própria (bem real à venda)
Formato diferente (Classic 2016, Strada 2011, 18–19/11): sem valores e sem rodapé, com música. A placa pode ficar visível só se o operador pedir.

## Antes de entregar
1. `check_oferta.sh` (quadros em 0,5 / 3 / 7,5 / 14,8 s, volume e md5) e `checar-midia.py <arquivo> instagram reel`.
2. Assistir ao resultado e conferir corte, valores, legenda e áudio.
3. Gravar o md5 de cada arquivo na lista de aprovação ([[Aprovacao e registro]]).
