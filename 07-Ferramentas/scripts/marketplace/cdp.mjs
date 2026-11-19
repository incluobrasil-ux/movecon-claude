import { writeFileSync } from 'fs';

export async function listTabs(port) {
  const res = await fetch(`http://127.0.0.1:${port}/json/list`);
  if (!res.ok) throw new Error(`list tabs ${port}: ${res.status}`);
  return res.json();
}

export async function connectTab(port, tabId) {
  const tabs = await listTabs(port);
  const tab = tabs.find(t => t.id === tabId);
  if (!tab) throw new Error(`tab ${tabId} not found on port ${port}`);
  if (!/^https:\/\/www\.facebook\.com\//.test(tab.url) && !/^https:\/\/facebook\.com\//.test(tab.url)) {
    throw new Error(`refusing non-facebook tab: ${tab.url}`);
  }
  const wsUrl = tab.webSocketDebuggerUrl || `ws://127.0.0.1:${port}/devtools/page/${tabId}`;
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('ws connect timeout')), 15000);
    ws.addEventListener('open', () => { clearTimeout(t); resolve(); });
    ws.addEventListener('error', (e) => { clearTimeout(t); reject(e); });
  });
  let nextId = 0;
  const pending = new Map();
  const events = [];
  ws.addEventListener('message', (ev) => {
    const txt = typeof ev.data === 'string' ? ev.data : Buffer.from(ev.data).toString('utf8');
    let msg;
    try { msg = JSON.parse(txt); } catch { return; }
    if (msg.id != null && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`${msg.method || ''} CDP: ${JSON.stringify(msg.error)}`));
      else resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  });
  async function send(method, params = {}, timeoutMs = 60000) {
    const id = ++nextId;
    const p = new Promise((resolve, reject) => {
      const t = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`CDP timeout ${method}`));
      }, timeoutMs);
      pending.set(id, {
        resolve: (v) => { clearTimeout(t); resolve(v); },
        reject: (e) => { clearTimeout(t); reject(e); },
      });
    });
    ws.send(JSON.stringify({ id, method, params }));
    return p;
  }
  async function evaluate(expression, awaitPromise = false) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise,
      userGesture: true,
    }, 90000);
    if (res.exceptionDetails) {
      const ex = res.exceptionDetails;
      const msg = ex.exception?.description || ex.text || JSON.stringify(ex);
      throw new Error('JS: ' + msg);
    }
    return res.result?.value;
  }
  async function screenshot(path, quality = 80) {
    const res = await send('Page.captureScreenshot', { format: 'jpeg', quality });
    const buf = Buffer.from(res.data, 'base64');
    writeFileSync(path, buf);
    return buf.length;
  }
  async function navigate(url, waitMs = 8000) {
    await send('Page.enable');
    await send('Page.navigate', { url });
    await sleep(waitMs);
  }
  function close() {
    try { ws.close(); } catch {}
  }
  return { tab, send, evaluate, screenshot, navigate, close, events };
}

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export const PAGE_STATE_JS = `(() => {
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const raw = (document.body && document.body.innerText) ? document.body.innerText : '';
  const flags = [];
  const checks = [
    ['nao_pode_vender', /voc[eê] n[aã]o pode vender/i],
    ['community_standards', /padr[oõ]es da comunidade|community standards/i],
    ['checkpoint', /checkpoint/i],
    ['confirm_identity', /confirma que [eé] voc[eê]|confirme sua identidade|ajuda a confirmar/i],
    ['codigo', /digite o c[oó]digo|enviar c[oó]digo|c[oó]digo de verifica/i],
    ['recusado', /an[uú]ncio recusado|listing (was )?rejected|n[aã]o foi aprovado/i],
    ['login', /entrar no facebook|log in to facebook|inserir senha/i],
    ['bloqueio', /sua conta foi bloqueada|account (is )?disabled|conta desativada/i],
    ['restricao', /restringimos|sua conta est[aá] com restri|limitamos alguns recursos|aviso da conta/i],
    ['removido', /classificado (foi )?removido|an[uú]ncio (foi )?removido/i]
  ];
  for (const [name, re] of checks) { if (re.test(raw)) flags.push(name); }
  const aria = Array.from(document.querySelectorAll('[aria-label]'))
    .map(el => el.getAttribute('aria-label'))
    .filter(Boolean)
    .filter((v,i,a) => a.indexOf(v)===i)
    .slice(0, 80);
  const nameCands = aria.filter(t => /perfil|profile|conta de|account/i.test(t)).slice(0, 15);
  const buttons = Array.from(document.querySelectorAll('button, [role="button"]')).map(el => ({
    text: clean(el.innerText || el.getAttribute('aria-label') || '').slice(0, 120),
    disabled: !!(el.disabled || el.getAttribute('aria-disabled') === 'true')
  })).filter(b => b.text).slice(0, 50);
  return {
    url: location.href,
    title: document.title,
    flags,
    nameCands,
    ariaSample: aria.slice(0, 40),
    buttons,
    textSample: raw.slice(0, 4500)
  };
})()`;
