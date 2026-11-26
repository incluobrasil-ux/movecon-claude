# Entrega: 10 vídeos brutos de carro (R$ 100 mil a R$ 300 mil), 25/11/2026

São 10 vídeos de loja, em pé (9:16, 720x1280), **já cortados no trecho limpo** (11,5 a 15 s cada), sem edição. Eles ainda têm a placa ou a plaqueta da loja, que precisa ser tampada na edição.

Os vídeos estão trancados com senha (AES-256). A senha **não fica no GitHub**: ela vem no prompt que o Samuel manda.

Para abrir, use o openssl do Git for Windows:
```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in <arquivo>.mp4.enc -out <arquivo>.mp4 -pass pass:<senha>
```
Depois de abrir, confira cada vídeo pelo `md5.txt`.

**Valores:** estão em `planilha-brutos-carros-2026-11-25.csv`, nas colunas `valor_anuncio`, `entrada_reel` e `parcela_reel`. Saem do preço do anúncio, pelo `calc_valores.py --reel`. A coluna `trecho_usado` mostra onde o corte foi feito no vídeo original; aqui o vídeo já vem cortado.

**Como usar:** edite com o `04-Modelos/Prompt de edicao.md`. Nada vai ao ar sem o OK do Samuel.
