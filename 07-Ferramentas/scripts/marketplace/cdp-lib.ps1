# CDP helper for BitBrowser. PowerShell 5.1.
$ErrorActionPreference = 'Stop'

function Connect-Cdp([string]$WsUrl) {
  $ws = New-Object System.Net.WebSockets.ClientWebSocket
  $ct = [Threading.CancellationToken]::None
  $ws.ConnectAsync([Uri]$WsUrl, $ct).Wait()
  return $ws
}

function Send-Cdp($ws, [string]$method, $params, [int]$timeoutSec = 60) {
  if (-not $script:cdpId) { $script:cdpId = 0 }
  $script:cdpId++
  $myid = $script:cdpId
  $obj = @{ id = $myid; method = $method }
  if ($null -ne $params) { $obj.params = $params }
  $msg = $obj | ConvertTo-Json -Depth 20 -Compress
  $b = [Text.Encoding]::UTF8.GetBytes($msg)
  $ct = [Threading.CancellationToken]::None
  $ws.SendAsync([ArraySegment[byte]]$b, [Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
  $deadline = (Get-Date).AddSeconds($timeoutSec)
  while ($true) {
    if ((Get-Date) -gt $deadline) { throw "CDP timeout waiting for id=$myid method=$method" }
    $ms = New-Object IO.MemoryStream
    do {
      $buf = New-Object byte[] 1048576
      $r = $ws.ReceiveAsync([ArraySegment[byte]]$buf, $ct).Result
      $ms.Write($buf, 0, $r.Count)
    } while (-not $r.EndOfMessage)
    $txt = [Text.Encoding]::UTF8.GetString($ms.ToArray())
    if ($txt -match ('^\{"id":' + $myid + ',')) { return $txt }
    # also accept id after other fields? usually id is first. fallback parse:
    try {
      $j = $txt | ConvertFrom-Json
      if ($j.id -eq $myid) { return $txt }
    } catch {}
  }
}

function Get-CdpResult($txt) {
  $j = $txt | ConvertFrom-Json
  if ($j.error) { throw ("CDP error: " + ($j.error | ConvertTo-Json -Compress)) }
  return $j.result
}

function Invoke-CdpEval($ws, [string]$expression, [switch]$Await) {
  $params = @{
    expression = $expression
    returnByValue = $true
    awaitPromise = [bool]$Await
  }
  $txt = Send-Cdp $ws 'Runtime.evaluate' $params 90
  $res = Get-CdpResult $txt
  if ($res.exceptionDetails) {
    $ex = $res.exceptionDetails
    $msg = $ex.text
    if ($ex.exception -and $ex.exception.description) { $msg = $ex.exception.description }
    throw "JS exception: $msg"
  }
  return $res.result.value
}

function Save-CdpShot($ws, [string]$path, [string]$fmt = 'jpeg', [int]$quality = 80) {
  $params = @{ format = $fmt }
  if ($fmt -eq 'jpeg') { $params.quality = $quality }
  $txt = Send-Cdp $ws 'Page.captureScreenshot' $params 60
  $res = Get-CdpResult $txt
  $bytes = [Convert]::FromBase64String($res.data)
  [IO.File]::WriteAllBytes($path, $bytes)
  return $bytes.Length
}

function Open-CdpTab([string]$Port) {
  $tab = Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:$Port/json/new?about:blank"
  return $tab
}

function Close-CdpTab([string]$Port, [string]$Id) {
  try { Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/close/$Id" | Out-Null } catch {}
}

function Get-CdpTabs([string]$Port) {
  return Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list"
}

function Get-TabWs([string]$Port, [string]$Id) {
  $tabs = Get-CdpTabs $Port
  $t = $tabs | Where-Object { $_.id -eq $Id } | Select-Object -First 1
  if (-not $t) { throw "Tab $Id not found" }
  return $t.webSocketDebuggerUrl
}
