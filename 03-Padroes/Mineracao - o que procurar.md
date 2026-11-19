---
tipo: padrao
atualizado: 2026-11-19
---
# Mineração: o que procuramos

São três minerações diferentes. Todas são **só leitura**: nunca curtir, seguir, comentar, mandar mensagem nem logar com conta de alguém.

## 1. Bens para o Marketplace (fotos reais de veículo à venda)
**Objetivo:** uma unidade real à venda, com fotos boas da mesma unidade e o preço daquele anúncio, para virar um rascunho de anúncio.

**Fonte principal:** Mobiauto (script `07-Ferramentas/scripts/mineracao/miner.py`, que lê os dados da página e baixa até 10 fotos de até 1280 px). Webmotors e OLX dão erro 403: não insistir nem contornar. Foto vinda da Webmotors vai para aprovação antes de postar (13/11).

**Pega:**
- faixa de preço e tipos de [[Anuncio Marketplace]];
- de 6 a 10 fotos boas da mesma unidade, com pelo menos uma externa para a capa;
- carroceria e versão batendo com as fotos;
- modelos que vendem na região (ranking em `_arquivo-grok/movecon/mercado/players/ranking-bens-regiao-2026-11-13/`).

**Descarta:**
- anúncio localizado na **praça proibida** ([[Perfil-do-operador]]; hoje, Vitória da Conquista);
- anúncio que fala em consórcio, carta ou contemplação;
- loja com logo grande em todas as fotos (lista em `_arquivo-grok/movecon/marketplace/rascunhos-2026-11-19/_work/dealers_bad.txt`);
- foto com rosto (vai para `_descartadas/`);
- unidade que já está na fila ou no ar (conferir por id, km + preço e placa);
- 0 km, uso especial e os modelos proibidos.

**Ritmo:** 1 requisição a cada 5 a 10 segundos. Erro 403 ou 429, ou captcha: para e registra.

**Entrega:** leva de até 30 bens em `10-Trabalho/AAAA-MM-DD-leva-NN/`, uma pasta por bem ([[Pasta do bem]]), um índice `LEVA-NN.md` (#, pasta, título, valor, entrada, parcela, nº de fotos) e uma folha de contato (contact sheet) para o aprovador.

## 2. Criativos e vídeos brutos de referência
**Objetivo:** (a) vídeos reais de veículos, sem texto na tela, para o Editor usar de base; (b) criativos prontos de concorrentes que estão rodando há muito tempo, para modelar.

**Fontes:** Biblioteca de Anúncios da Meta (`07-Ferramentas/scripts/biblioteca_meta.py`, sem login), TikTok Creative Center (perfil e tag não abrem sem login), YouTube (bloqueia com "não é robô" e cerca de metade falha: desacelerar, não usar cookie), Dailymotion. Instagram sem login não rende.

**Vídeo bruto bom:**
- **só o veículo**: sem pessoa em destaque, apresentador, fachada de loja ou cartaz (13/11);
- **sem texto na tela**, preço, legenda ou marca d'água sobreposta (13/11, 22h08). Texto físico (emblema, adesivo) é aceito e anotado;
- real, não filme de estúdio (13/11, 21h34: "mais realistas");
- 2 trechos de 15 s ou mais por bem; 720p ou mais (abaixo disso, só reserva);
- placa legível, pessoa ao longe e logo de transportadora: aceito, mas **marcado** para o Editor tratar.

**QA antes de entregar:** conferir quadro a quadro (a cada 1 a 2 s) se tem texto, rosto ou marca d'água. Reprovou: `_rejeitados/qa/`, com o motivo.

**Criativo pronto bom para modelar:** veículo + entrada + parcela + chamada para WhatsApp, ordenado por **dias no ar**. Referências de 19/11: carrossel "um carro por card, entrada a partir de R$ X + parcelas" (1.485 dias no ar); carrossel de pesados com ficha técnica; vídeo que abre com a pergunta "Já tem de R$ 10 mil a R$ 15 mil de entrada na mão?".

**RISCO (registrar, não modelar):** promessa de contemplação ("rápida contemplação", "1 parcela, 7 dias, na garagem"), venda ou compra de cota ou carta contemplada, revisional ("reduz 70% das parcelas"), depoimento de contemplado. **Atenção** (modelo, mas sem copiar o trecho): "nome limpo", "restrição não é problema", "sem entrada", "aprovação 100%".

**Entrega:** clipes `NN-tipo-veiculo.mp4`, planilha (arquivo, veículo, ano, tipo, link de origem, perfil, duração, proporção, áudio, marcar rosto/placa, trecho usado, observação), prancha `.jpg` e, para criativos prontos, planilha com plataforma, anunciante, link, início, dias no ar, formato, CTA, mostra entrada, mostra parcela, classificação (modelo/risco) e motivo. Modelo: [[Entrega de mineracao]].

## 3. Mercado e concorrentes (consórcio)
**Objetivo:** quem está escalado, que padrão modelar e quais nichos têm pouca concorrência. Também: possíveis parceiros em outras praças.

**Fontes:** Biblioteca da Meta (Brasil, só ativos, cerca de 15 buscas), Central de Transparência do Google (`transparencia_google.py`), TikTok Creative Center, Marketplace lido pelas contas (só leitura). Sem tema definido, buscar: consórcio, carta de crédito, contemplação, seja representante e os nomes das administradoras (Embracon, Porto, Rodobens, Ademicon, Servopa, Santander, Caixa, Itaú, Bradesco, CNP, Yamaha, HS, Magalu).

**Nota de escala (0 a 10, régua única deste cofre):** `07-Ferramentas/referencias/sinais-escala.md`. Resumo: volume de anúncios (até 3), anúncios novos recentes (até 2), longevidade (30+ dias = 1, 90+ = 2), mesma oferta em várias páginas (até 2), teste ativo de variações (até 1), penalidades. 9–10 escalada pesada; 7–8 modelar; 5–6 monitorar; 0–4 descartar. "Escalado" = 20+ anúncios ativos e pelo menos 1 há 30+ dias.

**Classificar páginas** (para parceiros): cluster grande com o mesmo criativo = master ou franquia; página pequena com anúncio antigo = representante. Contato com representante só em rascunho, com OK do gestor.

**RISCO:** promessa de contemplação ou "crédito na hora", compra ou venda de cota, venda de lead, esconder que é consórcio, promessa de rendimento, cloaking.

**Ritmo e limites:** uma busca a cada 5 a 10 s, uma coleta por vez. A Meta bloqueia por IP depois de um número variável de buscas (sinal: "Nenhum anúncio corresponde" em termo que tinha resultado). Bloqueou: pare e tente de novo em 1 a 2 horas. Ferramenta paga (Apify, cerca de US$ 0,75 por 1.000 anúncios) só com OK do gestor.

**Entrega:** `10-Trabalho/AAAA-MM-DD-mercado-<tema>/` com `ENTREGA.md`, planilha (abas: Escalados, Anúncios, Riscos, Nichos com pouca concorrência) e print de cada anúncio citado.
