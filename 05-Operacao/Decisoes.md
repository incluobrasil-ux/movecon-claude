---
tipo: operacao
atualizado: 2026-11-27
---
# Decisões

Registro das decisões do gestor e do operador, **da mais nova para a mais antiga**. Uma linha por decisão: data e hora (BRT), palavras exatas quando houver, o que muda e a nota de padrão afetada. A decisão mais nova ganha da antiga.

Fonte das decisões até 19/11/2026: `_arquivo-grok/movecon/ceo/tarefas.md`, `_arquivo-grok/movecon/marketplace/HANDOFF-POSTADOR-2026-11-14.md` e as notas dos bots.

## Novembro de 2026

| Data e hora | Decisão (palavras do Samuel quando registradas) | Afeta |
|---|---|---|
| 27/11 12h20 | **Resposta automática de comentários (vendedores):** "quero um prompt para enviar pro consultor pra ele mandar o instagram dele responder todos os comentarios com o numero dele pedindo pra chamar, ele ja vai ter o bitbrowser no computador deles então é basicamente o claude entrar no bitbrowser de 20 em 20 minutos pedindo o contato de todo mundo que está sem resposta". O que muda: única exceção à regra "o Claude não responde comentário". Só a mensagem padrão com o WhatsApp do operador (sem valor, sem conversa, sem Direct), pela `ig-responder-comentarios.mjs`, a cada 20 min, no máximo 8 por rodada e 60 por dia. Negativo, propaganda e "já te chamei" ficam para o operador. Prompt pronto: [[Prompt de respostas nos comentarios]] | [[Respondedor de comentarios]], [[Contas e navegador]], [[Publicador Instagram]] |
| 27/11 04h50 | **Fontes da mineração:** "agora para de minerar so dessa loja vai atras de outras fontes n gosto de pegar de um lugar só". O que muda: numa mesma rodada, no máximo 2 vídeos aprovados da mesma loja; variar entre Biblioteca da Meta (busca por modelo), perfis de revenda no Instagram e páginas de lojas diferentes. Avantgarde Motors e GrandPrix Automóveis já deram muitos em 27/11 | [[Mineracao - o que procurar]] |
| 27/11 04h48 | **Reels de teste:** "temos que postar em rells de teste que é muito validado tbm, coloca isso de regra para as proximas postagens". Logo depois: "continua a fila do jeito que ta ai mesmo normal" / "pode postar tudo no normal mesmo". O que vale agora: postar como Reel **normal**. Reel de teste fica pendente: exige perfil profissional (o @tananconsorcio é perfil pessoal em 27/11) e o Instagram no computador não mostra a opção | [[Publicador Instagram]], [[Pendencias]] |
| 27/11 04h40 | **Stories do @tananconsorcio:** "não quero mais nada no feed" (material de prova social vai para stories e destaques) e "nao sao todos storeis que stão cortados tb analise e ve oq está realmente cortado". O que muda: o Instagram pelo navegador corta cerca de 9% de cada lateral do story; story com texto perto da borda vai enquadrado com margem (fundo desfocado). Refeitos só os 3 que cortavam texto | [[Publicador Instagram]] |
| 27/11 04h10 | **Ofertas do @tananconsorcio:** "pra esses carros acima de 400.000 vc vai postar no esquema da hiper 1, e valores mais baixos vc vai postar na mesma regra anterior" e "em todas postagens tem que estar no final com # do carro e coisas do parcelamento olhe o perfil de pedroabreu". O que muda: R$ 400 mil para cima = HP1; abaixo = entrada 18% e parcelas 0,9%; legenda no formato da @pedroabreu.consultor (5 hashtags e "Parcelamento. Vídeo ilustrativo."); 1 Reel por hora | [[Calculo de entrada e parcela]], [[Reel Instagram]] |
| 27/11 | **Correção do HP1:** "hp1 não é 60% do valor do carro, os grupos que vamos usar tem 30% de lance, o cliente vai precisar por 30% do proprio bolso sobre o valor do credito". O que muda: grupos 0030 e 0031 (lance de 30%); pílula "Lance de R$ Y" = 30% da carta somada, todo do bolso; `calc_valores.py --hp1` já usa 30%. Substitui os 60% da linha abaixo | [[Calculo de entrada e parcela]] |
| 27/11 | "meu bitbrowser venceu vamos usar o bitbrowser da incluo brasil ai vcs vejam por la agr guia 01 to abrindo meu instagram lá e as coisas que rodavam antes por la vou por aqui por enquanto". O que muda:<br>• o BitBrowser em uso passa a ser o da Incluo Brasil; nele só existe o perfil 1 "insta samuel tanan" (lido em 27/11), com o Instagram do Samuel;<br>• os perfis antigos (contas 1 a 11 do Marketplace, @tanan_intermediacoes, @pedroabreu.consultor) ficaram no BitBrowser vencido: rodadas e postagens dessas contas ficam paradas até o Samuel reabrir;<br>• o que rodava nesses perfis, o Samuel faz por conta própria por enquanto | [[Perfil-do-operador]], [[Contas e navegador]] |
| 27/11 | "quero fazer algo nichado para veiculos de 200.000 a 1.000.000 [...] dividir metade dos posts no modelo ja validado e quero postar hp 1 com o valor da primeira parcela ai da tabela mais o lance do bolso que a pessoa teria que dar também seguindo esse mesmo template"; "a média desse grupo ai é 60%". O que muda:<br>• no perfil do Samuel, metade dos Reels de oferta usa o modelo validado (entrada 18% / parcelas 0,9%) e metade o **HP1** (tabela 4659, hiper 1): pílulas "1ª parcela de R$ X" e "Lance de R$ Y", com lance do bolso de 60% da carta e cartas somadas até cobrir o bem;<br>• **exceção só para o teste HP1:** "lance" pode aparecer na tela (no resto continua proibido);<br>• valores sempre por `calc_valores.py <valor> --hp1`; cronograma em `10-Trabalho/2026-11-27-cronograma-perfil-veiculos-200k-1m/` | [[Calculo de entrada e parcela]], [[Padrao minimo de edicao]] |
| 26/11 | "quero que você faça uma mineração pesada de trator/maquina agricola/maquinarios [...] atue como agronomo e liste tudo que podemos postar dentro do ticket" + "pode procurar pelo instagram, pelo meta ads, pelo google shorts, onde vc achar melhor vc tem autonomia total resolva a meta que pedi e econtre o melhor processo de mineração para o nicho": para a mineração agro de R$ 500 mil a R$ 1 milhão, o Claude do Samuel pode usar o Instagram logado (perfil 91), **só leitura** (hashtags e Reels de perfis), parando no 1º aviso. A regra de minerar sem login continua para vendedores e parceiros | [[Minerador]], [[Contas e navegador]] |
| 26/11 | "vamos minerar de outra forma então, vamos pro instagram anquela conta que ja está logada, procure por lá" + resposta "Sim, só leitura" e perfil "halvveny insta (91)": **exceção só para esta mineração de tratores** à regra de minerar sem login. Só leitura (hashtags e Reels), sem curtir, seguir nem comentar, parar no 1º aviso. A regra continua valendo para vendedores e parceiros | [[Minerador]], [[Contas e navegador]] |
| 26/11 | "antes de enviar na verdade quero que você acha mais 5 casas para complementarmos pra ela": mais 5 casas mineradas (11 a 15). A entrega `entregas/2026-11-26-brutos-casas/` passa a ter 11 casas | [[Publicador Instagram]] |
| 26/11 | "eu quero foco nas casas, os apartamentos foram reprovados e as casas aprovadas": da mineração de imóveis de 25-26/11, os 6 tours de **casa** foram aprovados e os 4 de **apartamento** reprovados. Imóvel nos Reels = **casa**; não minerar apartamento sem pedido. As 6 casas vão para o representante em `entregas/2026-11-26-brutos-casas/`. Entrada e parcela de imóvel continuam pendentes | [[Mineracao - o que procurar]], [[Padrao minimo de edicao]] |
| 25/11 | "eu quero que ele poste manual mesmo mexendo pelo bitbrowser delas la que ja ta logado". O que muda:<br>• substitui o Claude in Chrome e o Business Suite da linha abaixo;<br>• a postagem é feita pelo `ig-postar-lote.mjs` (versão do robô de 19/11 para qualquer PC), no perfil do BitBrowser já logado da parceira, no ritmo da agenda dela, com a [[Prompt de postagem]];<br>• a exceção ao BitBrowser foi cancelada e a regra de [[Contas e navegador]] continua inteira | [[Publicador Instagram]] |
| 25/11 | "a ideia é que poste sozinho sem precisar passar por mim, elas foram subir la no pc delas e deu esse problema de conector do instagram ai o prompt é pra soltar lá e ele entrar e ja postar tudo de vez conforme elas progreamaram la". Isto substitui a postagem manual da linha abaixo. O que muda:<br>• no PC do parceiro, o Claude in Chrome agenda todos os Reels de uma vez no Meta Business Suite, pela [[Prompt de postagem]];<br>• exceção à regra do BitBrowser só para a conta do próprio parceiro, no Chrome dele, com o login feito por ele | [[Publicador Instagram]], [[Contas e navegador]] |
| 25/11 | "quero que ele poste manual mesmo nesse momento": o vendedor não tinha conector no PC dele. Os 15 Reels de caminhão vão para a @lais.iconsorcio **postados na mão**, com as legendas de `entregas/2026-11-25-caminhao-lais/LEGENDAS.md` (formato aceito da @tanan, porque a praça da conta não está no cofre) e o passo a passo em `COMO-POSTAR.md`. Isso vale como OK de publicação dessa lista | [[Publicador Instagram]], [[Aprovacao e registro]] |
| 25/11 | "sempre que uma pessoa puxar o projeto e subir um prompt de mineração tudo que já trabalhamos deve ser ativado pra não deixar ela fazer o retrabalho". O que mudou:<br>• o gancho do Claude Code (`antes_de_minerar.py`) mostra o caminho validado e o que já foi feito;<br>• `buscas-feitas.csv` e `memoria-mineracao.jsonl` agora vão para o GitHub;<br>• o índice [[Ja minerado]] é obrigatório no começo e no fim de toda mineração;<br>• proibido minerar com conta logada ou com robô novo.<br>Motivo: um parceiro minerou concorrentes com perfil logado do BitBrowser e um robô próprio | [[Minerador]], [[Mineracao - o que procurar]], [[Ja minerado]] |
| 25/11 | "ficou excelente": a v3 dos brutos de caminhão (`10-Trabalho/2026-11-25-brutos-caminhao/editados-lais-v3/`, 15 vídeos) foi aprovada no visual. O método do `tampa_plaquetas.py` (área lisa, quadro a quadro, conferida no olho) é o padrão para tampar placa e nome de loja em vídeo | [[Padrao minimo de edicao]], [[Editor]] |
| 25/11 | "reanalise tudo, corte pixel por pixel da imagem e tampe a placa em tudo [...] faça da forma mais discreta possível mas sem distorcer a imagem, a ideia é realmente tampar a placa e o nome da loja": o inpainting largo foi abandonado (distorcia). Placa, plaqueta e adesivo de loja viram uma área lisa na cor do fundo, seguida quadro a quadro (`tampa_plaquetas.py`), conferida no olho; letreiro grande de fachada = cortar o trecho | [[Padrao minimo de edicao]], [[Editor]] |
| 25/11 | "alguns vídeos ficaram com problema na tarja na placa, quero algo mais natural ao ponto de ser imperceptível, tampando tudo de nome de outra loja ou placa mesmo": nos **vídeos**, placa e nome/telefone de outra loja são apagados com preenchimento pelo entorno (inpainting), seguindo a placa quadro a quadro, sem caixa preta. Substitui a tarja preta sólida nos vídeos (13/11 e 14/11) | [[Padrao minimo de edicao]], [[Reel Instagram]] |
| 25/11 | Bruto sem preço no anúncio: "Sim, usar FIPE" + "olha você o caminhão e imagina qual o ano, põe uma média, não precisa ser exatamente o mesmo preço do veículo, só uma média está ótimo com a entrada". Valor = média de mercado do modelo e ano estimado; marcar "valor médio estimado" | [[Calculo de entrada e parcela]], [[Mineracao - o que procurar]] |
| 25/11 | "o formato do vídeo 3 4 5 estão incorretos" + "quero agora 20 videos só que todos no padrão já acertado do 1 2 6": bruto só vertical nativo, com o veículo inteiro, de loja, com preço | [[Mineracao - o que procurar]], [[Minerador]] |
| 24/11 | "pegue os padrões e coloque como regra absoluta de edição do projeto, principalmente os que já são da empresa nossa, esse é o padrão mínimo de edição": @pedroabreu.consultor e @tanan_intermediacoes = mínimo obrigatório; @representacaomaranata = modelar. Legenda preferida = padrão novo da @pedro, terminando em "Parcelamento. Vídeo ilustrativo." | [[Padrao minimo de edicao]], [[Reel Instagram]], [[Editor]] |
| 20/11 | "as redes devem ser somente para o nicho mas o marketplace é mais aberto": o perfil nichado vale só para Instagram e TikTok; no Marketplace o vendedor anuncia qualquer veículo da faixa, independente do nicho | [[02-Parte 1 - Perfil nichado]], [[04-Parte 2 - Marketplace organico]] |
| 19/11 13h45 | Sair do Grok e trabalhar pelo Claude; montar o cofre do zero com tudo | este cofre |
| 19/11 11h30 | "Pode liberar entrar em grupos em todas as contas"; região "sudoeste da Bahia e norte de Minas". Máx. 5 pedidos por hora e 30 por dia por conta | [[Publicador Marketplace]] |
| 19/11 11h16 | "tirar o selo tanan intermediaçoes em todas as postagens que forem pro instagram de pedro" | [[Reel Instagram]] |
| 19/11 10h44 | "tira a #tananintermediacoes das legendas da pedro" | [[Reel Instagram]] |
| 19/11 10h24 | Conta 4 entra em grupos do nicho; anúncios em mais grupos | [[Publicador Marketplace]] |
| 19/11 10h20 | "todos os dias vou querer esses relatorio" (contagem do Marketplace) | [[Analista]] |
| 19/11 10h01 | Reels diferentes em cada conta; @pedroabreu.consultor 3 por dia (manhã, tarde, noite) | [[Publicador Instagram]] |
| 19/11 09h55 | Minerar 50 brutos + criativos prontos (Biblioteca do Facebook, TikTok) | [[Minerador]] |
| 19/11 07h27 | Instagram da pasta "criativos": 1 post por hora | [[Publicador Instagram]] |
| 19/11 07h10 | "Tira do ar e manda os substitutos": removidos os anúncios com foto de Vitória da Conquista | [[Publicador Marketplace]] |
| 18/11 22h40 | Não pegar fotos de anúncios de Vitória da Conquista | [[Fotos de veiculo]], [[Minerador]] |
| 18/11 17h57 | "so nao quero quando se trata da mesma foto, se for mesmo modelo pode postar" | [[Anuncio Marketplace]] |
| 18/11 16h33 | "Pode mover os brutos pro meu PC" | — |
| 18/11 14h08 | Minerar mais bens e o Editor preparar fotos para todas as contas | [[Minerador]] |
| 18/11 13h48 | Anúncios já postados em mais grupos, 20 por vez, mais de uma vez por anúncio | [[Publicador Marketplace]] |
| 18/11 11h52 | Todas as contas do BitBrowser, 1 anúncio por hora por conta, até acabar a fila | [[Publicador Marketplace]] |
| 14/11 15h33 | "Aplica tudo": copy v3; ranking diário; aprovações só pelo CEO, 1 vez por dia em lote | [[Aprovacao e registro]] |
| 14/11 14h45 | "Nao poste nada no Instagram nem tiktok" (@planejeseucredito e TikTok parados) | [[Perfil-do-operador]] |
| 14/11 14h44 | Accelo não entra no Marketplace | [[Anuncio Marketplace]] |
| 14/11 13h37 | Apagar as fotos de cada anúncio depois de publicado e conferido | [[Publicador Marketplace]] |
| 14/11 13h35 | Títulos e descrições diferentes em cada anúncio, sempre com entrada e foco no parcelamento | [[Anuncio Marketplace]] |
| 14/11 13h34 | Pode publicar à noite e de madrugada | [[Publicador Marketplace]] |
| 14/11 11h30 | Tarja só em cima da placa | [[Fotos de veiculo]] |
| 14/11 08h40 | Vídeos: entrada ~18% do bem, parcela 0,9% do bem | [[Reel Instagram]] |
| 13/11 22h12 | Vídeos levam rodapé "CLIQUE NO LINK E FALE NO WHATSAPP" e só entrada e parcelas | [[Reel Instagram]] |
| 13/11 11h43 | Marketplace: carros R$ 50–200 mil; caminhões e vans a partir de R$ 70 mil, até R$ 300 mil; entrada de 20%; fotos reais; placa tampada | [[Anuncio Marketplace]] |
| 13/11 08h50 | Fotos de bem real (Webmotors) sempre aprovadas antes de postar | [[Aprovacao e registro]] |

## Outubro de 2026

| Data e hora | Decisão | Afeta |
|---|---|---|
| 28/10 | SDR: 1ª resposta ~40 s; abre com "Oi, tudo bem? Qual é o seu nome?"; funil começa pela entrada | [[Atendimento]] |
| 24/10 13h30 | Uma região fixa por conta no Marketplace | [[Contas e navegador]] |
| 24/10 13h24 | Degrau de conta nova: 1/dia na 1ª semana, 2/dia na 2ª, 3/dia depois | [[Contas e navegador]] |
| 24/10 02h38 | Contas do Facebook no BitBrowser, um perfil por conta | [[Contas e navegador]] |
| 24/10 02h04 | Tabelas da Alpha valem sempre, independente do "válida até" | [[Calculo de entrada e parcela]] |
| 23/10 01h20 | Compliance no atendimento, não nas peças | [[Compliance]] |
| 22/10 00h35 | "Entrada" na peça agressiva (lance fixo e sorteio); "1ª parcela" na educativa e de lance livre | [[Reel Instagram]] |
| 22/10 00h14 | Toda copy sai da função Copywriter, pronta antes da edição e da postagem | [[Copywriter]] |
| 22/10 00h10 | Nenhum aviso legal na arte; só na legenda | [[Compliance]] |
| 21/10 23h25 | Publicar no Marketplace mesmo ciente da regra de comércio da Meta | [[Publicador Marketplace]] |
| 21/10 23h24 | Vídeo oficial de montadora e música em alta liberados | [[Editor]] |
| 21/10 22h42 | SDR continua com a voz real do Samuel (não o clone) | [[Atendimento]] |
| 21/10 | Vídeos ilustrativos de terceiros liberados, com "vídeo ilustrativo" na legenda | [[Regras de ouro]] |
| 21/10 23h06 | Verba de tráfego R$ 40/dia; raio de 300 km de Vitória da Conquista | [[Perfil-do-operador]] |
