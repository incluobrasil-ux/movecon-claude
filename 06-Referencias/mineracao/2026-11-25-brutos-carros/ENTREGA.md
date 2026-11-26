# Mineração de vídeos brutos: carros (picape, SUV e sedã) de R$ 100 mil a R$ 300 mil (25/11/2026)

**Pedido do Samuel (25/11/2026):** "quero que você faça uma mineração de carros de forma geral na media de 100.000 até 300.000 pode ser carro aberto picape suv a ideia é que esteja dentro dessa base de valor quero 10 videos".

**Fontes:**
- Biblioteca de Anúncios da Meta, sem login, com `brutos_meta.py`: 34 buscas em 3 rodadas, uma por vez, com 8 s entre elas;
- peneira com `triagem_brutos.py`;
- conferência no olho, quadro a quadro, de meio em meio segundo nas bordas de cada trecho.

**Bloqueios:** nenhum. Só o termo "l200 triton seminova" veio vazio, por falta de anúncio, e não por bloqueio: a busca seguinte trouxe resultado.

**Resultado em uma linha:**
- 1.047 anúncios de vídeo coletados;
- 194 passaram pelo filtro de texto (um preço entre R$ 100 mil e R$ 300 mil, modelo de carro, anúncio de venda) e foram analisados pela peneira;
- 41 passaram na peneira (10 deles são o mesmo vídeo do Pulse em vários anúncios);
- **10 aprovados no olho**, mais 1 de reserva.

## Aprovados (pasta `aprovados/`, 720x1280, 9:16)

| # | Arquivo | Veículo | Valor do anúncio | Entrada (Reel) | Parcela (Reel) | Trecho usado | Loja | Tampar |
|---|---|---|---|---|---|---|---|---|
| 01 | `01-picape-nissan-frontier-s-2021.mp4` | Nissan Frontier S 2.3 Turbo Diesel CD 4x4 2021 | R$ 115.000 | R$ 20.700 | R$ 1.035 | 10,5 a 22,6 s | Wcar Veículos BH | plaqueta azul da loja |
| 02 | `02-suv-toyota-corolla-cross-xre-2022.mp4` | Toyota Corolla Cross XRE 2022 | R$ 129.990 | R$ 23.400 | R$ 1.170 | 4,5 a 19,5 s | Rio Doce Veículos | plaqueta RIO DOCE (frente e trás) |
| 03 | `03-suv-vw-t-cross-highline-2020.mp4` | VW T-Cross Highline 2020 | R$ 107.900 | R$ 19.400 | R$ 971 | 0 a 11,5 s | Ohcarro | plaqueta da loja (frente) |
| 04 | `04-suv-vw-taos-highline-2022.mp4` | VW Taos Highline 1.4 TSI 2022 | R$ 119.900 | R$ 21.600 | R$ 1.079 | 13,5 a 28,0 s (interior de 16 a 27 s) | Wcar Veículos BH | plaqueta azul da loja |
| 05 | `05-suv-jeep-commander-limited-td380-2023.mp4` | Jeep Commander Limited TD380 Diesel 2023 | R$ 154.900 | R$ 27.900 | R$ 1.394 | 15,0 a 29,0 s | Wcar Veículos BH | plaqueta azul da loja |
| 06 | `06-suv-fiat-fastback-audace-hybrid-2026.mp4` | Fiat Fastback Audace Hybrid 2026 | R$ 112.900 | R$ 20.300 | R$ 1.016 | 11,0 a 23,8 s | Wcar Veículos BH | plaqueta azul da loja |
| 07 | `07-picape-mitsubishi-l200-triton-hpe-s-2024.mp4` | Mitsubishi L200 Triton Sport HPE-S 2024 | R$ 199.900 | R$ 36.000 | R$ 1.799 | 10,5 a 22,8 s | Wcar Veículos BH | plaqueta azul da loja |
| 08 | `08-suv-nissan-kicks-sense-2025.mp4` | Nissan Kicks Sense 1.6 2025 | R$ 109.900 | R$ 19.800 | R$ 989 | 6,5 a 21,0 s | Wcar Veículos BH | plaqueta azul da loja |
| 09 | `09-picape-mitsubishi-triton-hpe-s-2025.mp4` | Mitsubishi Triton Sport HPE-S Diesel 4x4 2025 | R$ 219.900 | R$ 39.600 | R$ 1.979 | 14,5 a 29,5 s | GrandPrix Automóveis | plaqueta amarela da loja |
| 10 | `10-picape-chevrolet-s10-high-country-2026.mp4` | Chevrolet S10 High Country 2.8 Diesel 4x4 2026 | R$ 257.900 | R$ 46.400 | R$ 2.321 | 0 a 15,0 s | Paulinho cinegaglia antigos | placa (frente e trás) |

- **Mix:** 6 SUVs e 4 picapes, de R$ 107.900 a R$ 257.900.
- **Valores:** todos vêm do preço escrito no anúncio. Entrada e parcela foram calculadas pelo `calc_valores.py --reel` (18% e 0,9%).
- **Trecho usado:** é o pedaço sem texto, sem pessoa e sem letreiro, conferido de meio em meio segundo. O vídeo baixado é inteiro; o corte é na edição.
- **Áudio:** todos têm som. Ouça na edição: se tiver voz, troque por música ([[Musicas liberadas]]).
- **07 e 09** são o mesmo modelo (Triton HPE-S), de anos, cores e lojas diferentes. Se preferir variedade, troque um deles pela reserva.
- **Padrão da Wcar BH** (6 dos 10): título e preço por cima nos primeiros 10 a 15 s, depois uma volta limpa em volta do carro no pátio da laje. Por isso todos os trechos começam depois do título.

## Reserva (`reserva/`)
- **R1:** Toyota Corolla XEi 2025/2026, Rio Doce Veículos, R$ 154.990 (entrada R$ 27.900, parcela R$ 1.395). O logo "RIO DOCE" na parede do galpão aparece no alto das tomadas de frente (0 a ~12 s). Para usar, é preciso tampar o logo ou cortar o alto do quadro.

## Reprovados no olho, e por quê
- Texto ou legenda por cima no trecho todo: S10 LTZ 2024 (Edi), Corolla Cross 2023 (ShoppingCar), Tiggo 8 Pro (Movva), Renegade Trailhawk e BMW 330e (Wcar), Pulse Hybrid (Reche).
- Trecho limpo curto demais (menos de 11 s): Toyota RAV4 2018, Outlander Sport 2022, L200 2023 e Hilux SR 2024 (Wcar), Kicks Platinum 2026.
- Letreiro ou logo grande de loja: Saveiro Extreme (Déio), BMW 330e e Kicks (Wcar Select, parede da loja), Tiggo 7 Pro (RCCAR), Creta (New Motors), HR-V Touring (GrandPrix, fachada).
- Vendedor aparecendo ou mão em primeiro plano: Toro Ranch e Toro Volcano, Tiggo 5X (JF Veículos).
- Início sem o veículo inteiro e letreiro no começo: S10 LTZ 2017 (Igor Esteves).

## Termos e páginas usados
- 1ª rodada: suv seminovo, picape seminova, carro seminovo único dono, hilux seminova, compass seminovo, ranger seminova, s10 seminova, sw4 seminova, corolla cross seminovo, toro seminova, carro km original valor, seminovos multimarcas.
- 2ª rodada: páginas inteiras da Rio Doce, Wcar BH e Ohcarro; amarok, l200 triton, commander, tiggo 7, creta, hr-v, tracker, frontier e taos seminovo(a).
- 3ª rodada: páginas inteiras da Igor Esteves, Reche, BariRam, Gambatto e JF Veículos; caminhonete seminova, picape à venda, suv à venda, hilux à venda, seminovo abaixo da fipe.
- **O que mais rendeu:** a página inteira da Wcar Veículos BH (6 dos 10), igual ao caminhão, em que a página inteira de loja boa foi a que mais rendeu por anúncio. A loja entrou na lista de lojas boas (`07-Ferramentas/referencias/lojas-brutos.json`).

## Arquivos
- `aprovados/` (10 vídeos + `md5.txt`), `reserva/`;
- `planilha-brutos-carros-2026-11-25.csv`, `prancha-brutos-carros-2026-11-25.jpg`, `aprovados.txt`;
- `meta.json`, `meta-2.json`, `meta-3.json` (coleta), `triagem.json` (peneira), `folhas/` (quadros da conferência).

## Próximo passo
Editar com o [[Prompt de edicao]] para a conta que você escolher. Nada vai ao ar sem o seu OK.
