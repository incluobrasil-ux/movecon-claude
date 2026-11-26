# Entrega: 4 tratores de R$ 500 mil a R$ 1 milhão, 26/11/2026

4 vídeos brutos, em pé, **já cortados no trecho limpo** (14,5 s cada), sem edição. Valor = o do anúncio no Instagram:

| # | Trator | Valor | Anunciante | Post |
|---|---|---|---|---|
| 01 | New Holland T7.260 2023, 234 cv, 1.711 h | R$ 580.000 | Zanquetta Agromáquinas | https://www.instagram.com/p/DWoVbHgmSE5/ |
| 02 | John Deere 7230J 2020, 230 cv, 2.881 h | R$ 680.000 | Classificados Agrícola | https://www.instagram.com/p/DUqYHeIDVLI/ |
| 03 | John Deere 7230J, 230 cv (576x1024, ampliado para 720x1280) | R$ 680.000 | AGRONEXUS | https://www.instagram.com/p/DdY4ovBRaEm/ |
| 04 | John Deere 7230J 2018, 230 cv, 5.500 h | R$ 500.000 | Zanquetta Agromáquinas | https://www.instagram.com/p/DPfLrJziSs0/ |

Se aparecer placa ou plaqueta de loja, tampe na edição.

Trancado com senha (AES-256). A senha **não fica no GitHub**: ela vem no prompt do Samuel.
```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in <arquivo>.mp4.enc -out <arquivo>.mp4 -pass pass:<senha>
```
Confira pelo `md5.txt`.

**Entrada e parcela de trator ainda estão pendentes com o Samuel.** Nada vai ao ar sem o OK dele.

**Para achar mais:** leia `06-Referencias/mineracao/2026-11-26-brutos-tratores/ENTREGA.md`. Na Biblioteca da Meta quase não há vídeo limpo de trator grande. O que funcionou foi a hashtag do Instagram (#johndeere7230j, #tratorseminovo, #tratoravenda, #tratoresusados) + leitura pública do post com yt-dlp + peneira.
