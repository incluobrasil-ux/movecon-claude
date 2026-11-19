// retoma o diálogo "Editar informações" já aberto e clica só em Concluir
import fs from 'fs'; import path from 'path';
import { connect, bringFacebookToFront, ensureVisible, STATE_JS, clickLabel, mouseClick, sleep, ACCOUNTS } from './ig-lib.mjs';
const HERE = 'C:\\Users\\Public\\cdp-postador-1811';
const PR = path.join(HERE, 'ig-prints');
const account = ACCOUNTS.pedro;
const HANDLE = account.handle;
const CODE = 'Df7NSrJONcV';
const want = JSON.parse(fs.readFileSync(path.join(HERE, 'legendas-pedro.json'), 'utf8')).itens['11'];
const log = (...a) => console.log(new Date().toLocaleTimeString('pt-BR'), ...a);
const ts = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const norm = s => String(s || '').replace(/\r/g, '').replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{2,}/g, '\n\n').trim();
let c = null;
async function finish(code, obj) {
  try { if (c) { try { c.close(); } catch {} c = null; } } catch {}
  try { const fb = await bringFacebookToFront(account.port, account.fbTabId); log('aba Facebook de volta à frente', fb.id); }
  catch (e) { log('aviso fb:', e.message); }
  console.log('RESULT ' + JSON.stringify(obj));
  process.exit(code);
}
async function st(tag) { const s = await c.ev(STATE_JS); if (tag) await c.shot(path.join(PR, `edit-n11-${ts()}-${tag}.jpg`)); return s; }

c = await connect({ port: account.port, tabId: account.igTabId, findInstagram: true });
const vis = await ensureVisible(c);
if (vis !== 'visible') await finish(2, { ok: false, erro: 'aba IG não visível: ' + vis });
let s = await st('07-retoma');
log('flags', s.flags, 'dialog', s.dialog, 'btn', (s.btn||[]).slice(0, 25).join(' | '));
if (s.flags.length) await finish(2, { ok: false, erro: 'aviso: ' + s.flags.join(','), texto: s.text.slice(0, 400) });

async function boxCap() {
  return await c.ev(`(() => {
    const d = [...document.querySelectorAll('div[role=dialog]')].pop() || document;
    const e = d.querySelector('[contenteditable=true][role=textbox], [contenteditable=true], textarea');
    return { cap: e ? (e.innerText || e.value || '') : null, title: d.innerText?.slice(0, 200) || '', hasConcluir: /Concluir/.test(d.innerText||'') };
  })()`);
}

let box = await boxCap();
log('dialogo aberto?', !!(box.cap || box.hasConcluir), 'cap len', (box.cap||'').length);

if (!(box.hasConcluir || /Editar informações/.test(s.text))) {
  log('diálogo não está aberto; reabro Editar');
  await c.nav(`https://www.instagram.com/${HANDLE}/reel/${CODE}/`, 7000);
  s = await st('07b-reel');
  if (s.flags.length) await finish(2, { ok: false, erro: 'aviso no reel: ' + s.flags.join(',') });
  const mores = await c.ev(`(() => {
    const want = ['mais opções', 'more options'];
    const clean = x => String(x||'').replace(/\\s+/g,' ').trim().toLowerCase();
    const hits = [];
    for (const e of document.querySelectorAll('button,[role=button],div[tabindex],svg[aria-label]')) {
      const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const lab = clean(e.getAttribute('aria-label') || e.querySelector?.('svg[aria-label]')?.getAttribute('aria-label') || e.innerText);
      if (want.some(w => lab === w || lab.includes(w))) hits.push({ lab, x: r.x+r.width/2, y: r.y+r.height/2 });
    }
    return hits;
  })()`);
  const more = (mores||[]).filter(h => h.x > 80)[0];
  if (!more) await finish(2, { ok: false, erro: 'Mais opções não achado' });
  await mouseClick(c, more.x, more.y); await sleep(1200);
  s = await st('07c-menu');
  const ed = await clickLabel(c, ['Editar', 'Edit']);
  if (!ed) await finish(2, { ok: false, erro: 'Editar não achado', btn: s.btn });
  await sleep(2000);
  s = await st('07d-editar');
  box = await boxCap();
}

if (box.cap && norm(box.cap) !== norm(want)) {
  await finish(2, { ok: false, erro: 'legenda na caixa ≠ legendas-pedro.json; não vou concluir', na_caixa: box.cap });
}
if (box.cap && /#tananintermediacoes/i.test(box.cap)) {
  await finish(2, { ok: false, erro: 'hashtag ainda na caixa; não vou concluir' });
}
log('caixa ok, vou clicar Concluir');
const okBtn = await clickLabel(c, ['Concluir', 'Concluído', 'Done']);
if (!okBtn) await finish(2, { ok: false, erro: 'botão Concluir não achado', btn: (await st()).btn });
log('clique', okBtn.w);
const savedAt = new Date();
const savedBRT = savedAt.toLocaleString('pt-BR', { timeZone: 'America/Bahia' });
const t0 = Date.now();
let closed = false;
while (Date.now() - t0 < 25000) {
  await sleep(1000);
  const now = await st();
  if (now.flags.length) await finish(2, { ok: false, erro: 'aviso ao concluir: ' + now.flags.join(','), texto: now.text.slice(0, 400), salvo_brt: savedBRT });
  const still = await boxCap();
  if (!now.dialog || !still.hasConcluir) { closed = true; break; }
}
await st('08-pos-concluir');
if (!closed) await finish(2, { ok: false, erro: 'diálogo ainda aberto depois de Concluir', salvo_brt: savedBRT });
log('diálogo fechou', savedBRT);

await sleep(2000);
await c.nav(`https://www.instagram.com/${HANDLE}/reel/${CODE}/`, 8000);
await sleep(2000);
const after = await st('09-reel-depois');
if (after.flags.length) await finish(2, { ok: false, erro: 'aviso no reel: ' + after.flags.join(','), salvo_brt: savedBRT });
const conf = await c.ev(`(() => {
  const og = document.querySelector('meta[property="og:description"]')?.content || '';
  const m = og.match(/: "([\\s\\S]*)"\\.?\\s*$/);
  const body = document.body.innerText || '';
  return { og, cap: m ? m[1] : og, hasTag: /tananintermediacoes/i.test(og + ' ' + body), vid: !!document.querySelector('video'), url: location.href };
})()`);
log('depois cap:', (conf.cap||'').slice(0, 260).replace(/\n/g,' | '), '| hashtag?', conf.hasTag, '| vid', conf.vid);
if (conf.hasTag) await finish(2, { ok: false, erro: 'hashtag ainda aparece no reel', conf, salvo_brt: savedBRT });
const ok = norm(conf.cap) === norm(want) || (norm(conf.cap).startsWith(norm(want).split('\n')[0]) && !conf.hasTag);
if (!ok) await finish(2, { ok: false, erro: 'legenda no reel não confere', conf, want_inicio: want.slice(0, 120), salvo_brt: savedBRT });
await finish(0, { ok: true, n: 11, conta: HANDLE, link: `https://www.instagram.com/${HANDLE}/reel/${CODE}/`, salvo_brt: savedBRT, legenda_ok: true, hashtag_removida: true, video: conf.vid, cap: conf.cap });
