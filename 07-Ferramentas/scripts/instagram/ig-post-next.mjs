// ig-post-next.mjs — posta UM item da fila como Reel no Instagram (BitBrowser).
// Legenda: @tanan usa fila.json; @pedro usa legendas-pedro.json quando o n estiver lá (sem #tananintermediacoes).
// Vídeo: @tanan usa a pasta criativos (originais); @pedro usa SOMENTE os arquivos -pedro em pedro-com-arroba\ (md5 em MD5-PEDRO.txt). Nunca o original.
// Uso:  node ig-post-next.mjs <n> [--conta tanan|pedro] [--md5 <md5esperado>] [--check] [--stop-before-share] [--share-open]
//   sem --conta : @tanan_intermediacoes, porta 56930 (mesmo comportamento de 19/11 08h01).
//   --conta pedro : @pedroabreu.consultor, porta 53688 (aba instagram.com do perfil 8).
//   sem --md5 : usa o md5 de ig-md5-pasta.txt (cópia do md5-pasta.txt do box, nesta pasta).
//   --check   : só confere (fila, pulos, md5, divisão de contas, conta logada, se já está no ar). Não abre o Criar.
//   --stop-before-share : faz tudo até a tela da legenda e PARA (diálogo aberto, nada publicado).
//   --share-open        : retoma um diálogo já na tela da legenda (de --stop-before-share), confere a legenda e compartilha.
// Recusa (exit 1) se o n em divisao-contas.json não for da conta pedida. Ledger único: ig-postados.json (grava a conta).
// No fim, traz de volta a aba do Facebook do mesmo perfil (sem navegar nela).
// Saída: última linha "RESULT {json}" com ok, link, hora do Compartilhar etc. Prints em .\ig-prints\
// Para no primeiro sinal de login/verificação/limite/aviso/termos/erro (exit 2) — não tenta de novo.
import fs from 'fs'; import crypto from 'crypto'; import path from 'path';
import { connect, bringFacebookToFront, ensureVisible, STATE_JS, clickLabel, mouseClick, sleep, ACCOUNTS } from './ig-lib.mjs';
const DIR = 'C:\\Users\\JOAO PEDRO TANAN\\Downloads\\criativos';
const FILA = path.join(DIR, 'fila.json');
const HERE = 'C:\\Users\\Public\\cdp-postador-1811';
const PR = path.join(HERE, 'ig-prints'); fs.mkdirSync(PR, { recursive: true });
const LEDGER = path.join(HERE, 'ig-postados.json');      // n já postados (as duas contas, um só arquivo)
const CACHE = path.join(HERE, 'ig-reels-cache.json');    // código do reel -> 1ª linha da legenda
const DIVISAO = path.join(HERE, 'divisao-contas.json');  // nesta pasta de scripts, NÃO na pasta criativos
const LEGENDAS_PEDRO = path.join(HERE, 'legendas-pedro.json'); // legendas da @pedro, sem #tananintermediacoes
const PEDRO_DIR = path.join(HERE, 'pedro-com-arroba');         // vídeos -pedro (sem selo tanan); NÃO usar a pasta criativos
const MD5_PEDRO = path.join(PEDRO_DIR, 'MD5-PEDRO.txt');
const LOCK = path.join(HERE, 'ig.lock');
const SKIP_N = new Set([35]);                             // n35 T-Cross já no ar desde 16/11
const OLD_V5 = ['12-volkswagen-worker-v5.mp4','15-mercedes-atego-v5.mp4','17-scania-g370-v5.mp4','18-volvo-vm330-v5.mp4','19-scania-r460-v5.mp4','20-ford-cargo-2842-v5.mp4'];
const CONTA_ALIASES = {
  tanan: 'tanan',
  tanan_intermediacoes: 'tanan',
  'tanan-intermediacoes': 'tanan',
  pedro: 'pedro',
  pedroabreu: 'pedro',
  'pedroabreu.consultor': 'pedro'
};
const args = process.argv.slice(2); const n = parseInt(args[0], 10);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? (args[i + 1] || true) : null; };
let md5Want = String(opt('--md5') || '').toLowerCase();
const CHECK = args.includes('--check');
const STOP = args.includes('--stop-before-share'), RESUME = args.includes('--share-open');
const contaArg = opt('--conta');
const contaKey = contaArg ? CONTA_ALIASES[String(contaArg).toLowerCase()] : 'tanan';
const log = (...a) => console.log(new Date().toLocaleTimeString('pt-BR'), ...a);
const ts = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
function done(code, obj) { console.log('RESULT ' + JSON.stringify(obj)); process.exit(code); }
const norm = s => String(s || '').replace(/\r/g, '').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();

if (!contaKey) done(1, { ok: false, erro: 'conta desconhecida: ' + contaArg });
const account = ACCOUNTS[contaKey];
const HANDLE = account.handle;

// ---------- checagens locais ----------
if (!(n >= 6 && n <= 51)) done(1, { ok: false, erro: 'n fora de 6..51' });
if (SKIP_N.has(n)) done(1, { ok: false, erro: `n${n} está na lista de pulos` });
const fila = JSON.parse(fs.readFileSync(FILA, 'utf8'));
const it = fila.find(x => x.n === n); if (!it) done(1, { ok: false, erro: 'n não achado no fila.json' });
if (OLD_V5.includes(it.arquivo)) done(1, { ok: false, erro: 'v5 antiga nunca entra' });
if (!fs.existsSync(DIVISAO)) done(1, { ok: false, erro: 'divisao-contas.json não achado em ' + HERE });
const divItem = (JSON.parse(fs.readFileSync(DIVISAO, 'utf8')).itens || []).find(x => x.n === n);
if (!divItem) done(1, { ok: false, erro: `n${n} não está em divisao-contas.json` });
if (divItem.conta !== account.divisao) done(1, { ok: false, erro: `n${n} é da conta @${divItem.conta}, não de @${account.divisao}`, n, conta_pedida: account.divisao, conta_do_item: divItem.conta });
let arquivoPost = it.arquivo;
let file = path.join(DIR, it.arquivo);
let md5List = path.join(HERE, 'ig-md5-pasta.txt');
if (account.key === 'pedro') {
  if (!/\.mp4$/i.test(it.arquivo)) done(1, { ok: false, erro: 'arquivo da fila não é mp4: ' + it.arquivo });
  arquivoPost = it.arquivo.replace(/\.mp4$/i, '-pedro.mp4');
  file = path.join(PEDRO_DIR, arquivoPost);
  md5List = MD5_PEDRO;
  if (!fs.existsSync(file)) done(1, { ok: false, erro: 'arquivo -pedro não existe: ' + file, n, arquivo: arquivoPost });
}
const ledger = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : [];
if (ledger.some(x => x.n === n || x.arquivo === it.arquivo || x.arquivo === arquivoPost)) done(1, { ok: false, erro: 'já postado (ig-postados.json)', item: ledger.find(x => x.n === n || x.arquivo === it.arquivo || x.arquivo === arquivoPost) });
if (!fs.existsSync(file)) done(1, { ok: false, erro: 'arquivo não existe: ' + file });
const md5 = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
if (!md5Want) { if (fs.existsSync(md5List)) { const ln = fs.readFileSync(md5List, 'utf8').split(/\r?\n/).find(l => l.trim().split(/\s+/).pop() === path.basename(file)); if (ln) md5Want = ln.trim().split(/\s+/)[0].toLowerCase(); } }
if (!md5Want) done(1, { ok: false, erro: account.key === 'pedro' ? 'md5 do arquivo -pedro não achado em MD5-PEDRO.txt' : 'md5 esperado não achado (passe --md5 ou ponha ig-md5-pasta.txt)', md5, arquivo: arquivoPost });
if (md5 !== md5Want) done(1, { ok: false, erro: 'md5 diferente', md5, md5Want, arquivo: arquivoPost });
let legenda = it.legenda, fonteLegenda = 'fila.json';
if (account.key === 'pedro') {
  if (!fs.existsSync(LEGENDAS_PEDRO)) done(1, { ok: false, erro: 'legendas-pedro.json não achado em ' + HERE });
  const capP = (JSON.parse(fs.readFileSync(LEGENDAS_PEDRO, 'utf8')).itens || {})[String(n)];
  if (capP) { legenda = capP; fonteLegenda = 'legendas-pedro.json'; }
}
if (account.key === 'pedro' && /#tananintermediacoes/i.test(legenda)) done(1, { ok: false, erro: 'legenda da @pedro ainda contém #tananintermediacoes', fonteLegenda });
const line1 = legenda.split('\n')[0].trim();
const key = line1.replace(/^[^\p{L}\p{N}]+/u, '').trim();   // "Volvo FH 540 com entrada de R$ 120.400!"
log('item', n, arquivoPost, 'md5 ok', md5, '| conta:', HANDLE, '| fonte legenda:', fonteLegenda, '| chave:', key);

let c = null;
let lockHeld = false;
function writeLock() {
  if (fs.existsSync(LOCK)) {
    let stale = true;
    try {
      const prev = JSON.parse(fs.readFileSync(LOCK, 'utf8'));
      const age = Date.now() - new Date(prev.inicio || 0).getTime();
      if (age >= 0 && age < 20 * 60 * 1000) stale = false;
    } catch {}
    if (!stale) done(1, { ok: false, erro: 'ig.lock já existe (outro post em andamento)', lock: LOCK });
  }
  fs.writeFileSync(LOCK, JSON.stringify({ n, conta: HANDLE, pid: process.pid, inicio: new Date().toISOString() }));
  lockHeld = true;
}
async function finish(code, obj) {
  try { if (c) { try { c.close(); } catch {} c = null; } } catch {}
  try {
    const fb = await bringFacebookToFront(account.port, account.fbTabId);
    log('aba Facebook de volta à frente', fb.id, fb.url);
  } catch (e) { log('aviso: não trouxe a aba do Facebook de volta:', e.message); }
  if (lockHeld) { try { fs.unlinkSync(LOCK); } catch {} lockHeld = false; }
  console.log('RESULT ' + JSON.stringify(obj));
  process.exit(code);
}

writeLock();
c = await connect({ port: account.port, tabId: account.igTabId, findInstagram: account.key === 'pedro' });
// O Chrome não carrega vídeo em aba oculta: a aba do IG precisa estar visível (ativa na janela do perfil).
const vis = await ensureVisible(c);
if (vis !== 'visible') { await finish(2, { ok: false, erro: 'aba do IG não ficou visível: ' + vis }); }
log('aba IG visível @' + HANDLE, 'porta', account.port);
async function st(tag) { const s = await c.ev(STATE_JS); if (tag) { await c.shot(path.join(PR, `n${n}-${ts()}-${tag}.jpg`)); } return s; }
async function guard(tag) {
  const s = await st(tag);
  if (s.flags.length) { log('STOP flags', s.flags, s.text.slice(0, 400)); await finish(2, { ok: false, erro: 'aviso/limite/verificação: ' + s.flags.join(','), etapa: tag, texto: s.text.slice(0, 600) }); }
  return s;
}
async function waitFor(fn, ms = 60000, step = 1500) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(step); } return null; }

// ---------- conta logada ----------
async function checkAccount() {
  await c.nav(`https://www.instagram.com/${HANDLE}/`, 7000);
  const a = await c.ev(`(() => { const t = document.body.innerText; return { url: location.href, edit: /Editar perfil|Edit profile/.test(t), handle: !!document.querySelector('header') && document.querySelector('header').innerText.includes('${HANDLE}') }; })()`);
  if (!a.edit || !a.handle) { await finish(2, { ok: false, erro: 'conta logada não confere com @' + HANDLE, a }); }
  await guard('00-perfil');
  log('conta ok @' + HANDLE);
}
// ---------- reels do perfil (para checar repetição e achar o novo) ----------
async function listReels() {
  await c.nav(`https://www.instagram.com/${HANDLE}/reels/`, 6000);
  const Q = `[...new Set([...document.querySelectorAll('a[href*="/reel/"]')].map(a => (a.getAttribute('href').match(/\\/reel\\/([^/]+)/)||[])[1]).filter(Boolean))]`;
  let codes = await waitFor(async () => { const x = await c.ev(Q); return x && x.length ? x : null; }, 12000, 2000);
  if (!codes) {
    // conta nova (0 posts) pode não ter links de Reels — isso não é erro na conferência
    const empty = await c.ev(`(() => { const t = document.body.innerText || ''; return /ainda n[aã]o (publicou|h[aá] publica[cç][oõ]es)|when you share|no (posts|reels) yet|0 (publica[cç][oõ]es|posts)/i.test(t); })()`);
    if (empty) { log('perfil sem reels ainda (conta nova ou vazia)'); return []; }
    codes = await waitFor(async () => { const x = await c.ev(Q); return x && x.length ? x : null; }, 18000, 2000);
    if (!codes) await finish(2, { ok: false, erro: 'aba Reels do perfil não carregou (não dá para checar repetição)' });
  }
  return codes;
}
async function captionOf(code) {
  await c.nav(`https://www.instagram.com/${HANDLE}/reel/${code}/`, 6000);
  return await c.ev(`(() => { const og = document.querySelector('meta[property="og:description"]')?.content || ''; const m = og.match(/: "([\\s\\S]*)"\\.?\\s*$/); return { og, cap: m ? m[1] : og, vid: !!document.querySelector('video'), time: [...document.querySelectorAll('time[datetime]')].map(t => t.getAttribute('datetime'))[0] || '' }; })()`);
}
async function refreshCache(codes) {
  const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
  for (const code of codes.slice(0, 15)) if (!(code in cache)) { const r = await captionOf(code); cache[code] = (r.cap || '').split('\n')[0].slice(0, 160); }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 1)); return cache;
}

// ---------- fluxo ----------
if (!RESUME) {
  await checkAccount();
  const before = await listReels();
  const cache = await refreshCache(before);
  const dup = Object.entries(cache).find(([k, v]) => v.includes(key));
  if (dup) { await finish(1, { ok: false, erro: 'criativo já está no ar', reel: `https://www.instagram.com/${HANDLE}/reel/${dup[0]}/` }); }
  fs.writeFileSync(path.join(HERE, `ig-before-n${n}.json`), JSON.stringify(before));
  log('não está no ar; reels no perfil:', before.length);
  if (CHECK) { await finish(0, { ok: true, check: true, n, arquivo: arquivoPost, md5, conta: HANDLE, fonte_legenda: fonteLegenda, tem_tananintermediacoes: /#tananintermediacoes/i.test(legenda), reels_no_perfil: before.length }); }
  await c.nav(`https://www.instagram.com/${HANDLE}/`, 6000);
  await c.ev('window.scrollTo(0,0)');
  // @tanan: "Postar"/"Criar"/"Nova publicação". @pedro: o + da barra tem aria-label "Novo post"
  // e abre o menu Criar; "Criar" sozinho às vezes só destaca/fecha o menu, então na pedro não é o 1º rótulo.
  // Nunca usar "Reels" nesta busca global — pega a aba Reels da barra lateral.
  const firstLabels = account.key === 'pedro'
    ? ['Novo post', 'Nova publicação', 'New post', 'Novo', 'New', 'Postar']
    : ['Postar', 'Criar', 'Nova publicação', 'New post', 'Create'];
  const r = await clickLabel(c, firstLabels);
  if (!r) { await st('01-postar-nao-achado'); await finish(2, { ok: false, erro: 'botão Postar/Criar/Novo post não achado' }); }
  log('clique criar:', r.w);
  await sleep(2500);
  let s = await st('01-apos-criar');
  if (!/Selecionar do computador|Select from computer/.test(s.text)) {
    // Menu do botão + ("Criar"): Postar / Vídeo ao vivo / Anúncio. Só Postar. Nunca Anúncio nem ao vivo.
    const menu = await clickLabel(c, ['Postar', 'Post']);
    if (menu) { log('menu criar:', menu.w); await sleep(2500); }
  }
  s = await waitFor(async () => { const x = await st(); return /Selecionar do computador|Select from computer/.test(x.text) ? x : null; }, 15000);
  if (!s) { await guard('01-criar-falhou'); await finish(2, { ok: false, erro: 'diálogo Criar novo post não abriu' }); }
  await guard('01-criar');
  const fi = await c.send('Runtime.evaluate', { expression: `[...document.querySelectorAll('div[role=dialog] input[type=file]')].find(i => /video/.test(i.accept))`, returnByValue: false });
  if (!fi.result?.objectId) { await finish(2, { ok: false, erro: 'input de vídeo não achado' }); }
  await c.send('DOM.setFileInputFiles', { objectId: fi.result.objectId, files: [file] }, 120000);
  log('arquivo enviado ao input');
  // popup "posts de vídeo agora são reels" -> OK
  s = await waitFor(async () => { const x = await st(); if (x.flags.length) return x; if (/compartilhados como reels|shared as reels/i.test(x.text)) { await clickLabel(c, ['OK']); await sleep(1500); return null; } return /Cortar|Crop|Avançar|Next/.test(x.text) && x.btn.some(b => /^(Avançar|Next)$/i.test(b)) ? x : null; }, 90000);
  if (!s) { await guard('02-upload-falhou'); await finish(2, { ok: false, erro: 'tela de corte não apareceu' }); }
  s = await guard('02-corte');
  log('corte:', s.btn.join(' | '));
  // proporção original: abre o seletor de corte e escolhe "Original" se existir
  const crop = await clickLabel(c, ['Selecionar corte', 'Select crop']);
  if (crop) { await sleep(1500); const o = await clickLabel(c, ['Original']); log('corte original', !!o); await sleep(1500); await c.shot(path.join(PR, `n${n}-${ts()}-02b-original.jpg`)); await mouseClick(c, crop.x, crop.y); await sleep(800); }
  else log('sem botão de corte (mantém padrão)');
  for (const etapa of ['03-editar', '04-legenda']) {
    const a = await clickLabel(c, ['Avançar', 'Next']); if (!a) { await guard(etapa + '-falhou'); await finish(2, { ok: false, erro: 'Avançar não achado em ' + etapa }); }
    await sleep(4000); s = await guard(etapa); log(etapa, s.btn.slice(0, 25).join(' | '));
  }
  if (!/Compartilhar|Share/.test(s.btn.join('|'))) { await finish(2, { ok: false, erro: 'tela de legenda não confirmada', btn: s.btn }); }
  // legenda: foca a caixa e digita linha a linha (Enter entre linhas)
  const box = await c.ev(`(() => { const e = document.querySelector('div[role=dialog] [contenteditable=true][role=textbox], div[role=dialog] [aria-label^="Escreva uma legenda"], div[role=dialog] [contenteditable=true]'); if (!e) return null; e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return { x: r.x + 20, y: r.y + 15, len: e.innerText.trim().length }; })()`);
  if (!box) { await finish(2, { ok: false, erro: 'caixa de legenda não achada' }); }
  if (box.len) { await finish(2, { ok: false, erro: 'caixa de legenda já tem texto; parei' }); }
  await mouseClick(c, box.x, box.y); await sleep(500);
  const lines = legenda.replace(/\r/g, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]) await c.send('Input.insertText', { text: lines[i] });
    if (i < lines.length - 1) { await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, shiftKey: false }); await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }); }
    await sleep(150);
  }
  await sleep(1500);
}
// ---------- conferência da tela final (legenda + chaves) ----------
const fin = await c.ev(`(() => { const d = [...document.querySelectorAll('div[role=dialog]')].pop(); const e = d && d.querySelector('[contenteditable=true]'); const sw = [...(d||document).querySelectorAll('input[type=checkbox],[role=switch]')].map(s => ({ label: (s.closest('label')||s.parentElement?.parentElement?.parentElement||s).innerText.replace(/\\s+/g,' ').trim().slice(0,80) || s.getAttribute('aria-label'), on: s.checked ?? (s.getAttribute('aria-checked') === 'true') })); return { cap: e ? e.innerText : null, sw, text: d ? d.innerText.slice(0, 1500) : '' }; })()`);
const capOk = norm(fin.cap) === norm(legenda);
await c.shot(path.join(PR, `n${n}-${ts()}-05-legenda-colada.jpg`));
log('legenda confere:', capOk, '| chaves:', JSON.stringify(fin.sw));
if (!capOk) { await finish(2, { ok: false, erro: 'legenda na caixa ≠ ' + fonteLegenda + ' (não compartilhei)', na_caixa: fin.cap, fonteLegenda }); }
const fbOn = fin.sw.find(x => /facebook/i.test(x.label) && x.on);
if (fbOn) { await finish(2, { ok: false, erro: 'opção de compartilhar no Facebook ligada; não compartilhei', sw: fin.sw }); }
if (STOP) { await finish(0, { ok: true, parado: 'antes do Compartilhar', capOk, sw: fin.sw, texto: fin.text }); }

// ---------- Compartilhar ----------
const before = fs.existsSync(path.join(HERE, `ig-before-n${n}.json`)) ? JSON.parse(fs.readFileSync(path.join(HERE, `ig-before-n${n}.json`), 'utf8')) : [];
const sh = await clickLabel(c, ['Compartilhar', 'Share']);
if (!sh || !sh.inDialog) { await finish(2, { ok: false, erro: 'botão Compartilhar não achado no diálogo' }); }
const shareAt = new Date();
const shareBRT = shareAt.toLocaleString('pt-BR', { timeZone: 'America/Bahia' });
log('Compartilhar clicado', shareBRT);
const res = await waitFor(async () => { const x = await st(); if (x.flags.length) return x; return /compartilhad[oa]|has been shared|foi compartilhado/i.test(x.text) ? x : null; }, 240000, 3000);
await c.shot(path.join(PR, `n${n}-${ts()}-06-pos-compartilhar.jpg`));
if (!res || res.flags.length) { await finish(2, { ok: false, erro: res ? 'aviso após compartilhar: ' + res.flags.join(',') : 'sem confirmação de compartilhado em 4 min', compartilhar_brt: shareBRT, texto: res?.text?.slice(0, 600) }); }
log('confirmado:', res.text.slice(0, 120).replace(/\n/g, ' '));
fs.appendFileSync(LEDGER + '.log', JSON.stringify({ n, arquivo: arquivoPost, md5, conta: HANDLE, compartilhar_brt: shareBRT }) + '\n');
// fecha o diálogo de confirmação
await clickLabel(c, ['Fechar', 'Close']); await sleep(2000);
// ---------- acha o reel novo ----------
let link = null, conf = null;
for (let k = 0; k < 6 && !link; k++) {
  await sleep(k ? 20000 : 8000);
  const now = await listReels();
  const novos = now.filter(x => !before.includes(x));
  for (const code of novos) { const r = await captionOf(code); if (norm(r.cap).startsWith(norm(line1)) || r.cap.includes(key)) { link = `https://www.instagram.com/${HANDLE}/reel/${code}/`; conf = r; break; } }
}
if (!link) { await finish(2, { ok: false, erro: 'compartilhado, mas reel novo não achado no perfil ainda', compartilhar_brt: shareBRT }); }
await sleep(3000);
const capFull = norm(conf.cap) === norm(legenda);
await c.shot(path.join(PR, `n${n}-${ts()}-07-reel-no-ar.jpg`));
const entry = { n, arquivo: arquivoPost, md5, conta: HANDLE, compartilhar_brt: shareBRT, link, video: conf.vid, legenda_ok: capFull, ig_time: conf.time };
ledger.push(entry); fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1));
const cache2 = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {}; cache2[link.split('/reel/')[1].replace('/', '')] = line1; fs.writeFileSync(CACHE, JSON.stringify(cache2, null, 1));
await finish(0, { ok: true, ...entry });
