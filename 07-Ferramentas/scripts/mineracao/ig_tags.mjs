// ig_tags.mjs — Instagram SÓ LEITURA num perfil do BitBrowser já logado: lê hashtags e/ou a aba de Reels de perfis
// e devolve os links dos posts (26/11/2026, versão 2).
// ATENÇÃO: minerar com conta logada só com OK ESCRITO do Samuel registrado em 05-Operacao/Decisoes.md
// (regra de 25/11; exceções de 26/11 só para o Claude do Samuel). Nunca curte, segue, comenta nem posta.
//
// Uso (da pasta raiz do cofre):
//   py -3 07-Ferramentas/scripts/bitbrowser.py porta "NOME DO PERFIL"   -> PORTA
//   node 07-Ferramentas/scripts/mineracao/ig_tags.mjs --porta <PORTA> --saida <pasta>/ig-links.json
//        [--tags johndeere7230j,tratorseminovo] [--perfis zanquettaagromaquinas,classificadosagricola] [--rolagens 5]
// Abre UMA aba nova (não mexe nas abas já abertas) e fecha só ela no fim.
// Para (saída 2) no primeiro sinal de aviso, limite, verificação ou login. Se uma hashtag devolver 3 posts ou menos
// duas vezes seguidas, para também (sinal de que o Instagram está segurando a conta).
// Depois: py -3 07-Ferramentas/scripts/mineracao/ig_posts.py <pasta>/ig-links.json --saida <pasta>/ig.json  (sem login)
import fs from 'fs';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const args = process.argv.slice(2);
const opt = (k, d = null) => { const i = args.indexOf(k); return i >= 0 ? (args[i + 1] ?? d) : d; };
const PORT = opt('--porta'), SAIDA = opt('--saida');
const TAGS = (opt('--tags', '') || '').split(',').map(s => s.trim().replace(/^#/, '')).filter(Boolean);
const PERFIS = (opt('--perfis', '') || '').split(',').map(s => s.trim().replace(/^@/, '')).filter(Boolean);
const ROL = parseInt(opt('--rolagens', '5'), 10);
if (!PORT || !SAIDA || (!TAGS.length && !PERFIS.length)) { console.log('faltou --porta, --saida e --tags/--perfis'); process.exit(1); }
const AVISO = /tente novamente mais tarde|try again later|limitamos|we limit|confirme que é você|confirm it.s you|atividade incomum|unusual activity|faça login para|log in to continue|sua conta foi/i;

const nova = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(nova.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;
async function fim(code, msg) { if (msg) console.log(msg); try { ws.close(); } catch {} try { await fetch(`http://127.0.0.1:${PORT}/json/close/${nova.id}`); } catch {} process.exit(code); }

const out = fs.existsSync(SAIDA) ? JSON.parse(fs.readFileSync(SAIDA, 'utf8')) : {};
const alvos = [...TAGS.map(t => ({ tipo: 'tag', nome: t, url: `https://www.instagram.com/explore/tags/${encodeURIComponent(t)}/` })),
               ...PERFIS.map(p => ({ tipo: 'perfil', nome: p, url: `https://www.instagram.com/${p}/reels/` }))];
let pobres = 0;
for (const a of alvos) {
  await send('Page.navigate', { url: a.url }); await sleep(9000);
  const href = await ev('location.href') || '';
  const txt = await ev('document.body.innerText.slice(0,3000)') || '';
  if (AVISO.test(txt) || /accounts\/login|challenge/.test(href)) await fim(2, `PAREI: aviso/login em ${a.tipo} ${a.nome}: ${txt.slice(0, 200)}`);
  const n0 = Object.keys(out).length;
  for (let k = 0; k < ROL; k++) {
    const links = await ev(`[...document.querySelectorAll('a[href*="/reel/"], a[href*="/p/"]')].map(x=>x.getAttribute('href'))`) || [];
    for (const h of links) { const c = (h.match(/\/(?:reel|p)\/([^/?#]+)/) || [])[1]; if (c && !out[c]) out[c] = { origem: `${a.tipo}:${a.nome}`, href: h }; }
    await ev('window.scrollBy(0, 2500)'); await sleep(3000);
  }
  const novos = Object.keys(out).length - n0;
  console.log(`${a.tipo} ${a.nome}: +${novos} posts (total ${Object.keys(out).length})`);
  fs.writeFileSync(SAIDA, JSON.stringify(out, null, 1));
  pobres = (a.tipo === 'tag' && novos <= 3) ? pobres + 1 : 0;
  if (pobres >= 2) await fim(2, 'PAREI: duas hashtags seguidas com 3 posts ou menos (o Instagram pode estar segurando a conta). Tente outro dia.');
  await sleep(7000);
}
await fim(0, 'ok');
