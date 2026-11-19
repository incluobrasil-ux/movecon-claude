// ig-edit-caption.mjs — edita a legenda de UM reel já no ar. Não arquiva, não apaga, não toca em Turbinar.
// Uso: node ig-edit-caption.mjs --conta pedro --n 11
import fs from 'fs'; import path from 'path';
import { connect, bringFacebookToFront, ensureVisible, STATE_JS, clickLabel, mouseClick, sleep, ACCOUNTS } from './ig-lib.mjs';

const HERE = 'C:\\Users\\Public\\cdp-postador-1811';
const PR = path.join(HERE, 'ig-prints'); fs.mkdirSync(PR, { recursive: true });
const args = process.argv.slice(2);
const opt = k => { const i = args.indexOf(k); return i >= 0 ? (args[i + 1] || true) : null; };
const n = parseInt(String(opt('--n') || ''), 10);
const contaArg = String(opt('--conta') || 'pedro').toLowerCase();
const log = (...a) => console.log(new Date().toLocaleTimeString('pt-BR'), ...a);
const ts = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const norm = s => String(s || '').replace(/\r/g, '').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();

if (contaArg !== 'pedro') { console.log('RESULT ' + JSON.stringify({ ok: false, erro: 'só --conta pedro neste script' })); process.exit(1); }
if (n !== 11) { console.log('RESULT ' + JSON.stringify({ ok: false, erro: 'este script só edita o n11 já no ar' })); process.exit(1); }

const account = ACCOUNTS.pedro;
const HANDLE = account.handle;
const CODE = 'Df7NSrJONcV';
const LP = path.join(HERE, 'legendas-pedro.json');
if (!fs.existsSync(LP)) { console.log('RESULT ' + JSON.stringify({ ok: false, erro: 'legendas-pedro.json não achado' })); process.exit(1); }
const want = JSON.parse(fs.readFileSync(LP, 'utf8')).itens[String(n)];
if (!want) { console.log('RESULT ' + JSON.stringify({ ok: false, erro: 'n não está em legendas-pedro.json' })); process.exit(1); }
if (/#tananintermediacoes/i.test(want)) { console.log('RESULT ' + JSON.stringify({ ok: false, erro: 'legendas-pedro.json ainda tem #tananintermediacoes' })); process.exit(1); }

let c = null;
async function finish(code, obj) {
  try { if (c) { try { c.close(); } catch {} c = null; } } catch {}
  try {
    const fb = await bringFacebookToFront(account.port, account.fbTabId);
    log('aba Facebook de volta à frente', fb.id, fb.url);
  } catch (e) { log('aviso: não trouxe a aba do Facebook de volta:', e.message); }
  console.log('RESULT ' + JSON.stringify(obj));
  process.exit(code);
}
async function st(tag) { const s = await c.ev(STATE_JS); if (tag) await c.shot(path.join(PR, `edit-n${n}-${ts()}-${tag}.jpg`)); return s; }
async function guard(tag) {
  const s = await st(tag);
  if (s.flags.length) { log('STOP flags', s.flags, s.text.slice(0, 400)); await finish(2, { ok: false, erro: 'aviso/limite/verificação: ' + s.flags.join(','), etapa: tag, texto: s.text.slice(0, 600) }); }
  return s;
}
async function waitFor(fn, ms = 30000, step = 800) { const t0 = Date.now(); while (Date.now() - t0 < ms) { const v = await fn(); if (v) return v; await sleep(step); } return null; }

async function captionOf() {
  return await c.ev(`(() => {
    const og = document.querySelector('meta[property="og:description"]')?.content || '';
    const m = og.match(/: "([\\s\\S]*)"\\.?\\s*$/);
    const vis = [...document.querySelectorAll('h1,span,div')].map(e => e.innerText).find(t => /Jeep Renegade Longitude/.test(t || '')) || '';
    return { og, cap: m ? m[1] : og, vis, url: location.href, vid: !!document.querySelector('video') };
  })()`);
}

c = await connect({ port: account.port, tabId: account.igTabId, findInstagram: true });
const vis = await ensureVisible(c);
if (vis !== 'visible') await finish(2, { ok: false, erro: 'aba do IG não ficou visível: ' + vis });
log('aba IG visível');

await c.nav(`https://www.instagram.com/${HANDLE}/`, 7000);
const a = await c.ev(`(() => { const t = document.body.innerText; return { url: location.href, edit: /Editar perfil|Edit profile/.test(t), handle: !!document.querySelector('header') && document.querySelector('header').innerText.includes('${HANDLE}') }; })()`);
if (!a.edit || !a.handle) await finish(2, { ok: false, erro: 'conta logada não confere com @' + HANDLE, a });
await guard('00-perfil');
log('conta ok @' + HANDLE);

await c.nav(`https://www.instagram.com/${HANDLE}/reel/${CODE}/`, 7000);
await guard('01-reel-antes');
const before = await captionOf();
log('legenda atual (início):', (before.cap || before.vis || '').slice(0, 180).replace(/\n/g, ' | '));
const beforeN = norm(before.cap || before.vis);
if (!/Jeep Renegade Longitude/.test(beforeN) && !/tananintermediacoes/i.test(beforeN)) {
  await finish(2, { ok: false, erro: 'não confirmei que este reel é o Renegade', before });
}
if (norm(before.cap) === norm(want) || (before.vis && norm(before.vis).includes(norm(want).slice(0, 80)) && !/#tananintermediacoes/i.test(beforeN))) {
  // já está como queremos; mesmo assim, se ainda tiver a hashtag, continua
  if (!/#tananintermediacoes/i.test(beforeN)) {
    await finish(0, { ok: true, ja_estava: true, cap: before.cap, link: `https://www.instagram.com/${HANDLE}/reel/${CODE}/` });
  }
}

// acha "Mais opções" no miolo do reel (não na barra esquerda, x>~80)
const mores = await c.ev(`(() => {
  const want = ['mais opções', 'more options', 'opções', 'options'];
  const clean = s => String(s||'').replace(/\\s+/g,' ').trim().toLowerCase();
  const els = [...document.querySelectorAll('button,[role=button],div[tabindex],svg[aria-label]')];
  const hits = [];
  for (const e of els) {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const lab = clean(e.getAttribute('aria-label') || (e.querySelector && e.querySelector('svg[aria-label]')?.getAttribute('aria-label')) || e.innerText);
    if (!lab) continue;
    if (want.some(w => lab === w || lab.includes(w))) {
      hits.push({ lab, x: r.x + r.width/2, y: r.y + r.height/2, w: Math.round(r.width), h: Math.round(r.height) });
    }
  }
  return hits;
})()`);
log('mais opções:', JSON.stringify(mores));
const more = (mores || []).filter(h => h.x > 80).sort((a, b) => a.y - b.y)[0] || (mores || [])[0];
if (!more) await finish(2, { ok: false, erro: 'botão Mais opções não achado', mores });
await mouseClick(c, more.x, more.y);
await sleep(1500);
const menu = await guard('02-menu');
log('menu:', menu.btn.slice(0, 30).join(' | '));
if (menu.flags.length) await finish(2, { ok: false, erro: 'flags no menu' });
const dangerous = menu.btn.filter(b => /^(Arquivar|Excluir|Delete|Archive|Turbinar|Boost)$/i.test(String(b).trim()));
log('itens perigosos visíveis (não vou clicar):', dangerous.join(' | '));
const ed = await clickLabel(c, ['Editar', 'Edit', 'Editar legenda', 'Edit caption']);
if (!ed) await finish(2, { ok: false, erro: 'Editar não achado no menu', btn: menu.btn });
log('clique Editar', ed.w);
await sleep(2500);
const ev = await waitFor(async () => {
  const x = await st();
  if (x.flags.length) return x;
  if (/Editar (legenda|info|publicação)|Edit (caption|info|post)|Concluído|Done|Salvar|Save/i.test(x.text) || x.dialog) return x;
  return null;
}, 20000);
if (!ev || ev.flags.length) await finish(2, { ok: false, erro: ev?.flags?.length ? 'aviso na edição: ' + ev.flags.join(',') : 'diálogo de editar não abriu', texto: ev?.text?.slice(0, 400) });
await guard('03-editar-aberto');

const box = await c.ev(`(() => {
  const d = [...document.querySelectorAll('div[role=dialog]')].pop() || document;
  const e = d.querySelector('[contenteditable=true][role=textbox], [contenteditable=true], textarea');
  if (!e) return null;
  e.scrollIntoView({block:'center'});
  const r = e.getBoundingClientRect();
  return { x: r.x + 20, y: r.y + 15, cap: e.innerText || e.value || '', tag: e.tagName };
})()`);
if (!box) await finish(2, { ok: false, erro: 'caixa de legenda não achada no editar' });
log('legenda na caixa (antes):', norm(box.cap).slice(0, 200).replace(/\n/g, ' | '));
if (norm(box.cap) === norm(want)) {
  log('já está igual; vou só salvar se necessário, ou cancelar se já igual');
}

await mouseClick(c, box.x, box.y); await sleep(400);
// Ctrl+A
await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Control', code: 'ControlLeft', windowsVirtualKeyCode: 17, modifiers: 2 });
await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, modifiers: 2, commands: ['selectAll'] });
await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, modifiers: 2 });
await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Control', code: 'ControlLeft', windowsVirtualKeyCode: 17 });
await sleep(200);
await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
await sleep(200);
const lines = want.replace(/\r/g, '').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i]) await c.send('Input.insertText', { text: lines[i] });
  if (i < lines.length - 1) {
    await c.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await c.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
  }
  await sleep(120);
}
await sleep(800);
const afterBox = await c.ev(`(() => {
  const d = [...document.querySelectorAll('div[role=dialog]')].pop() || document;
  const e = d.querySelector('[contenteditable=true][role=textbox], [contenteditable=true], textarea');
  return e ? (e.innerText || e.value || '') : null;
})()`);
const capOk = norm(afterBox) === norm(want);
await st('04-legenda-nova');
log('legenda confere na caixa:', capOk);
if (!capOk) await finish(2, { ok: false, erro: 'legenda na caixa ≠ legendas-pedro.json (não salvei)', na_caixa: afterBox, want });
if (/#tananintermediacoes/i.test(afterBox || '')) await finish(2, { ok: false, erro: 'a hashtag ainda está na caixa; não salvei' });

const sv = await clickLabel(c, ['Concluído', 'Done', 'Salvar', 'Save']);
if (!sv) await finish(2, { ok: false, erro: 'botão Concluído/Salvar não achado' });
log('clique salvar', sv.w);
const savedAt = new Date();
const savedBRT = savedAt.toLocaleString('pt-BR', { timeZone: 'America/Bahia' });
const saved = await waitFor(async () => {
  const x = await st();
  if (x.flags.length) return x;
  // diálogo fechou ou mensagem de alterado
  if (!x.dialog || /alterado|updated|salvo|saved|concluído/i.test(x.text)) return x;
  return null;
}, 30000);
await st('05-pos-salvar');
if (!saved || saved.flags.length) await finish(2, { ok: false, erro: saved?.flags?.length ? 'aviso ao salvar: ' + saved.flags.join(',') : 'sem confirmação de salvo', texto: saved?.text?.slice(0, 400), salvo_brt: savedBRT });
log('salvo', savedBRT);

await sleep(2000);
await c.nav(`https://www.instagram.com/${HANDLE}/reel/${CODE}/`, 7000);
await sleep(2000);
await guard('06-reel-depois');
const conf = await captionOf();
const ok = norm(conf.cap) === norm(want) || (norm(conf.cap).includes(norm(want).split('\n')[0]) && !/#tananintermediacoes/i.test(conf.cap + ' ' + conf.vis));
const hasTag = /#tananintermediacoes/i.test((conf.cap || '') + ' ' + (conf.vis || '') + ' ' + (conf.og || ''));
log('depois cap:', (conf.cap || '').slice(0, 220).replace(/\n/g, ' | '), '| hashtag?', hasTag, '| vid', conf.vid);
if (hasTag) await finish(2, { ok: false, erro: 'depois de salvar, a hashtag ainda aparece no reel', conf, salvo_brt: savedBRT });
if (!ok) await finish(2, { ok: false, erro: 'depois de salvar, a legenda não confere com legendas-pedro.json', conf, salvo_brt: savedBRT });
await finish(0, { ok: true, n, conta: HANDLE, link: `https://www.instagram.com/${HANDLE}/reel/${CODE}/`, salvo_brt: savedBRT, legenda_ok: true, hashtag_removida: true, video: conf.vid, cap: conf.cap });
