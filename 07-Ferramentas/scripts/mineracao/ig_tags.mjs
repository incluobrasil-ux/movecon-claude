// Instagram (só leitura, perfil do BitBrowser já logado): lê hashtags e devolve os links de Reels.
// Uso: node ig_tags.mjs <porta CDP> <saida.json> tag1 tag2 ...
import fs from 'fs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const [port, saida, ...tags] = process.argv.slice(2);
const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
let tab = tabs.find(t => t.type === 'page');
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;
const out = fs.existsSync(saida) ? JSON.parse(fs.readFileSync(saida, 'utf8')) : {};
for (const t of tags) {
  await send('Page.navigate', { url: `https://www.instagram.com/explore/tags/${encodeURIComponent(t)}/` }); await sleep(9000);
  for (let k = 0; k < 6; k++) {
    const links = await ev(`[...document.querySelectorAll('a[href*="/reel/"], a[href*="/p/"]')].map(a=>a.getAttribute('href'))`) || [];
    for (const h of links) if (/\/reel\//.test(h) && !out[h]) out[h] = { tag: t };
    await ev('window.scrollBy(0, 2500)'); await sleep(3000);
  }
  console.log(t, 'total reels', Object.keys(out).length);
  fs.writeFileSync(saida, JSON.stringify(out, null, 1)); await sleep(6000);
}
ws.close();
