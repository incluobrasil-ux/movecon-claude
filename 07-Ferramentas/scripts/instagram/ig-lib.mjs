// ig-lib.mjs — CDP helpers para a aba do Instagram do BitBrowser.
// Padrão (sem opções): perfil 2, porta 56930, @tanan_intermediacoes — mesmo comportamento de 19/11 08h01.
// Não abre/fecha perfil nem aba.
import fs from 'fs';

export const ACCOUNTS = {
  tanan: {
    key: 'tanan',
    handle: 'tanan_intermediacoes',
    port: 56930,
    igTabId: '199D86E3D322E5409CFF79ECD2556369',
    fbTabId: '3BCC6B1FEBBD92D17DB95AB8ADAD5F7F',
    divisao: 'tanan_intermediacoes'
  },
  pedro: {
    key: 'pedro',
    handle: 'pedroabreu.consultor',
    port: 53688,
    igTabId: '4FBE4D983C929418709291A31EBEF62E',
    fbTabId: '63E1C1E5B54CD3E0874F6ADAD7E1C8B8',
    divisao: 'pedroabreu.consultor'
  }
};

export const PORT = ACCOUNTS.tanan.port;
export const TAB_ID = ACCOUNTS.tanan.igTabId;
export const HANDLE = ACCOUNTS.tanan.handle;
export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function listTabs(port) {
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  return tabs;
}

function attach(tab) {
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  const ready = new Promise((r, j) => { const t = setTimeout(() => j(new Error('ws timeout')), 15000); ws.onopen = () => { clearTimeout(t); r(); }; ws.onerror = e => { clearTimeout(t); j(e); }; });
  let id = 0; const pend = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.j(new Error(JSON.stringify(m.error))) : p.r(m.result); } };
  const send = (method, params = {}, to = 60000) => new Promise((r, j) => { const i = ++id; const t = setTimeout(() => { pend.delete(i); j(new Error('CDP timeout ' + method)); }, to); pend.set(i, { r: v => { clearTimeout(t); r(v); }, j: e => { clearTimeout(t); j(e); } }); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async (expr) => { const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, userGesture: true }, 90000); if (res.exceptionDetails) throw new Error('JS: ' + (res.exceptionDetails.exception?.description || res.exceptionDetails.text)); return res.result?.value; };
  const shot = async (path) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 75 }); fs.writeFileSync(path, Buffer.from(r.data, 'base64')); return path; };
  const nav = async (url, wait = 7000) => { await send('Page.navigate', { url }); await sleep(wait); };
  return { tab, ws, send, ev, shot, nav, close: () => { try { ws.close(); } catch {} }, ready };
}

// opts.port / opts.tabId: padrão = tanan (56930 / TAB_ID).
// opts.findInstagram: se a aba preferida não for instagram.com, procura outra aba instagram.com na mesma porta (usado na @pedro).
export async function connect(opts = {}) {
  const port = opts.port ?? PORT;
  const tabId = opts.tabId ?? TAB_ID;
  const tabs = await listTabs(port);
  let tab = tabs.find(t => t.id === tabId);
  if (opts.findInstagram) {
    if (!tab || !/^https:\/\/www\.instagram\.com\//.test(tab.url || '')) {
      tab = tabs.find(t => /^https:\/\/www\.instagram\.com\//.test(t.url || ''));
    }
    if (!tab) throw new Error('STOP: aba do Instagram nao encontrada na porta ' + port);
  } else {
    if (!tab) throw new Error('STOP: aba do Instagram nao encontrada na porta ' + port);
    if (!/^https:\/\/www\.instagram\.com\//.test(tab.url || '')) throw new Error('STOP: aba nao e instagram.com: ' + tab.url);
  }
  const c = attach(tab);
  await c.ready;
  return c;
}

// Traz a aba para a frente e espera ela ficar visível. Não muda o tamanho da janela
// (se estiver maximizada, continua maximizada). Se estiver minimizada, restaura maximizada.
export async function ensureVisible(c, tries = 3) {
  let vis = await c.ev('document.visibilityState');
  for (let i = 0; i < tries; i++) {
    await c.send('Page.bringToFront');
    try { await c.send('Target.activateTarget', { targetId: c.tab.id }); } catch {}
    await sleep(1500);
    vis = await c.ev('document.visibilityState');
    if (vis === 'visible') return vis;
    if (i === 0) {
      try {
        const win = await c.send('Browser.getWindowForTarget', { targetId: c.tab.id });
        const st = win?.bounds?.windowState;
        if (win?.windowId != null) {
          const next = (!st || st === 'minimized') ? 'maximized' : st;
          await c.send('Browser.setWindowBounds', { windowId: win.windowId, bounds: { windowState: next } });
        }
      } catch {}
    }
  }
  return vis;
}

function isMainFacebookTab(t) {
  const u = t.url || '';
  if (!/^https:\/\/www\.facebook\.com\//i.test(u)) return false;
  if (/static_resources|webworker|login_sync|\/wa\//i.test(u)) return false;
  return true;
}

// Só traz a aba do Facebook do MESMO perfil para a frente. Não navega, não clica, não abre/fecha aba.
export async function bringFacebookToFront(port, preferredId) {
  const tabs = await listTabs(port);
  let tab = preferredId ? tabs.find(t => t.id === preferredId && isMainFacebookTab(t)) : null;
  if (!tab) {
    const fbs = tabs.filter(isMainFacebookTab);
    tab = fbs.find(t => /marketplace\/you\/selling/i.test(t.url || '')) || fbs[0];
  }
  if (!tab) throw new Error('STOP: aba do Facebook nao encontrada na porta ' + port);
  const c = attach(tab);
  await c.ready;
  try { await c.send('Page.bringToFront'); } finally { c.close(); }
  return { id: tab.id, url: tab.url, title: tab.title };
}

// Texto visível + botões do diálogo/página, e alertas que obrigam a parar.
export const STATE_JS = `(() => {
  const clean = s => String(s||'').replace(/\\s+/g,' ').trim();
  const dlg = [...document.querySelectorAll('div[role=dialog]')].pop();
  const root = dlg || document.body;
  const raw = root.innerText || '';
  const all = document.body.innerText || '';
  const flags = [];
  const checks = [
    ['login', /entrar no instagram|log in to instagram|esqueceu a senha|senha incorreta/i],
    ['verificacao', /confirme que [eé] voc[eê]|confirm it's you|c[oó]digo de seguran[cç]a|security code|verifica[cç][aã]o/i],
    ['limite', /tente novamente mais tarde|try again later|limitamos|we limit|restri[cç]/i],
    ['bloqueio', /conta (foi )?(desativada|suspensa|bloqueada)|account (has been )?(disabled|suspended)/i],
    ['termos', /termos de uso atualizados|updated terms|aceitar os termos/i],
    ['erro', /algo deu errado|something went wrong|n[aã]o foi poss[ií]vel (compartilhar|publicar)|couldn't (be )?(shared|posted)/i]
  ];
  for (const [n, re] of checks) if (re.test(raw)) flags.push(n);
  const btn = [...root.querySelectorAll('button,[role=button],a[role=link]')].map(b => clean(b.innerText || b.getAttribute('aria-label'))).filter(Boolean).slice(0, 60);
  const sw = [...root.querySelectorAll('input[type=checkbox],[role=switch]')].map(s => ({ label: clean(s.closest('label,div')?.innerText||s.getAttribute('aria-label')).slice(0,80), on: s.checked ?? (s.getAttribute('aria-checked')==='true') }));
  return { url: location.href, dialog: !!dlg, flags, btn, sw, text: raw.slice(0, 1500) };
})()`;
// clica num elemento clicável cujo texto/aria-label bate exatamente (case-insens.), dentro do diálogo se houver
export const clickJS = (labels, scopeDialog = true) => `(() => {
  const want = ${JSON.stringify(labels)}.map(s => s.toLowerCase());
  const clean = s => String(s||'').replace(/\\s+/g,' ').trim().toLowerCase();
  const dlg = ${scopeDialog} ? [...document.querySelectorAll('div[role=dialog]')].pop() : null;
  const root = dlg || document;
  const els = [...root.querySelectorAll('button,[role=button],a,[role=link],[role=menuitem],div[tabindex],span')];
  for (const w of want) {
    const el = els.find(e => clean(e.innerText) === w || clean(e.getAttribute('aria-label')) === w || clean(e.querySelector('svg[aria-label]')?.getAttribute('aria-label')) === w);
    if (el) { const t = el.closest('button,[role=button],a,[role=link],[role=menuitem]') || el; t.scrollIntoView({block:'center'}); t.click(); return w; }
  }
  return null;
})()`;
// clique "real" (mouse) no centro de um elemento achado por rótulo
export const rectJS = (labels) => `(() => {
  const want = ${JSON.stringify(labels)}.map(s => s.toLowerCase());
  const clean = s => String(s||'').replace(/\\s+/g,' ').trim().toLowerCase();
  const dlg = [...document.querySelectorAll('div[role=dialog]')].pop();
  const roots = dlg ? [dlg, document] : [document];
  for (const root of roots) {
    const els = [...root.querySelectorAll('button,[role=button],a,[role=link],[role=menuitem],[role=tab],div[tabindex],span,svg[aria-label]')];
    for (const w of want) {
      const el = els.find(e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false; return clean(e.innerText) === w || clean(e.getAttribute('aria-label')) === w || clean(e.querySelector && e.querySelector('svg[aria-label]')?.getAttribute('aria-label')) === w; });
      if (el) { const t = el.closest('button,[role=button],a,[role=link],[role=menuitem],[role=tab]') || el; t.scrollIntoView({block:'center'}); const r = t.getBoundingClientRect(); return { w, x: r.x + r.width/2, y: r.y + r.height/2, inDialog: !!(dlg && dlg.contains(t)) }; }
    }
  }
  return null;
})()`;
export async function mouseClick(c, x, y) {
  await c.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  await c.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await c.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}
export async function clickLabel(c, labels) { const r = await c.ev(rectJS(labels)); if (!r) return null; await sleep(300); await mouseClick(c, r.x, r.y); return r; }
