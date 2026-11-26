# Mineração de vídeos brutos: imóveis (casa e apartamento) de R$ 150 mil a R$ 1 milhão (25 e 26/11/2026)

**Pedido do Samuel (25/11/2026):** "quero fazer uma mineração agora de imóveis para fazermos um banco de dados de 10 posts tb".

**Formato buscado:** o modelo da @representacaomaranata, da Parte B do [[Padrao minimo de edicao]]: tour andando pelo imóvel, de 25 a 45 s, de preferência começando por fora.

**Fontes:**
- Biblioteca de Anúncios da Meta, sem login, com `brutos_meta.py`: 24 buscas em 2 rodadas, uma por vez, com 8 s entre elas;
- peneira com `triagem_brutos.py`;
- conferência no olho do vídeo inteiro, de 3 em 3 s, e de meio em meio segundo no começo de cada trecho.

**Bloqueios:** nenhum.

**Faixa:** de R$ 150 mil a R$ 1 milhão. Você não definiu a faixa; é onde ficam as cartas de imóvel mais comuns. Se quiser outra, a busca é refeita só na peneira, sem buscar de novo.

**Resultado em uma linha:**
- 855 anúncios de vídeo coletados;
- 198 passaram pelo filtro de texto (um preço na faixa, casa ou apartamento, anúncio de venda);
- 52 passaram na peneira;
- **10 aprovados no olho**, mais 2 de reserva em baixa resolução.

> **Decisão do Samuel (26/11/2026):** "eu quero foco nas casas, os apartamentos foram reprovados e as casas aprovadas". Valem as 6 casas (01, 02, 03, 04, 05 e 08). Os apartamentos 06, 07, 09 e 10 foram reprovados.

## Aprovados (pasta `aprovados/`, 720x1280, 9:16; trechos já cortados em `previa-trechos/`)

| # | Arquivo | Imóvel | Valor do anúncio | Trecho | Duração | Anunciante |
|---|---|---|---|---|---|---|
| 01 | `01-casa-muriae-mg-350mil.mp4` | Casa térrea nova, Nova Barra, Muriaé/MG | R$ 350.000 | 0 a 38,5 s | 38,5 s | Rafael Rodrigues Corretor |
| 02 | `02-casa-londrina-pr-399mil.mp4` | Casa nova, Zona Norte de Londrina/PR | R$ 399.900 | 6 a 48 s | 42 s | LondrinaCred |
| 03 | `03-casa-cuia-geisel-450mil.mp4` | Casa térrea com quintal, Cuiá/Geisel | R$ 450.000 | 5 a 50 s | 45 s | Imobiliária das Novidades |
| 04 | `04-casa-condominio-cambe-pr-550mil.mp4` | Casa em condomínio, Cambé/PR | R$ 550.000 | 8 a 50 s | 42 s | LondrinaCred |
| 05 | `05-casa-londrina-pr-450mil.mp4` | Casa nova, Colúmbia, Londrina/PR | R$ 450.000 | 6 a 48 s | 42 s | LondrinaCred |
| 06 | `06-apto-tijuca-rj-680mil.mp4` | Apartamento 2 quartos com vista, Tijuca/RJ | R$ 680.000 | 0 a 43 s | 43 s | Nova Época Imóveis |
| 07 | `07-apto-mobiliado-rj-690mil.mp4` | Apartamento 2 quartos mobiliado com suíte, Tijuca/RJ | R$ 690.000 | 0 a 45 s | 45 s | Nova Época Imóveis |
| 08 | `08-casa-quintal-piovesan-750mil.mp4` | Casa com quintal grande (cód. 2891) | R$ 750.000 | 9,5 a 43 s | 33,5 s | Imobiliária Piovesan |
| 09 | `09-apto-alto-padrao-piracicaba-950mil.mp4` | Apartamento alto padrão, Ed. Bella Itália, Piracicaba/SP | R$ 950.000 | 3,5 a 38 s | 34,5 s | Imobiliária São Judas Tadeu |
| 10 | `10-apto-tijuca-rj-869mil.mp4` | Apartamento 3 quartos com suíte e piscina, Tijuca/RJ | R$ 869.000 | 13 a 58 s | 45 s | Nova Época Imóveis |

- **Mix:** 6 casas e 4 apartamentos, de R$ 350 mil a R$ 950 mil.
- **Entrada e parcela: PENDENTE.** A regra de valores para imóvel ainda está aberta em [[Pendencias]] ("Até decidir, esses nichos não saem com valor"). O valor do anúncio está anotado; falta você decidir entre 18%/0,9% (como veículo) e o plano da tabela.
- **Imóvel sem pessoa, sem legenda e sem marca d'água** em todo o trecho. Isso foi o que mais reprovou: a maioria dos vídeos de imóvel tem corretor apresentando, legenda da fala ou logo da imobiliária por cima.
- **Para conferir na edição:**
  - 07 é mobiliado, com objetos do dono (brinquedos, quadros); confira se aparece foto de família;
  - 08 tem a sombra de quem filma no chão e um reflexo de sol;
  - 06 começa na rua, na saída do metrô;
  - todos têm som: ouça na edição e troque por música se tiver voz.
- **03:** o anúncio diz "Cuiá / Geisel", sem a cidade. Não anotei cidade para não inventar.

## Reserva (`reserva/`, só em 360x640, baixa resolução)
- **R3:** casa moderna, Parque Bellaville, Hortolândia/SP, R$ 600.000 (Juninho Valle, há 216 dias no ar: o anúncio mais antigo da lista). Tour limpo de 2 a 33 s.
- **R4:** sobrado com área gourmet, Vila Granada, R$ 995.000 (Ponto Chave Imóveis). Tour limpo, começa na área gourmet.

## Reprovados no olho, e por quê
- **Corretor ou corretora apresentando:** Mira Curitiba, Braga, DB Imóveis, Imóvel Fácil, Juca, Higor, Leal, palarohome, Avallon, Vilela, André Nazareth e Italo (mesma casa).
- **Legenda da fala ou texto por cima:** Isaías, Redeplan, Kaza, Conecta, Logos, Cleber Paschoal, Unefive, Value, Empreendimentos (Ocian).
- **Marca d'água da imobiliária:** AE Patrimônio, Atual J-33, Vita & Carvalho, Paulo Rogério.
- **Mão apontando na frente da câmera:** Quintal Verde, Max Imóveis.
- **Arte parada, não é vídeo de tour:** Apolar (2).
- **Fora do pedido:** aluguel (Rodrigo Cesario) e sala comercial (Piovesan).
- **Tour curto demais (menos de 25 s):** Cleyton Peres.

## Termos e páginas usados
- 1ª rodada: casa à venda, sobrado à venda, apartamento à venda, casa térrea à venda, casa em condomínio à venda, casa com piscina à venda, casa 3 quartos à venda, casa nova à venda, apartamento 2 quartos à venda, imobiliária casa à venda, casa pronta para morar, tour casa à venda.
- 2ª rodada: páginas inteiras da Ponto Chave, Juninho Valle, Nova Época e Piovesan; casa à venda 2 quartos, casa geminada à venda, sobrado novo à venda, casa à venda com quintal, casa à venda financiamento, casa à venda aceita financiamento, apartamento à venda com sacada, casa de condomínio à venda tour.
- **O que mais rendeu:** a página inteira da Nova Época (3 aprovados) e os termos "casa geminada à venda" e "casa à venda com quintal", que trouxeram a LondrinaCred (3 aprovados). As 5 imobiliárias boas entraram em `07-Ferramentas/referencias/lojas-brutos.json`.

## Arquivos
- `aprovados/` (10 vídeos inteiros + `md5.txt`), `previa-trechos/` (os 10 trechos cortados), `reserva/`;
- `planilha-brutos-imoveis-2026-11-26.csv`, `prancha-brutos-imoveis-2026-11-26.jpg`, `aprovados.txt`;
- `meta.json`, `meta-2.json` (coleta), `triagem.json` (peneira), `folhas/` (quadros da conferência).

## Próximo passo
1. Você decide a regra de entrada e parcela do imóvel.
2. Editar no formato da Parte B (título emocional no topo + o nosso mínimo: pílulas, @ e rodapé) com o [[Prompt de edicao]].
3. Nada vai ao ar sem o seu OK.
