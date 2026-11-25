# Entrega: 15 Reels de caminhão (@lais.iconsorcio), 25/11/2026

Os vídeos estão trancados com senha (AES-256). A senha **não fica no GitHub**: ela vem no prompt que o Samuel manda para o representante.

Para abrir, use o openssl do Git for Windows:
```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in <arquivo>.mp4.enc -out <arquivo>.mp4 -pass pass:<senha>
```
Depois de abrir, confira cada vídeo pelo `md5.txt`.
