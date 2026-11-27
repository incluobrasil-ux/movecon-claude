---
tipo: padrao
atualizado: 2026-11-24
origem: leitura dos perfis @pedroabreu.consultor, @tanan_intermediacoes e @representacaomaranata em 24/11/2026
---
# Padrão mínimo de edição (REGRA ABSOLUTA)

> **Decisão do Samuel, 24/11/2026:** "nós vamos utilizar o material desse perfil como banco de dados para editarmos, o pedro e tanan são perfis de nossa empresa que validaram, e o representacaomaranata é um concorrente, quero que você pegue os padrões e coloque como regra absoluta de edição do projeto, principalmente os que já são da empresa nossa, esse é o padrão mínimo de edição".

**Como usar esta nota:**
- A **Parte A** (@pedroabreu.consultor e @tanan_intermediacoes) é o **mínimo obrigatório**. Vídeo que não bate com ela **não vai para aprovação**: volta para o Editor.
- A **Parte B** (@representacaomaranata, concorrente) é **referência para modelar**, principalmente para imóvel. Nunca copiar o vídeo, o título ou a legenda deles ([[Regras de ouro]]: modelar, não copiar).
- O detalhe técnico (fonte, áudio, −14 LUFS, valores) continua em [[Reel Instagram]] e [[Calculo de entrada e parcela]]. Se as duas notas discordarem, **esta vence**.

## O que os números mostram (aba Reels, lida em 24/11/2026)
| Perfil | Reels | Mediana de visualizações | Maior |
|---|---|---|---|
| @pedroabreu.consultor (nosso) | 23 | 2.240 | 352 mil (Corolla Cross XRX, 22/11) |
| @tanan_intermediacoes (nosso) | 51 | 1.035 | 11,8 mil (Scania G 370, 22/11) |
| @representacaomaranata (concorrente, 194 mil seguidores) | 51 | 542 mil | 7,6 milhões (casa) |

Os mais vistos da @pedro: Corolla Cross XRX 352 mil; L200 Triton 37,9 mil; Accelo 915C 37,5 mil; Tiggo 5X 24,8 mil. Da @tanan: Scania G 370 11,8 mil; Scania P 360 10,6 mil; Atron 2324 7,8 mil; HB20S 7,2 mil; S10 LTZ 7,1 mil.
Folhas de contato dos nossos mais vistos: `06-Referencias/edicao/perfis-validados-2026-11-24/`.

---

# Parte A: mínimo obrigatório (padrão dos nossos perfis)

## A1. Formato
- **1080x1920, 9:16, tela cheia.** Nada de faixa preta, fundo desfocado ou meia tela.
- **11 a 15 segundos** (os nossos validados têm de 11,3 a 15,0 s).
- **Um veículo só, real, filmado na mão**, num lugar de verdade: pátio, loja, rua. Nada de foto parada, IA ou vídeo de montadora.
- A câmera **anda em volta do veículo**: frente 3/4 → lateral → roda → traseira. Interior (painel, banco, câmbio) é opcional, no meio. Plano contínuo ou cortes secos, sem transição de efeito.
- **Primeiro quadro = capa:** o veículo inteiro ou a frente 3/4, já com os valores na tela.

## A2. Texto na tela (fixo do primeiro ao último quadro)
Medidas em % da altura do quadro (1920 px):

| Elemento | Como é | Onde |
|---|---|---|
| **Entrada** | "Entrada de R$ X" em **pílula branca**, texto preto em negrito, sem ponto final | ~19% da altura, lado esquerdo |
| **Parcela** | "Parcelas de R$ Y" logo abaixo: pílula branca (com a entrada) **ou** pílula vermelha com texto branco | ~23 a 25% |
| **Colchete** | colchete vermelho à esquerda das duas pílulas (variação: sem colchete, com a parcela em pílula vermelha) | ao lado das pílulas |
| **Modelo** | nome curto do modelo ("Scania G 370", "L200 Triton Sport HPE-S") em etiqueta pequena | ~28 a 31% |
| **@ da conta** | o @ **da conta onde vai ser postado**, pequeno: em etiqueta preta embaixo do modelo (padrão da @pedro) **ou** no canto de cima, à direita (padrão da @tanan) | — |
| **Rodapé** | "CLIQUE NO LINK / E FALE DIRETAMENTE NO WHATSAPP", branco, condensado, caixa alta, com sombra, em 2 linhas | ~84 a 86% |

- O rodapé **entra entre 1,0 e 1,5 s** (pop) e fica até o fim. Os outros textos já estão no primeiro quadro.
- **Proibido na tela:** número de meses, crédito, porcentagem, lance, "sem juros", MOVECON, logo, aviso legal e "vídeo ilustrativo".
- **Exceção (27/11/2026):** no teste HP1 do perfil do Samuel, as pílulas são "1ª parcela de R$ X" e "Lance de R$ Y" (`"pilulas"` no `lote.json`, valores de `calc_valores.py --hp1`). Só nesse teste.
- **Modelo "passo a passo" (27/11/2026, ~20h50, perfil do Samuel, ver [[Decisoes]]):** no lugar das pílulas, "PLANEJAMENTO A CURTO PRAZO" + "pagando parcela e ofertando lance para antecipar a liberação" no topo, modelo e @, e 3 passos que entram um por vez: 1ª parcela (0 s), lance (2 s) e demais parcelas depois do lance (4 s, em destaque), com "plano de 80 meses"; rodapé verde a partir de 1,2 s. "Lance" e "80 meses" podem aparecer na tela nesse modelo. Valores: [[Calculo de entrada e parcela]]. Visual aguardando OK.
- **Os valores da tela e da legenda são os mesmos.** Calcule com `calc_valores.py <valor> --reel`.

## A3. Imagem limpa
- **Placa, plaqueta, adesivo e letreiro de outra loja tampados de forma discreta, em todos os quadros** (decisão de 25/11/2026): a área vira uma placa lisa na cor do fundo dela, seguindo o movimento quadro a quadro, sem caixa preta, sem borrão e sem distorcer o resto da imagem. Ferramenta: `07-Ferramentas/scripts/edicao/tampa_plaquetas.py`. Letreiro grande de fachada: **corte o trecho** em vez de tampar. A tarja preta sólida continua valendo nas **fotos** do Marketplace.
- Conferência obrigatória: recorte da área tampada a cada ~0,2 s e os quadros de entrada e saída de cada tomada (transição, clarão, corte). O OCR sozinho não basta.
- Nenhum rosto, nome de loja, letreiro, telefone ou marca d'água.
- **Nenhum texto que sobrou do vídeo de origem.** Erro achado em 24/11: a L200 da @pedro abre com um preço do vídeo original aparecendo por trás das pílulas no quadro 0. Confira o **quadro 0** e corte o começo se precisar.

## A4. Áudio
- O que funcionou nos mais vistos: o **áudio original** do vídeo (a maioria dos mais vistos da @pedro) ou uma música adicionada (sertanejo, pop e rock conhecidos, na @tanan).
- Se o vídeo tem voz de vendedor ou de terceiro, troque por **uma** música contínua ([[Reel Instagram]]). Nunca música com palavrão.

## A5. Legenda (o padrão novo da @pedro é o preferido; o da @tanan é o aceito)
**Preferido**, que estava em todos os 4 mais vistos da @pedro, de 21 a 22/11:
```
<gancho de 1 linha sobre o bem ou a dor do cliente>
✔ Entrada de R$ X
✔ Parcelas de R$ Y
✔ Atendimento em <praça> e região
<1 linha de benefício: para que serve o bem no dia a dia>
Fala comigo no WhatsApp pelo link da bio.
#<modelo> #<marca> #<categoria> #parcelamento #<praça sem espaço>
Parcelamento. Vídeo ilustrativo.
```
- Exemplos de gancho que funcionaram: "O Corolla Cross XRX 2025 que você salvou no celular pode sair da tela." · "Picape forte pra roça, pra obra e pra viagem." · "Accelo 915C 2012 pra começar ou crescer a sua entrega." · "Caminhoneiro, o seu próximo cavalo pode ser um Scania R 450 2024."
- Marcador: ✔ ou 👉. **5 hashtags**, sempre com a da praça. Última linha sempre "Parcelamento. Vídeo ilustrativo.". Isso resolve a pendência do "vídeo ilustrativo" na legenda.
- **Aceito** (padrão da @tanan): emoji do tipo + "Modelo com entrada de R$ X!", 💰 Entrada, 📆 Parcelas, CTA "Clique no link da bio...", hashtags. Na @pedro, nunca #tananintermediacoes.

## A6. Checagem antes de mandar para aprovação (todas obrigatórias)
1. `check_oferta.sh` + `checar-midia.py <arquivo> instagram reel` (1080x1920, de 11 a 15 s, −14 LUFS).
2. Folha de contato com o quadro 0, o de 1,5 s e um quadro a cada 10% do vídeo. Conferir item por item da tabela A2 e da A3.
3. Valores da tela = valores da legenda = `calc_valores.py`.
4. O @ na tela é o da conta de destino.
5. Registrar o md5 na lista de aprovação ([[Aprovacao e registro]]).

---

# Parte B: o que modelar do concorrente (@representacaomaranata)

Eles anunciam **imóvel** (casa) com resultados em milhões de visualizações. O formato:
- **Tour da casa andando**, câmera estável (gimbal ou celular firme), de **30 a 46 s**, 720x1280. Começa no **portão ou fachada**, entra pela garagem e passa pela sala, cozinha, corredor, quartos e banheiro.
- **Título emocional fixo no topo**, branco, negrito, com contorno preto e sem caixa: "Casa dos Sonhos", "Casa Custo Benefício".
- **Valores no meio-baixo da tela**, texto branco com contorno e sem pílula: "Entrada 16.199,00" / "Parcela 899,00", ou "Entrada mínima 10 Mil" / "Parcela 505,00". Ficam fixos o vídeo inteiro.
- **Sem @, sem rodapé de CTA e sem logo na tela.**
- **Música:** sertanejo "ao vivo" em alta (Matheus & Kauan, Ana Castela, Felipe e Rodrigo; uma delas se chama "Consórcio").
- **Legenda curta:** "Compre sua casa na carta de crédito 🏠 (Vídeo Ilustrativo)" + hashtag da cidade. Nos mais antigos também #eua #portugal #frança #alemanha, para quem mora fora.
- Os comentários são quase todos "onde fica?" e "qual o valor?". A curiosidade gera conversa.

**O que podemos usar (modelar, sem copiar):**
- Para **imóvel**: tour andando de 25 a 45 s, título emocional próprio no topo e os nossos valores no padrão A2 (pílulas, @ e rodapé continuam obrigatórios, porque são o nosso mínimo).
- **Título emocional** acima das pílulas também em veículo, como teste (ex.: "A picape da roça"), sem tirar nenhum item da Parte A.
- **Música sertaneja em alta** só no **orgânico** pelo app, nunca em anúncio pago.
- Hashtag para quem mora fora: só com OK do gestor.

**O que não usar:** "Entrada mínima" sem o valor exato, vídeo sem o nosso @, título ou trecho deles igual, e o vídeo deles.

**Pendente com o gestor:** a regra de valores para imóvel (ver [[Pendencias]]). Até decidir, imóvel não sai com valor.
