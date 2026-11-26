# Entrega: 8 máquinas agrícolas de R$ 500 mil a R$ 1 milhão, 26/11/2026

São 8 vídeos brutos, em pé, **já cortados no trecho limpo** (14,5 s cada), sem som e sem edição. Mais 2 de reserva.
Nesta pasta não há trator repetido da entrega de tratores (`2026-11-26-brutos-tratores`).

| # | Máquina | Valor | De onde vem o valor | Anunciante | Post |
|---|---|---|---|---|---|
| 01 | **Colheitadeira** Case Axial-Flow 5150 2023, 961 h de trilha, plataforma 30 pés | R$ 990.000 | anúncio | Classificados Agrícola (PR) | https://www.instagram.com/p/DeAfnkjv0Pl/ |
| 02 | **Colheitadeira** Case Axial-Flow 4150 **colhendo milho** (720x1280) | R$ 690 a 850 mil | **valor médio estimado**: 4 anúncios do 4150 de 2021-2022 no MF Rural, 26/11 | Tracan Máquinas (MG) | https://www.instagram.com/p/DJ7ZDPfpXVg/ |
| 03 | **Pulverizador** Jacto Uniport 3030 **aplicando** no milho ao pôr do sol | R$ 700.000 | **valor médio estimado**: Uniport 3030 2019 no MF Rural, 26/11 | Estevão (perfil pessoal) | https://www.instagram.com/p/Del5D2np9hj/ |
| 04 | Trator John Deere 7215J 2021, 215 cv, 1.464 h, GPS | R$ 590.000 | anúncio | Classificados Agrícola (PR) | https://www.instagram.com/p/Dfk0oBIgaRe/ |
| 05 | Trator John Deere 6190M 2021, 190 cv, 1.164 h, GPS | R$ 545.000 | anúncio | Classificados Agrícola (PR) | https://www.instagram.com/p/DfnWH4nPMBP/ |
| 06 | Trator John Deere 7230J 2022, 230 cv, 1.464 h, GPS | R$ 620.000 | **valor médio estimado**: 7230J 2022 no MF Rural, 26/11 | Classificados Agrícola (PR) | https://www.instagram.com/p/DeCT9AHRsO-/ |
| 07 | Trator New Holland T8 325 2023 | sem dado exato: entre R$ 635 mil (T8 325 2017) e R$ 945 mil (T8 385 2023) | MF Rural, 26/11. **Confirmar o valor com o Samuel antes de postar** | Classificados Agrícola (PR) | https://www.instagram.com/p/Dfa9gmVt5xJ/ |
| 08 | Trator New Holland T7.260 **plantando** (puxando plantadeira, 720x1280) | R$ 580.000 (só o trator) | **valor médio estimado**: T7.260 2023 no MF Rural, 26/11 | M.A Agronegócios | https://www.instagram.com/p/DF5zjQVy8Xg/ |

**Reserva** (use só se faltar vídeo):
- R1: colheitadeira Case Axial-Flow colhendo milho. O post não diz o modelo, então o valor é sem dado. https://www.instagram.com/p/DbTWdwDx7hf/
- R2: Uniport 3030 só em detalhes (escada, rodas, barra), sem a máquina inteira. Valor estimado: R$ 700 mil. https://www.instagram.com/p/Da7pVNZu_S_/

## Antes de postar
- **Valor estimado é marcado assim na planilha.** Na legenda vai o valor do bem, nunca "preço desta máquina".
- **Entrada e parcela de máquina agrícola ainda estão pendentes com o Samuel.** Nada vai ao ar sem o OK escrito dele.
- A parcela do consórcio é **mensal**. Não escreva "parcela na safra", "semestral" ou "anual".
- Se aparecer placa, adesivo ou plaqueta de loja, tampe na edição.
- O que postar em cada época e os ganchos de cada máquina: `06-Referencias/mineracao/2026-11-26-agro-alto-ticket/CATALOGO-o-que-postar.md`.

## Como abrir
Os vídeos estão trancados com senha (AES-256). A senha **não fica no GitHub**: ela vem no prompt do Samuel.
```
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -in <arquivo>.mp4.enc -out <arquivo>.mp4 -pass pass:<senha>
```
Confira pelo `md5.txt`.
