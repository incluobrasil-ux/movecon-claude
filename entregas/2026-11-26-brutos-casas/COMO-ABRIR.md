# Entrega: 11 vídeos brutos de casa (tour), 26/11/2026

Decisão do Samuel (26/11/2026): "eu quero foco nas casas, os apartamentos foram reprovados e as casas aprovadas" + "quero que você acha mais 5 casas para complementarmos pra ela" (casas 11 a 15).

São 11 tours de casa (8 casas e 3 sobrados; 3 deles com piscina), em pé (9:16, 720x1280), **já cortados no trecho limpo** (33 a 45 s cada), sem edição. Não têm corretor, legenda nem marca d'água.

Os vídeos estão trancados com senha (AES-256). A senha **não fica no GitHub**: ela vem no prompt que o Samuel manda.

Para abrir, use o openssl do Git for Windows:
```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in <arquivo>.mp4.enc -out <arquivo>.mp4 -pass pass:<senha>
```
Depois de abrir, confira cada vídeo pelo `md5.txt`.

**Valores:** o valor de cada casa está em `planilha-casas-2026-11-26.csv` (`valor_anuncio`). **Entrada e parcela de imóvel ainda estão pendentes com o Samuel**: nenhum vídeo sai com valor na tela até ele decidir a regra.

**Formato da edição:** Parte B do `03-Padroes/Padrao minimo de edicao.md` (tour de 25 a 45 s com título emocional no topo) + o mínimo da Parte A (pílulas, @ e rodapé). Edição com o `04-Modelos/Prompt de edicao.md`. Nada vai ao ar sem o OK do Samuel.
