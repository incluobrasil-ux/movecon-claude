# Cria o cofre de um vendedor a partir deste cofre (padrao MOVECON).
# Uso: powershell -ExecutionPolicy Bypass -File 07-Ferramentas\preparar-kit-vendedor.ps1 -Destino "C:\MOVECON-Joao" -Nome "Joao"
# Copia: CLAUDE.md, 00-COMECE-AQUI.md, 01-Regras, 02-Funcoes, 03-Padroes, 04-Modelos, 06-Referencias, 07-Ferramentas, 08-Treinamento, .claude, .obsidian
# Nao copia: _arquivo-grok, 10-Trabalho, registros e dados do gestor (05-Operacao vem em branco).
param(
  [Parameter(Mandatory = $true)][string]$Destino,
  [Parameter(Mandatory = $true)][string]$Nome
)
$ErrorActionPreference = "Stop"
$Origem = Split-Path -Parent $PSScriptRoot
if (Test-Path $Destino) {
  if ((Get-ChildItem $Destino -Force | Measure-Object).Count -gt 0) { throw "A pasta $Destino ja existe e nao esta vazia. Escolha outra." }
} else { New-Item -ItemType Directory -Path $Destino | Out-Null }

foreach ($arq in @("CLAUDE.md", "00-COMECE-AQUI.md")) { Copy-Item (Join-Path $Origem $arq) $Destino }
foreach ($pasta in @("01-Regras", "02-Funcoes", "03-Padroes", "04-Modelos", "06-Referencias", "07-Ferramentas", "08-Treinamento", ".claude", ".obsidian")) {
  Copy-Item (Join-Path $Origem $pasta) (Join-Path $Destino $pasta) -Recurse
}
# tabela de contas do gestor e scripts com portas fixas de perfis dele nao vao para o vendedor
Get-ChildItem (Join-Path $Destino "07-Ferramentas\scripts\marketplace") -Filter "grupos-seed-*.json" -ErrorAction SilentlyContinue | Remove-Item -Confirm:$false
Get-ChildItem (Join-Path $Destino "07-Ferramentas\scripts\instagram") -Include "divisao-contas.json", "legendas-pedro.json", "ig-md5-pasta.txt" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Confirm:$false

$hoje = Get-Date -Format "dd/MM/yyyy"
$op = Join-Path $Destino "05-Operacao"
New-Item -ItemType Directory -Path (Join-Path $op "registros") -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $Destino "10-Trabalho") -Force | Out-Null
foreach ($n in @("Perfil-do-operador.md", "Decisoes.md", "Pendencias.md")) {
  $t = Get-Content (Join-Path $Origem "04-Modelos\_operacao-em-branco\$n") -Raw -Encoding UTF8
  $t = $t.Replace("{{NOME}}", $Nome).Replace("{{DATA}}", $hoje)
  [System.IO.File]::WriteAllText((Join-Path $op $n), $t, (New-Object System.Text.UTF8Encoding($false)))
}
# a nota de mapa do vendedor nao cita o arquivo dos bots
$c = Join-Path $Destino "00-COMECE-AQUI.md"
$linhas = Get-Content $c -Encoding UTF8 | Where-Object { $_ -notmatch "Arquivo do tempo dos bots" }
[System.IO.File]::WriteAllText($c, ($linhas -join "`n") + "`n", (New-Object System.Text.UTF8Encoding($false)))

Write-Output "Cofre do vendedor criado em $Destino"
Write-Output "Proximo passo: abrir o Claude Code nessa pasta e pedir 'Le o CLAUDE.md e o Perfil do operador e me diz o que falta preencher.'"
