---
tipo: funcao
substitui: bot Postador de Redes, parte do Marketplace (Grok)
skill: publicar-marketplace
---
# Publicador do Marketplace

**Um trabalho só:** publicar no Marketplace exatamente o que foi aprovado, na conta certa, no ritmo combinado, e provar que foi ao ar.

## Antes de começar uma rodada
1. Fila: só itens com status `aprovado` (lista liberada em [[Decisoes]]). Item `segurado` ou `excluido` não sai.
2. Contas: as do [[Perfil-do-operador]] que estão **abertas e logadas**. Não abrir nem fechar perfil.
3. Para cada conta, ler a lista "Seus classificados": nenhum aviso, e o título que vai sair não pode já estar no ar.
4. Conferir que a mesma **foto** não está no ar em outro anúncio (md5). Mesmo modelo pode.
5. Cada conta pode ter feito 1 anúncio na última hora no máximo.
6. Criar o arquivo `rodada.lock` na pasta da tarefa; apagar no fim.

## Ritmo
- **Contas do gestor:** 1 anúncio novo por hora por conta, 24 h por dia, até acabar a fila (18/11, 11h52). Em cada rodada, uma conta por vez (ou lotes de 3), nunca a mesma conta duas vezes.
- **Vendedor novo:** degrau de [[Contas e navegador]] (1, 2 e 3 por dia) até o gestor liberar mais.
- Grupos: até 20 por anúncio, só de nicho, só onde a conta já é membro ([[Anuncio Marketplace]]).
- Entrar em grupos novos: até 5 pedidos por hora e 30 por dia por conta, na região do [[Perfil-do-operador]] (19/11).

## Publicar (um anúncio)
1. Abrir "Criar novo classificado" > Item. Preencher conforme [[Anuncio Marketplace]]: fotos na ordem (capa externa), título, preço = entrada, categoria Diversos, condição Novo, descrição exata, local da praça.
2. Na prévia, conferir o vendedor (conta certa), o título e o preço. Print.
3. Marcar os grupos. Promover desligado. Publicar.
4. Anotar a hora e o link no registro (print do "em análise").

Scripts do tempo dos bots: `07-Ferramentas/scripts/marketplace/publish-auto.mjs` e afins (CDP). Antes de usar em outro PC, ajustar `ROOT`, `PRINTS` e a tabela `PROFILES` (porta e aba mudam). Na dúvida, faça pelo `bitbrowser.py`, passo a passo, com print.

## Conferir no ar (12 a 15 min depois)
Abrir o link público: título, preço, praça, "Novo", sem aviso. Ver a skill `conferir-no-ar`.
- No ar: anotar no registro. Se o operador mantém a regra de 14/11, apagar as fotos daquele bem (com 12 min ou mais no ar), guardando textos, preço, fonte, print e link. Anotar "fotos apagadas — X MB".
- Erro técnico (não apareceu, falha de upload): republicar igual, no máximo 3 vezes por dia por peça, conferindo antes que não duplicou.
- Recusa, remoção ou aviso: **parar aquela conta**, não republicar, avisar com print.

## Registro
Uma linha por anúncio em `05-Operacao/registros/publicados-AAAA-MM.md`: nº, bem, conta, hora de publicar, link, grupos, conferência no ar, fotos apagadas. Modelo: [[Registro de publicacao]].
Relato ao operador a cada 10 publicados, no fim do dia e no primeiro aviso.

## Nunca
Messenger, responder comprador, Turbinar ou Promover, editar ou renovar anúncio no ar sem pedido, trocar a cidade da conta, publicar item sem OK, usar perfil fora da lista.
