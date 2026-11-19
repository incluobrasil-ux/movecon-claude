# REGRA OFICIAL E PERMANENTE: vídeo do bem em tela cheia 9:16

Fonte: Samuel, 01/11/2026 às 15h34 e 15h40, via CEO, com print do Kwid no IG.

## A regra
- Toda oferta (IG, TikTok, Reels, Stories) sai em vertical 9:16, 1080x1920.
- O vídeo do bem preenche a tela inteira, do primeiro ao último quadro.
- O texto (crédito, entrada, parcelas, gancho, CTA) vai por cima do vídeo. Para ficar legível, use contorno e sombra, ou uma faixa semitransparente atrás do texto.
- PROIBIDO: meia tela de vídeo com a outra metade de texto, faixa de vídeo sobre fundo borrado (boxblur/gblur do próprio vídeo), painel de valores fora do vídeo e letterbox.
- Para fonte 16:9: recorte central 9:16 e scale comum (lanczos ou bicubic). Isso NÃO é upscale proibido. Proibido é só ampliar com IA ou interpolar quadros. Se o recorte central cortar o bem, mova o crop ou troque de tomada.
- Depois do recorte, confira de novo placa, logo, pessoa e texto de terceiros.
- Os valores ficam longe das zonas de botão e legenda do app (topo a partir de ~250 px).

## Escopo
- Vale para tudo que ainda vai sair e para todo o material de 02/11 em diante (cronogramas de 02 a 07/11).
- NÃO refazer o que já foi publicado (Samuel, 15h40).

## Por que desviou (01/11)
Os scripts de render tratavam a regra "sem upscale" como se também proibisse o scale comum. Por isso encaixavam o 16:9 pela largura, numa faixa (ex.: 1080x620 em y=1300) sobre o próprio vídeo borrado, com os valores num drawbox fora do vídeo (r1.sh do trator, r_rrs5.sh, r_xc60.sh).

## Como checar antes de entregar
Extraia frames em 0,5 s, 3 s, 7,5 s e 14,8 s. Em todos, o vídeo tem que ocupar 1080x1920 inteiro, sem área borrada nem faixa de fundo.
