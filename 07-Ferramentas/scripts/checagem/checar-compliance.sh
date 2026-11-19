#!/usr/bin/env bash
# Uso: checar-compliance.sh <arquivo-de-texto> [--terceiros]
# Procura frases bloqueadas (skill regras-comuns-da-opera-o). --terceiros exige "ilustrativ".
# É um filtro de apoio: não substitui a leitura humana. Só lê o arquivo.
f="$1"; [ -f "$f" ] || { echo "uso: $0 arquivo [--terceiros]"; exit 2; }
padroes=(
 "contempla[çc][ãa]o garantida" "garantia de contempla" "garantimos" "garantid[oa]"
 "em [0-9]+ (dias|meses|semanas)" "no pr[óo]ximo m[êe]s" "pr[óo]xima assembleia" "com esse lance voc[êe] leva"
 "carta contemplada" "cr[ée]dito na hora" "cr[ée]dito aprovado" "aprovad[oa] na hora"
 "sem juros e sem taxa" "sem taxa" "rendimento" "investimento" "renda extra" "rentabilidade"
 "\bpix\b" "taxa de reserva" "dep[óo]sit" "transfer[êe]ncia" "pague para"
 "somos a administradora" "nossa administradora" "sou dono da administradora"
)
# Exceção (21/10/2026, confirmada pelo Estrategista): "sem data garantida" é o aviso obrigatório, não promessa.
src=/tmp/ccsrc.$$; sed -E 's/sem data garantida//Ig' "$f" > "$src"
hit=0
for p in "${padroes[@]}"; do
  if grep -n -i -E "$p" "$src" >/tmp/cc.$$ 2>/dev/null; then echo "BLOQUEADA? /$p/:"; sed 's/^/   /' /tmp/cc.$$; hit=1; fi
done
# Desligado em 23/10/2026 01h26: Samuel ("Sim, pode tirar", via chat do Grok Bot). if grep -q -i -E "sem juros" "$f" && ! grep -q -i -E "taxa de administra" "$f"; then echo "BLOQUEADA? 'sem juros' sem citar taxa de administração"; hit=1; fi
if [ "$2" = "--terceiros" ] && ! grep -q -i "ilustrativ" "$f"; then echo "FALTA 'imagem/vídeo ilustrativo' (mídia de terceiros)"; hit=1; fi
rm -f /tmp/cc.$$ "$src"
[ $hit = 0 ] && echo "RESULTADO: nada bloqueado encontrado (ainda leia o texto)" || echo "RESULTADO: REVISAR antes de mostrar ao Samuel"
exit $hit
