// ig-postar-lote.mjs — posta um LOTE de Reels no Instagram pelo BitBrowser JÁ LOGADO, em qualquer PC (25/11/2026).
// Mesma lógica do ig-post-next.mjs (validado em 19/11 nas contas @tanan e @pedro), sem nada fixo do PC dos bots:
// a conta, a porta do perfil, a pasta dos vídeos e a entrega (LEGENDAS.md + md5.txt) vêm por parâmetro.
//
// Uso (da pasta raiz do cofre):
//   py -3 07-Ferramentas/scripts/bitbrowser.py porta "NOME DO PERFIL"      -> mostra a PORTA
//   node 07-Ferramentas/scripts/instagram/ig-postar-lote.mjs --conta <@conta> --porta <PORTA>
//        --entrega entregas/<lote> --videos "<pasta dos vídeos neste PC>"
//        [--intervalo-min 60] [--max 3] [--so 01,02] [--check] [--stop-before-share]
//   --check              : só confere tudo (md5, legendas, conta logada, o que já está no ar). Não posta.
//   --stop-before-share  : vai até a legenda colada do 1º item e PARA sem publicar (teste).
//   --intervalo-min N    : espera N minutos entre um post e outro (padrão 60). --max N: no máximo N nesta rodada.
// Ordem: a de LEGENDAS.md. Item já postado (postados.json da entrega ou mesma 1ª linha no perfil) é pulado.
// Para no primeiro sinal de login, verificação, limite, aviso, termos ou erro (saída 2) e não tenta de novo.
// Nunca: Turbinar, anúncio, música, compartilhar no Facebook. Nunca digita senha.
import fs from 'fs'; import crypto from 'crypto'; import path from 'path';
import { connect, ensureVisible, STATE_JS, clickLabel, mouseClick, sleep, listTabs } from './ig-lib.mjs';

const args = process.argv.slice(2);
const opt = (k, d = null) => { const i = args.indexOf(k); return i >= 0 ? (args[i + 1] ?? true) : d; };
const HANDLE = String(opt('--conta', '')).replace(/^@/, '').trim();
const PORT = parseInt(opt('--porta', '0'), 10);
const ENTREGA = path.resolve(String(opt('--entrega', '')));
const VIDEOS = path.resolve(String(opt('--videos', '')));
const INTERVALO = parseFloat(opt('--intervalo-min', '60'));
const MAX = parseInt(opt('--max', '999'), 10);
const SO = opt('--so') ? String(opt('--so')).split(',').map(s => s.trim().padStart(2, '0')) : null;
const CHECK = args.includes('--check'), STOP = args.includes('--stop-before-share');
const log = (...a) => console.log(new Date().toLocaleTimeString('pt-BR'), ...a);
const ts = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const norm = s => String(s || '').replace(/\r/g, '').replace(/ /g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();
function sair(code, obj) { console.log('RESULT ' + JSON.stringify(obj)); process.exit(code); }

if (!HANDLE || !PORT || !fs.existsSync(ENTREGA) || !fs.existsSync(VIDEOS)) sair(1, { ok: false, erro: 'faltou --conta, --porta, --entrega ou --videos (ou a pasta não existe)', HANDLE, PORT, ENTREGA, VIDEOS });
const PR = path.join(VIDEOS, 'ig-prints'); fs.mkdirSync(PR, { recursive: true });
const LEDGER = path.join(ENTREGA, 'postados.json');
const LOCK = path.join(VIDEOS, 'ig.lock');

// ---------- lote: LEGENDAS.md + md5.txt da entrega ----------
const md = fs.readFileSync(path.join(ENTREGA, 'LEGENDAS.md'), 'utf8').replace(/\r/g, '');
const itens = [...md.matchAll(/^## \[[ xX]\] (\d+): `([^`]+)`\n```\n([\s\S]*?)\n```/gm)].map(m => ({ n: m[1].padStart(2, '0'), arquivo: m[2], legenda: m[3].trim() }));
if (!itens.length) sair(1, { ok: false, erro: 'nenhuma legenda achada em LEGENDAS.md' });
const md5s = Object.fromEntries(fs.readFileSync(path.join(ENTREGA, 'md5.txt'), 'utf8').split(/\r?\n/).filter(Boolean).map(l => { const p = l.trim().split(/\s+/); return [p[p.length - 1], p[0].toLowerCase()]; }));
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
const fila = [];
for (const it of itens) {
  if (SO && !SO.includes(it.n)) continue;
  if (ledger.some(x => x.arquivo === it.arquivo && x.conta === HANDLE)) { log(it.n, 'já postado (postados.json): pulei'); continue; }
  const file = path.join(VIDEOS, it.arquivo);
  if (!fs.existsSync(file)) sair(1, { ok: false, erro: 'vídeo não está na pasta: ' + file });
  const md5 = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
  if (!md5s[it.arquivo] || md5s[it.arquivo] !== md5) sair(1, { ok: false, erro: 'md5 diferente do md5.txt da entrega', arquivo: it.arquivo, md5, esperado: md5s[it.arquivo] });
  fila.push({ ...it, file, md5 });
}
log(`lote: ${itens.length} itens | a postar: ${fila.length} | conta @${HANDLE} | porta ${PORT}`);
if (!fila.length) sair(0, { ok: true, nada_a_postar: true });

// ---------- trava (um script por vez no perfil) ----------
if (fs.existsSync(LOCK)) { try { const p = JSON.parse(fs.readFileSync(LOCK, 'utf8')); if (Date.now() - new Date(p.inicio).getTime() < 20 * 60 * 1000) sair(1, { ok: false, erro: 'ig.lock: outro post em andamento' }); } catch {} }
fs.writeFileSync(LOCK, JSON.stringify({ pid: process.pid, inicio: new Date().toISOString() }));
let c = null;
async function fim(code, obj) { try { c && c.close(); } catch {} try { fs.unlinkSync(LOCK); } catch {} sair(code, obj); }

// ---------- conexão: aba do Instagram no perfil já aberto ----------
let tabs = [];
try { tabs = await listTabs(PORT); } catch (e) { await fim(1, { ok: false, erro: 'não conectou na porta ' + PORT + ' (o perfil do BitBrowser está aberto? use bitbrowser.py porta)' }); }
if (!tabs.some(t => /^https:\/\/www\.instagram\.com\//.test(t.url || ''))) {
  await fetch(`http://127.0.0.1:${PORT}/json/new?https://www.instagram.com/`, { method: 'PUT' }); await sleep(6000);
}
c = await connect({ port: PORT, tabId: 'nenhuma', findInstagram: true });
const vis = await ensureVisible(c);
if (vis !== 'visible') await fim(2, { ok: false, erro: 'aba do Instagram não ficou visível: ' + vis });

let N = '';
async function st(tag) { const s = await c.ev(STATE_JS); if (tag) await c.shot(path.join(PR, `${N}-${ts()}-${tag}.jpg`)); return s; }
async function guard(tag) { const s = await st(tag); if (s.flags.length) { log('PAREI', s.flags, s.text.slice(0, 300)); await fim(2, { ok: false, erro: 'aviso/limite/verificação: ' + s.flags.join(','), item: N, etapa: tag, texto: s.text.slice(0, 600) }); } return s; }
async function waitFor(fn, ms = 60000, step = 1500) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(step); } return null; }

async function conferirConta() {
  await c.nav(`https://www.instagram.com/${HANDLE}/`, 7000);
  const a = await c.ev(`(() => { const t = document.body.innerText; return { edit: /Editar perfil|Edit profile/.test(t), handle: !!document.querySelector('header') && document.querySelector('header').innerText.includes(${JSON.stringify(HANDLE)}) }; })()`);
  if (!a.edit || !a.handle) await fim(2, { ok: false, erro: 'a conta logada neste perfil não é @' + HANDLE, a });
  await guard('00-perfil');
}
async function listarReels() {
  await c.nav(`https://www.instagram.com/${HANDLE}/reels/`, 6000);
  const Q = `[...new Set([...document.querySelectorAll('a[href*="/reel/"]')].map(a => (a.getAttribute('href').match(/\\/reel\\/([^/]+)/)||[])[1]).filter(Boolean))]`;
  let codes = await waitFor(async () => { const x = await c.ev(Q); return x && x.length ? x : null; }, 12000, 2000);
  if (!codes) {
    const vazio = await c.ev(`/ainda n[aã]o (publicou|h[aá] publica[cç][oõ]es)|when you share|no (posts|reels) yet|0 (publica[cç][oõ]es|posts)/i.test(document.body.innerText || '')`);
    if (vazio) return [];
    codes = await waitFor(async () => { const x = await c.ev(Q); return x && x.length ? x : null; }, 18000, 2000);
    if (!codes) await fim(2, { ok: false, erro: 'aba Reels do perfil não carregou (não dá para checar repetição)' });
  }
  return codes;
}
async function legendaDo(code) {
  await c.nav(`https://www.instagram.com/${HANDLE}/reel/${code}/`, 6000);
  return await c.ev(`(() => { const og = document.querySelector('meta[property="og:description"]')?.content || ''; const m = og.match(/: "([\\s\\S]*)"\\.?\\s*$/); return { cap: m ? m[1] : og, vid: !!document.querySelector('video') }; })()`);
}

async function postar(it) {
  N = it.n;
  const linha1 = it.legenda.split('\n')[0].trim();
  const chave = linha1.replace(/^[^\p{L}\p{N}]+/u, '').trim();
  const antes = await listarReels();
  for (const code of antes.slice(0, 15)) { const r = await legendaDo(code); if ((r.cap || '').includes(chave)) return { ok: false, pulado: 'já está no ar', reel: `https://www.instagram.com/${HANDLE}/reel/${code}/` }; }
  if (CHECK) return { ok: true, check: true };
  await c.nav(`https://www.instagram.com/${HANDLE}/`, 6000); await c.ev('window.scrollTo(0,0)');
  const r = await clickLabel(c, ['Novo post', 'Nova publicação', 'New post', 'Postar', 'Criar', 'Create']);
  if (!r) { await st('01-criar-nao-achado'); await fim(2, { ok: false, erro: 'botão Criar/Novo post não achado', item: N }); }
  await sleep(2500);
  let s = await st('01-apos-criar');
  if (!/Selecionar do computador|Select from computer/.test(s.text)) { const m = await clickLabel(c, ['Postar', 'Post']); if (m) await sleep(2500); } // só "Postar"; nunca Anúncio nem ao vivo
  s = await waitFor(async () => { const x = await st(); return /Selecionar do computador|Select from computer/.test(x.text) ? x : null; }, 15000);
  if (!s) { await guard('01-criar-falhou'); await fim(2, { ok: false, erro: 'diálogo Criar novo post não abriu', item: N }); }
  await guard('01-criar');
  const fi = await c.send('Runtime.evaluate', { expression: `[...document.querySelectorAll('div[role=dialog] input[type=file]')].find(i => /video/.test(i.accept))`, returnByValue: false });
  if (!fi.result?.objectId) await fim(2, { ok: false, erro: 'campo de vídeo não achado', item: N });
  await c.send('DOM.setFileInputFiles', { objectId: fi.result.objectId, files: [it.file] }, 120000);
  s = await waitFor(async () => { const x = await st(); if (x.flags.length) return x; if (/compartilhados como reels|shared as reels/i.test(x.text)) { await clickLabel(c, ['OK']); await sleep(1500); return null; } return x.btn.some(b => /^(Avançar|Next)$/i.test(b)) ? x : null; }, 90000);
  if (!s) { await guard('02-upload-falhou'); await fim(2, { ok: false, erro: 'tela de corte não apareceu', item: N }); }
  await guard('02-corte');
  const crop = await clickLabel(c, ['Selecionar corte', 'Select crop']);
  if (crop) { await sleep(1500); await clickLabel(c, ['Original']); await sleep(1500); await mouseClick(c, crop.x, crop.y); await sleep(800); }
  for (const etapa of ['03-editar', '04-legenda']) {
    const a = await clickLabel(c, ['Avançar', 'Next']); if (!a) { await guard(etapa + '-falhou'); await fim(2, { ok: false, erro: 'Avançar não achado em ' + etapa, item: N }); }
    await sleep(4000); s = await guard(etapa);
  }
  if (!/Compartilhar|Share/.test(s.btn.join('|'))) await fim(2, { ok: false, erro: 'tela da legenda não confirmada', item: N, btn: s.btn });
  const box = await c.ev(`(() => { const e = document.querySelector('div[role=dialog] [contenteditable=true][role=textbox], div[role=dialog] [contenteditable=true]'); if (!e) return null; e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return { x: r.x + 20, y: r.y + 15, len: e.innerText.trim().length }; })()`);
  if (!box) await fim(2, { ok: false, erro: 'caixa de legenda não achada', item: N });
  if (box.len) await fim(2, { ok: false, erro: 'caixa de legenda já tinha texto; parei', item: N });
  await mouseClick(c, box.x, box.y); await sleep(500);
  const linhas = it.legenda.split('\n');
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i]) await c.send('Input.insertText', { text: linhas[i] });
    if (i < linhas.length - 1) { await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); }
    await sleep(150);
  }
  await sleep(1500);
  const fin = await c.ev(`(() => { const d = [...document.querySelectorAll('div[role=dialog]')].pop(); const e = d && d.querySelector('[contenteditable=true]'); const sw = [...(d||document).querySelectorAll('input[type=checkbox],[role=switch]')].map(s => ({ label: (s.closest('label')||s.parentElement?.parentElement?.parentElement||s).innerText.replace(/\\s+/g,' ').trim().slice(0,80) || s.getAttribute('aria-label'), on: s.checked ?? (s.getAttribute('aria-checked') === 'true') })); return { cap: e ? e.innerText : null, sw }; })()`);
  await c.shot(path.join(PR, `${N}-${ts()}-05-legenda.jpg`));
  if (norm(fin.cap) !== norm(it.legenda)) await fim(2, { ok: false, erro: 'legenda na caixa ≠ LEGENDAS.md (não publiquei)', item: N, na_caixa: fin.cap });
  if (fin.sw.find(x => /facebook/i.test(x.label) && x.on)) await fim(2, { ok: false, erro: 'compartilhar no Facebook está ligado; não publiquei', item: N });
  if (STOP) await fim(0, { ok: true, parado: 'antes do Compartilhar (teste)', item: N });
  const sh = await clickLabel(c, ['Compartilhar', 'Share']);
  if (!sh || !sh.inDialog) await fim(2, { ok: false, erro: 'botão Compartilhar não achado', item: N });
  const hora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  const res = await waitFor(async () => { const x = await st(); if (x.flags.length) return x; return /compartilhad[oa]|has been shared|foi compartilhado/i.test(x.text) ? x : null; }, 240000, 3000);
  await c.shot(path.join(PR, `${N}-${ts()}-06-compartilhado.jpg`));
  if (!res || res.flags.length) await fim(2, { ok: false, erro: res ? 'aviso depois de compartilhar: ' + res.flags.join(',') : 'sem confirmação em 4 min', item: N, hora });
  await clickLabel(c, ['Fechar', 'Close']); await sleep(2000);
  let link = null, conf = null;
  for (let k = 0; k < 6 && !link; k++) {
    await sleep(k ? 20000 : 8000);
    const agora = await listarReels();
    for (const code of agora.filter(x => !antes.includes(x))) { const r2 = await legendaDo(code); if ((r2.cap || '').includes(chave)) { link = `https://www.instagram.com/${HANDLE}/reel/${code}/`; conf = r2; break; } }
  }
  const reg = { n: it.n, arquivo: it.arquivo, md5: it.md5, conta: HANDLE, hora, link: link || 'não achado ainda', legenda_ok: conf ? norm(conf.cap) === norm(it.legenda) : null };
  ledger.push(reg); fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));
  return { ok: true, ...reg };
}

await conferirConta();
const feitos = [];
for (let i = 0; i < fila.length && feitos.filter(x => x.ok && !x.check).length < MAX; i++) {
  const r = await postar(fila[i]);
  log(fila[i].n, JSON.stringify(r)); feitos.push({ n: fila[i].n, ...r });
  const restam = fila.length - i - 1;
  if (!CHECK && r.ok && restam && feitos.filter(x => x.ok).length < MAX) { log(`próximo em ${INTERVALO} min`); await sleep(INTERVALO * 60000); }
}
await fim(0, { ok: true, conta: HANDLE, resultado: feitos });
