// ig-responder-comentarios.mjs: responde com o WhatsApp do operador os comentários que estão sem resposta (27/11/2026).
// Autorizado pelo gestor (Samuel) em 27/11/2026. Ver 02-Funcoes/Respondedor de comentarios.md.
// Só a mensagem padrão ("me chama no WhatsApp"). Nunca valor, conversa, Direct, curtida ou seguir.
//
// Uso (da pasta raiz do cofre, com o BitBrowser aberto e o perfil da conta aberto e logado):
//   node 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs --conta @conta --perfil "NOME NO BITBROWSER" --whatsapp 5577999999999 --testar
//   --testar          só mostra o que responderia. Não escreve nada no Instagram.
//   --ensaiar <post>  abre o post (link ou código), clica em "Responder" no 1º comentário, escreve e clica em "Postar",
//                     mas o envio é BLOQUEADO no navegador: mostra se ia sair dentro da conversa. Nada é publicado.
//   (sem --testar)    responde de verdade. --uma-vez: uma rodada e sai. Sem --uma-vez: repete a cada --intervalo-min.
//   --agendar         cria a tarefa do Windows que roda uma rodada a cada --intervalo-min (padrão 20), sem abrir janela.
//   --desagendar      apaga a tarefa.   --liberar: tira a trava depois de uma parada (só depois de conferir a conta).
//   --preparar        só escreve os arquivos que a tarefa usa (.cmd e .vbs), sem criar a tarefa.
//   --porta N         porta do perfil, no lugar de --perfil.
//   --posts 12  --dias 30  --max-por-rodada 8  --max-por-dia 60  --intervalo-min 20
// Como funciona: abre uma aba própria em segundo plano no perfil do BitBrowser, lê os posts e os comentários pelos dados
// que a própria página do Instagram carrega, e responde pela tela, como uma pessoa: "Responder", escreve, "Postar".
// Antes de o envio sair, confere que vai como RESPOSTA ao comentário certo (o navegador arredonda o número do
// comentário e a resposta sairia solta: a ferramenta corrige o número). Depois, confere que ficou dentro da conversa.
// Se não for resposta, bloqueia o envio e para (ver conferirEnvio).
// Responde só comentário principal (não a resposta dentro de uma conversa), de outra pessoa, sem resposta da conta,
// dos últimos --dias dias, nos --posts posts mais novos (grade e aba Reels). Em post com muitos comentários, olha os
// que a página mostra primeiro (cerca de 15). Comentário negativo ("golpe" etc.), propaganda e "já te chamei" não
// recebem resposta automática: vão para uma lista para o operador ver.
// Para no primeiro sinal de login, verificação, limite, bloqueio ou erro ao responder (saída 2), trava a conta até
// --liberar e mostra um aviso na tela. Não abre nem fecha perfil (perfil fechado = pula a rodada).
// Não roda junto com a postagem (ig-postar-lote.mjs): se houver post em andamento na conta, pula a rodada.
// Fora do cofre, em %USERPROFILE%\.movecon\: o número (id) dos comentários respondidos, a lista para ver e o log.
import fs from 'fs'; import path from 'path'; import os from 'os';
import { execFileSync, spawn } from 'child_process'; import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const opt = (k, d = null) => { const i = args.indexOf(k); return i >= 0 && i + 1 < args.length && !String(args[i + 1]).startsWith('--') ? args[i + 1] : d; };
const tem = k => args.includes(k);
const CONTA = String(opt('--conta', '')).replace(/^@/, '').trim().toLowerCase();
const PERFIL = opt('--perfil');
const PORTA = parseInt(opt('--porta', '0'), 10) || 0;
let ZAP = String(opt('--whatsapp', '')).replace(/\D/g, '');
if (/^\d{10,11}$/.test(ZAP)) ZAP = '55' + ZAP;
const ENSAIAR = opt('--ensaiar');
const TESTAR = tem('--testar') || !!ENSAIAR;
const UMA = tem('--uma-vez') || TESTAR;
const INTERVALO = Math.max(5, Math.round(parseFloat(opt('--intervalo-min', '20')) || 20));
const POSTS = Math.max(1, parseInt(opt('--posts', '12'), 10) || 12);
const DIAS = Math.max(1, parseFloat(opt('--dias', '30')) || 30);
const MAXR = Math.max(1, parseInt(opt('--max-por-rodada', '8'), 10) || 8);
const MAXD = Math.max(1, parseInt(opt('--max-por-dia', '60'), 10) || 60);

const PASTA = path.join(os.homedir(), '.movecon');
const LOGS = path.join(PASTA, 'logs');
fs.mkdirSync(LOGS, { recursive: true });
const ESTADO = path.join(PASTA, `comentarios-${CONTA}.json`);
const TRAVA = path.join(PASTA, `comentarios-${CONTA}.lock`);
const POSTANDO = path.join(PASTA, `postando-${CONTA}.lock`); // escrita pelo ig-postar-lote.mjs durante cada post
const PARA_VER = path.join(PASTA, `comentarios-${CONTA}-para-ver.txt`);
const TAREFA = `MOVECON comentarios ${CONTA}`;

const log = (...a) => console.log(new Date().toLocaleString('pt-BR'), ...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const espera = (a, b) => sleep(a + Math.random() * (b - a));
class Parar extends Error {} // problema na conta: trava até --liberar (saída 2)
class Pular extends Error {} // nada a fazer agora (perfil fechado, outra rodada ou post rodando): tenta na próxima
const sair = (code, msg) => { if (msg) console.log(msg); process.exit(code); };

// ---------- mensagem ----------
function formatar(z) { const ddd = z.slice(2, 4), n = z.slice(4); return `(${ddd}) ${n.length === 9 ? n.slice(0, 5) + '-' + n.slice(5) : n.slice(0, 4) + '-' + n.slice(4)}`; }
const NUM = /^55\d{10,11}$/.test(ZAP) ? formatar(ZAP) : '';
// Compliance (01-Regras/Compliance.md, B): sem valor, sem prazo, sem promessa de contemplação.
const MODELOS = [
  u => `@${u} Oi! Me chama no WhatsApp ${NUM} que eu te explico tudo 😉`,
  u => `@${u} Te passo todos os detalhes no WhatsApp: ${NUM}. É só chamar!`,
  u => `@${u} Opa! Chama no WhatsApp ${NUM} que eu monto a simulação pra você.`,
  u => `@${u} Me chama no WhatsApp ${NUM} e fala que veio do Instagram 👊`,
  u => `@${u} Oi! Manda um oi no WhatsApp ${NUM} que eu te atendo por lá.`,
  u => `@${u} Chama no WhatsApp ${NUM} que eu te explico como funciona.`,
  u => `@${u} Fala! Meu WhatsApp é ${NUM}, me chama lá que eu te passo tudo.`,
  u => `@${u} Bora conversar? Me chama no WhatsApp ${NUM} 📲`
];
const NEGATIVO = /golp|fraud|engan|furad|roub|ladr[aã]o|pir[aâ]mide|reclame ?aqui|procon|mentir|den[uú]nci|safad|picaret/i;
const PROPAGANDA = /https?:\/\/|www\.|bit\.ly|\bpromot(e|ion)\b|\bdm\b|collab|onlyfans|renda extra|ganhe dinheiro|seguidores|send (us )?(a )?(pic|photo)/i;
const JA_CHAMOU = /\b(j[aá] )?(te )?chamei\b|\bte mandei\b|mandei (uma )?(mensagem|msg|um oi|zap|whats)/i;

// ---------- estado (fora do cofre; só ids) ----------
const hoje = () => new Date().toLocaleDateString('sv-SE');
function lerEstado() {
  const base = { respondidos: {}, dias: {}, posts: {}, vistos: {}, parado: null, falhas: 0, ultimoModelo: -1 };
  try { return { ...base, ...JSON.parse(fs.readFileSync(ESTADO, 'utf8')) }; } catch { return base; }
}
function salvarEstado(e) {
  const limite = Date.now() - 90 * 864e5;
  for (const m of [e.respondidos, e.vistos]) for (const [k, v] of Object.entries(m)) if (new Date(v).getTime() < limite) delete m[k];
  const dias = Object.keys(e.dias).sort(); while (dias.length > 14) delete e.dias[dias.shift()];
  fs.writeFileSync(ESTADO, JSON.stringify(e, null, 1));
}
const fresco = (arq, min) => { try { return Date.now() - new Date(JSON.parse(fs.readFileSync(arq, 'utf8')).inicio).getTime() < min * 60e3; } catch { return false; } };
function pegarTrava() {
  if (fresco(TRAVA, 30)) throw new Pular('outra rodada desta conta ainda está rodando');
  if (fresco(POSTANDO, 15)) throw new Pular('tem post sendo publicado nesta conta agora');
  fs.writeFileSync(TRAVA, JSON.stringify({ pid: process.pid, inicio: new Date().toISOString() }));
}
function soltarTrava() { try { const t = JSON.parse(fs.readFileSync(TRAVA, 'utf8')); if (t.pid === process.pid) fs.unlinkSync(TRAVA); } catch {} }
function avisarNaTela(msg) {
  if (process.platform !== 'win32') return;
  const s = x => "'" + String(x).replace(/'/g, "''") + "'";
  const ps = `Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show(${s(msg)}, ${s('MOVECON: respostas automáticas paradas')}) | Out-Null`;
  try { spawn('powershell.exe', ['-NoProfile', '-WindowStyle', 'Hidden', '-Command', ps], { detached: true, stdio: 'ignore' }).unref(); } catch {}
}

// ---------- BitBrowser e navegador (CDP) ----------
async function bit(rota, corpo = {}) {
  const r = await fetch('http://127.0.0.1:54345' + rota, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo), signal: AbortSignal.timeout(20000) });
  return r.json();
}
async function acharPorta() {
  if (PORTA) return PORTA;
  let lista;
  try { lista = (await bit('/browser/list', { page: 0, pageSize: 200 }))?.data?.list || []; }
  catch { throw new Pular('o BitBrowser está fechado (a API local não respondeu)'); }
  const nome = String(PERFIL).trim();
  let achou = lista.filter(b => b.id === nome || String(b.name || '').trim() === nome);
  if (!achou.length) achou = lista.filter(b => String(b.name || '').trim().toLowerCase() === nome.toLowerCase());
  if (achou.length !== 1) throw new Error(`perfil ${achou.length ? 'com nome repetido' : 'não encontrado'} no BitBrowser: "${nome}". Use o nome exato.`);
  const portas = (await bit('/browser/ports'))?.data || {};
  const p = parseInt(portas[achou[0].id], 10);
  if (!p) throw new Pular(`o perfil "${achou[0].name}" está fechado no BitBrowser`);
  return p;
}
function conectar(url) {
  const ws = new WebSocket(url);
  const pronto = new Promise((r, j) => { const t = setTimeout(() => j(new Error('o navegador não respondeu')), 15000); ws.onopen = () => { clearTimeout(t); r(); }; ws.onerror = () => { clearTimeout(t); j(new Error('o navegador recusou a conexão')); }; });
  let id = 0; const pend = new Map(); const ouvintes = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.j(new Error(JSON.stringify(m.error))) : p.r(m.result); } else if (m.method) for (const f of ouvintes) f(m); };
  const send = (method, params = {}, to = 60000) => new Promise((r, j) => { const i = ++id; const t = setTimeout(() => { pend.delete(i); j(new Error('o navegador demorou: ' + method)); }, to); pend.set(i, { r: v => { clearTimeout(t); r(v); }, j: e => { clearTimeout(t); j(e); } }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { pronto, send, on: f => ouvintes.push(f), fechar: () => { try { ws.close(); } catch {} } };
}
async function abrirAba(porta) {
  let ver;
  try { ver = await (await fetch(`http://127.0.0.1:${porta}/json/version`, { signal: AbortSignal.timeout(10000) })).json(); }
  catch { throw new Pular(`o perfil não respondeu na porta ${porta} (fechado?)`); }
  const nav = conectar(ver.webSocketDebuggerUrl); await nav.pronto;
  const { targetId } = await nav.send('Target.createTarget', { url: 'about:blank', background: true });
  const fecharAba = async () => { try { await nav.send('Target.closeTarget', { targetId }, 10000); } catch {} nav.fechar(); };
  let tab = null;
  for (let i = 0; i < 30 && !tab; i++) { await sleep(300); tab = (await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json()).find(t => t.id === targetId && t.webSocketDebuggerUrl); }
  if (!tab) { await fecharAba(); throw new Error('a aba nova não apareceu no navegador'); }
  const pg = conectar(tab.webSocketDebuggerUrl); await pg.pronto;
  // guarda o que a página do Instagram carrega (os mesmos dados que aparecem na tela)
  const respostas = []; const pedidos = new Map();
  pg.on(async m => {
    if (m.method === 'Network.requestWillBeSent') { if (/instagram\.com\/(api\/graphql|graphql\/query|api\/v1\/)/.test(m.params.request.url)) pedidos.set(m.params.requestId, m.params.request.url); }
    else if (m.method === 'Network.loadingFinished' && pedidos.has(m.params.requestId)) {
      const url = pedidos.get(m.params.requestId); pedidos.delete(m.params.requestId);
      try { const b = await pg.send('Network.getResponseBody', { requestId: m.params.requestId }, 20000); respostas.push({ url, corpo: b.base64Encoded ? Buffer.from(b.body, 'base64').toString('utf8') : b.body }); } catch {}
    }
  });
  // conferência do envio: enquanto ligada, todo pedido que não é leitura para aqui antes de sair do navegador.
  // filtro(corpo) devolve null (segue), { acao: 'barrar' } ou { acao: 'trocar', corpo }. Na dúvida, barra.
  let filtro = null, sondaVista = false; const SONDA = 'sonda_movecon=' + Math.random().toString(36).slice(2);
  pg.on(async m => {
    if (m.method !== 'Fetch.requestPaused') return;
    const { requestId, request: r } = m.params;
    const leitura = /^(GET|HEAD|OPTIONS)$/i.test(r.method);
    let d = null;
    try {
      if (filtro && !leitura) {
        let corpo = r.postData || '';
        if (!corpo && r.postDataEntries) corpo = r.postDataEntries.map(e => Buffer.from(e.bytes || '', 'base64').toString('utf8')).join('');
        if (corpo === SONDA) { sondaVista = true; d = { acao: 'barrar' }; }
        else if (!corpo && r.hasPostData) d = { acao: 'barrar' };
        else d = filtro(corpo);
      }
    } catch { d = { acao: 'barrar' }; }
    try {
      if (d?.acao === 'barrar') await pg.send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' });
      else if (d?.acao === 'trocar') await pg.send('Fetch.continueRequest', { requestId, postData: Buffer.from(d.corpo, 'utf8').toString('base64') });
      else await pg.send('Fetch.continueRequest', { requestId });
    } catch {}
  });
  await pg.send('Network.enable', {}); await pg.send('Page.enable');
  await pg.send('Network.setBypassServiceWorker', { bypass: true }); // sem isso, parte dos pedidos escapa da conferência
  const ev = async (expr, to = 60000) => { const r = await pg.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, to); if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result?.value; };
  // liga a conferência e prova que ela pega os pedidos (uma sonda que é barrada e nunca sai). false = não ligou.
  const vigiar = async f => {
    filtro = f; sondaVista = false;
    await pg.send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] });
    try { await ev(`fetch('/api/graphql', { method: 'POST', body: ${JSON.stringify(SONDA)}, credentials: 'include' }).then(() => 0, () => 0)`, 15000); } catch {}
    for (let i = 0; i < 20 && !sondaVista; i++) await sleep(150);
    return sondaVista;
  };
  const soltar = async () => { filtro = null; try { await pg.send('Fetch.disable'); } catch {} };
  const navegar = async url => {
    respostas.length = 0;
    await pg.send('Page.navigate', { url });
    for (let i = 0; i < 50; i++) {
      await sleep(500);
      let s; try { s = await ev('({ href: location.href, path: location.pathname, pronto: document.readyState })', 10000); } catch { continue; }
      if (!s.href.startsWith('https://www.instagram.com/')) continue;
      if (/^\/(accounts\/login|challenge|checkpoint|accounts\/suspended|accounts\/disabled)/.test(s.path)) throw new Parar(`o Instagram abriu ${s.path} (login, verificação ou bloqueio)`);
      if (s.pronto !== 'loading') return s;
    }
    throw new Pular('a página do Instagram não carregou (internet?)');
  };
  const esperarDados = async (teste, ms = 15000) => { const ate = Date.now() + ms; while (Date.now() < ate) { if (respostas.some(r => teste(r.corpo))) return true; await sleep(500); } return false; };
  return { ev, cdp: (m, p) => pg.send(m, p), navegar, respostas, esperarDados, vigiar, soltar, fechar: async () => { await soltar(); pg.fechar(); await fecharAba(); } };
}

// ---------- dados que a página carregou ----------
// números de 16+ dígitos (ids) viram texto antes do JSON.parse, para não perder precisão
const aspasNosIds = t => String(t || '').replace(/("\w+"\s*:\s*)(-?\d{16,})(?=\s*[,}\]])/g, '$1"$2"');
function lerJSON(t) {
  const s = aspasNosIds(String(t || '').replace(/^for \(;;\);/, ''));
  try { return [JSON.parse(s)]; } catch {}
  const out = []; for (const linha of s.split(/\r?\n/)) { try { out.push(JSON.parse(linha)); } catch {} }
  return out;
}
function acharObjetos(raizes, teste) {
  const out = []; const pilha = [...raizes];
  while (pilha.length) { const o = pilha.pop(); if (!o || typeof o !== 'object') continue; if (!Array.isArray(o) && teste(o)) out.push(o); for (const v of Object.values(o)) if (v && typeof v === 'object') pilha.push(v); }
  return out;
}
const tem_ = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const ehMidia = o => typeof o.code === 'string' && o.pk != null && tem_(o, 'comment_count');
const ehComentario = o => o.pk != null && typeof o.text === 'string' && o.user && typeof o.user === 'object' && tem_(o, 'created_at') && (tem_(o, 'child_comment_count') || tem_(o, 'parent_comment_id'));
const doUsuario = x => String(x?.user?.pk ?? x?.user?.id ?? x?.user_id ?? '');
const limpo = s => String(s || '').replace(/\s+/g, ' ').trim();
const prefixo = s => limpo(s).slice(0, 25);

async function lerPosts(aba) {
  const midias = new Map(); let dono = '';
  const guardar = (m, doPerfil) => {
    const u = (m.user?.username || m.owner?.username || '').toLowerCase();
    if (u && u !== CONTA) return;
    if (!u && !doPerfil) return;
    if (u === CONTA && !dono) dono = String(m.user?.pk ?? m.user?.id ?? m.owner?.pk ?? m.owner?.id ?? '');
    midias.set(m.code, { ...midias.get(m.code), ...m });
  };
  const juntar = () => { for (const r of aba.respostas) { const doPerfil = /clips_connection|user_timeline_graphql_connection/.test(r.corpo); for (const m of acharObjetos(lerJSON(r.corpo), ehMidia)) guardar(m, doPerfil); } };
  await aba.navegar(`https://www.instagram.com/${CONTA}/reels/`);
  await aba.esperarDados(c => c.includes('clips_connection'));
  juntar();
  await espera(1500, 3000);
  await aba.navegar(`https://www.instagram.com/${CONTA}/`);
  await aba.esperarDados(c => c.includes('user_timeline_graphql_connection'));
  juntar();
  for (const t of await aba.ev(`[...document.querySelectorAll('script[type="application/json"]')].map(s => s.textContent).filter(t => t.includes('comment_count'))`)) for (const m of acharObjetos(lerJSON(t), ehMidia)) guardar(m, false);
  // logado na conta certa: pelo cookie do Instagram (id de quem está logado = dono dos posts) ou pelo "Editar perfil"
  // (em aba de segundo plano a tela pode demorar a desenhar: espera até 8 s)
  let meu = false;
  try { const ck = await aba.cdp('Network.getCookies', { urls: ['https://www.instagram.com/'] }); const uid = (ck.cookies || []).find(c => c.name === 'ds_user_id')?.value || ''; if (uid && dono) meu = uid === dono; } catch {}
  for (let i = 0; i < 16 && !meu; i++) { meu = await aba.ev(`/Editar perfil|Edit profile/.test(document.body.innerText)`); if (!meu) await sleep(500); }
  const lista = [...midias.values()].sort((a, b) => (BigInt(String(b.pk)) > BigInt(String(a.pk)) ? 1 : -1));
  return { posts: lista.slice(0, POSTS), dono, meu };
}

// ---------- tela do post (como uma pessoa) ----------
const BASE_JS = `
  const clean = s => String(s || '').replace(/\\s+/g, ' ').trim();
  const VER = /^(—\\s*)?(Ver (todas as )?(\\d+ )?respostas?( \\(\\d+\\))?|Ver mais respostas|View (all )?(\\d+ )?repl(y|ies)( \\(\\d+\\))?|View more replies)$/i;
  const responderBtns = () => [...document.querySelectorAll('[role=button]')].filter(b => /^(Responder|Reply)$/.test(clean(b.innerText)));
  // o bloco de um comentário = o 1º elemento acima do botão "Responder" que tem link de perfil; o autor é o 1º link de perfil dele
  const autorDe = el => { const a = [...el.querySelectorAll('a[href]')].find(x => /^\\/[A-Za-z0-9._]+\\/$/.test(x.getAttribute('href'))); return a ? a.getAttribute('href').slice(1, -1).toLowerCase() : null; };
  const bloco = (user, pre) => {
    for (const b of responderBtns()) {
      let el = b;
      for (let i = 0; i < 10 && el; i++) {
        el = el.parentElement; if (!el) break;
        const autor = autorDe(el);
        if (autor) { if (autor === user.toLowerCase() && clean(el.innerText).includes(pre)) return { el, b }; break; }
      }
    }
    return null;
  };
  const caixa = () => document.querySelector('textarea[aria-label^="Adicione um coment"], textarea[placeholder^="Adicione um coment"], textarea[aria-label^="Add a comment"]') || document.querySelector('form textarea');
  const setar = (ta, v) => { Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, v); ta.dispatchEvent(new Event('input', { bubbles: true })); };
`;
const verRespostasJS = (user, pre) => `(() => { ${BASE_JS}
  const a = bloco(${JSON.stringify(user)}, ${JSON.stringify(pre)}); if (!a) return 'sem-bloco';
  let el = a.el;
  for (let i = 0; i < 6 && el; i++) {
    el = el.parentElement; if (!el) break;
    const v = [...el.querySelectorAll('[role=button],span,div')].find(x => VER.test(clean(x.innerText)));
    if (v) { if (responderBtns().filter(b => el.contains(b)).length !== 1) return 'ambiguo'; (v.closest('[role=button]') || v).click(); return 'ok'; }
  }
  return 'sem-botao';
})()`;
const donoNaConversaJS = (user, pre, dono) => `(() => { ${BASE_JS}
  const a = bloco(${JSON.stringify(user)}, ${JSON.stringify(pre)}); if (!a) return false;
  let el = a.el;
  for (let i = 0; i < 6 && el; i++) {
    el = el.parentElement; if (!el) break;
    if (responderBtns().filter(b => el.contains(b)).length > 1 || /Ocultar respostas|Hide replies/i.test(el.innerText)) {
      return [...el.querySelectorAll('a[href="/' + ${JSON.stringify(dono)} + '/"]')].some(x => clean(x.innerText) === ${JSON.stringify(dono)});
    }
  }
  return false;
})()`;
const clicarResponderJS = (user, pre) => `(() => { ${BASE_JS}
  const a = bloco(${JSON.stringify(user)}, ${JSON.stringify(pre)}); if (!a) return 'sem-bloco';
  a.b.scrollIntoView({ block: 'center' }); a.b.click(); return 'ok';
})()`;
// confere que a caixa abriu como resposta para a pessoa ("@fulano ") e põe o cursor no fim, para digitar o resto
const prepararCaixaJS = user => `(() => { ${BASE_JS}
  const ta = caixa(); if (!ta) return { ok: false, erro: 'caixa de comentário não achada' };
  const antes = ta.value;
  if (antes.toLowerCase() !== '@' + ${JSON.stringify(user.toLowerCase())} + ' ') return { ok: false, erro: 'a caixa não abriu como resposta para @' + ${JSON.stringify(user)}, antes };
  ta.focus(); ta.setSelectionRange(antes.length, antes.length);
  return { ok: document.activeElement === ta, antes };
})()`;
// acha o botão "Postar" da caixa; só clica se não for ensaio
const postarJS = (texto, soConferir) => `(() => { ${BASE_JS}
  const ta = caixa(); if (!ta) return { ok: false, erro: 'caixa de comentário sumiu' };
  if (ta.value !== ${JSON.stringify(texto)}) return { ok: false, erro: 'o texto na caixa ficou diferente', valor: ta.value };
  const PUB = /^(Postar|Publicar|Post)$/i;
  let raiz = ta; for (let i = 0; i < 6 && raiz.parentElement; i++) { raiz = raiz.parentElement; if ([...raiz.querySelectorAll('[role=button],button')].some(b => PUB.test(clean(b.innerText)))) break; }
  const pub = [...raiz.querySelectorAll('[role=button],button')].find(b => PUB.test(clean(b.innerText)));
  if (!pub) return { ok: false, erro: 'o botão Postar não apareceu' };
  if (pub.getAttribute('aria-disabled') === 'true' || pub.disabled) return { ok: false, erro: 'o botão Postar está desligado' };
  if (${soConferir ? 'true' : 'false'}) return { ok: true, ensaio: true, botao: clean(pub.innerText) };
  pub.click(); return { ok: true };
})()`;
const depoisJS = texto => `(() => { ${BASE_JS}
  const ta = caixa();
  const avisos = [...document.querySelectorAll('[role=dialog],[role=alert],[role=status]')].map(d => clean(d.innerText)).join(' | ');
  const erro = /não foi possível|nao foi possivel|tente novamente|try again|restring|bloque|couldn.t|não pode ser publicad|limit/i.test(avisos) ? avisos.slice(0, 300) : '';
  return { vazia: !!ta && ta.value === '', naTela: document.body.innerText.includes(${JSON.stringify(texto.slice(-30))}), erro };
})()`;

async function lerComentarios(aba, code, dono, est, expandir = true) {
  await aba.navegar(`https://www.instagram.com/p/${code}/`);
  for (let i = 0; i < 20; i++) { if (await aba.ev('!!document.querySelector("textarea") || document.querySelectorAll("[role=button]").length > 5')) break; await sleep(500); }
  await sleep(1500);
  const todos = new Map();
  const juntar = fontes => { for (const t of fontes) for (const c of acharObjetos(lerJSON(t), ehComentario)) todos.set(String(c.pk), c); };
  juntar(await aba.ev(`[...document.querySelectorAll('script[type="application/json"]')].map(s => s.textContent).filter(t => t.includes('child_comment_count') || t.includes('comments_connection'))`));
  juntar(aba.respostas.map(r => r.corpo));
  const desde = Date.now() / 1000 - DIAS * 86400;
  const principais = [...todos.values()].filter(c => !c.parent_comment_id);
  const abrir = !expandir ? [] : principais.filter(c => (c.child_comment_count || 0) > 0 && doUsuario(c) !== dono && !est.respondidos[String(c.pk)] && (c.created_at || 0) >= desde).slice(0, 15);
  for (const c of abrir) { if ((await aba.ev(verRespostasJS(c.user.username, prefixo(c.text)))) === 'ok') await espera(1800, 3000); }
  if (abrir.length) { await sleep(1500); juntar(aba.respostas.map(r => r.corpo)); }
  const comResposta = new Set([...todos.values()].filter(c => c.parent_comment_id && doUsuario(c) === dono).map(c => String(c.parent_comment_id)));
  for (const c of abrir) if (!comResposta.has(String(c.pk)) && await aba.ev(donoNaConversaJS(c.user.username, prefixo(c.text), CONTA))) comResposta.add(String(c.pk));
  return { principais, comResposta };
}

// ---------- conferência do envio (27/11/2026, depois do 1º uso real) ----------
// O Instagram no navegador manda o número do comentário respondido como número de JavaScript, que arredonda os
// últimos dígitos (ex.: 18103286237051469 sai como 18103286237051468). Com o número errado o Instagram não acha o
// comentário e a resposta sai SOLTA, como comentário novo com o @ na frente (aconteceu com um vendedor em 27/11).
// Antes de o envio sair, a ferramenta confere: mesmo texto, mesmo post e resposta para o comentário certo. Número
// arredondado = põe o número certo e deixa sair. Qualquer outra coisa (sem resposta, outro comentário) = bloqueia.
function lerCampos(corpo) {
  const d = s => { try { return decodeURIComponent(s.replace(/\+/g, ' ')); } catch { return s; } };
  return String(corpo || '').split('&').map(cru => { const i = cru.indexOf('='); return i < 0 ? { cru, k: d(cru), v: '' } : { cru, k: d(cru.slice(0, i)), v: d(cru.slice(i + 1)) }; });
}
function conferirEnvio(corpo, { texto, cpk, mpk }) {
  const campos = lerCampos(corpo);
  const iv = campos.findIndex(c => c.k === 'variables');
  let dados = null;
  if (iv >= 0) dados = acharObjetos(lerJSON(campos[iv].v), o => typeof o.comment_text === 'string')[0] || null; // GraphQL
  else { const c = campos.find(x => x.k === 'comment_text'); if (c) dados = Object.fromEntries(campos.map(x => [x.k, x.v])); } // caminho antigo
  if (!dados) return null; // não é envio de comentário
  const pai = dados.replied_to_comment_id != null && dados.replied_to_comment_id !== '' ? String(dados.replied_to_comment_id) : null;
  const midia = dados.media_id != null ? String(dados.media_id).split('_')[0] : null;
  const base = { pai };
  if (limpo(dados.comment_text) !== limpo(texto)) return { ...base, acao: 'barrar', erro: 'o texto que ia sair é diferente da resposta' };
  if (midia && mpk && midia !== String(mpk)) return { ...base, acao: 'barrar', erro: 'ia sair em outro post' };
  if (!pai || /^0+$/.test(pai)) return { ...base, acao: 'barrar', erro: 'ia sair como comentário solto, sem ser resposta' };
  if (pai === String(cpk)) return { ...base, acao: 'seguir' };
  if (!/^\d+$/.test(pai) || Number(pai) !== Number(cpk)) return { ...base, acao: 'barrar', erro: `ia responder outro comentário (${pai})` };
  // número arredondado pelo navegador: troca só esse número, o resto do envio sai igual
  const novo = campos.map((c, i) => {
    if (iv >= 0 && i === iv) return 'variables=' + encodeURIComponent(c.v.replace(/("replied_to_comment_id"\s*:\s*)("?)-?\d+\2/, `$1$2${cpk}$2`));
    if (iv < 0 && c.k === 'replied_to_comment_id') return 'replied_to_comment_id=' + encodeURIComponent(String(cpk));
    return c.cru;
  }).join('&');
  const conferido = conferirEnvio(novo, { texto, cpk, mpk });
  if (!conferido || conferido.acao !== 'seguir') return { ...base, acao: 'barrar', erro: 'não consegui corrigir o número do comentário' };
  return { ...base, acao: 'trocar', corpo: novo };
}

// depois de publicar: abre o post e confere que a resposta está DENTRO da conversa do comentário
async function confirmarNaConversa(aba, it, texto) {
  await espera(2500, 4000);
  await aba.navegar(link(it.code));
  for (let i = 0; i < 20; i++) { if (await aba.ev('document.querySelectorAll("[role=button]").length > 5')) break; await sleep(500); }
  await sleep(1500);
  const todos = new Map();
  const juntar = fontes => { for (const t of fontes) for (const c of acharObjetos(lerJSON(t), ehComentario)) todos.set(String(c.pk), c); };
  juntar(await aba.ev(`[...document.querySelectorAll('script[type="application/json"]')].map(s => s.textContent).filter(t => t.includes('child_comment_count') || t.includes('comments_connection'))`));
  juntar(aba.respostas.map(r => r.corpo));
  const meus = () => [...todos.values()].filter(c => limpo(c.text) === limpo(texto));
  const dentro = () => meus().some(c => String(c.parent_comment_id || '') === String(it.cpk));
  if (dentro()) return 'dentro';
  if ((await aba.ev(verRespostasJS(it.user, prefixo(it.txt)))) === 'ok') { await espera(2500, 3500); juntar(aba.respostas.map(r => r.corpo)); }
  if (dentro()) return 'dentro';
  if (meus().some(c => !c.parent_comment_id)) return 'solto';
  // a conversa só tinha o comentário da pessoa: se agora a conta aparece nela, é a nossa resposta
  if (await aba.ev(donoNaConversaJS(it.user, prefixo(it.txt), CONTA))) return 'dentro';
  return 'nao-achei';
}

// escreve a resposta pela tela (Responder -> caixa com "@fulano " -> digita -> Postar) e confere o envio antes de sair.
// ensaio = faz tudo até o clique em "Postar", mas o envio é bloqueado no navegador: nada é publicado.
async function responder(aba, it, texto, ensaio) {
  const r1 = await aba.ev(clicarResponderJS(it.user, prefixo(it.txt)));
  if (r1 !== 'ok') return { ok: false, erro: r1 === 'sem-bloco' ? 'não achei o comentário na tela' : r1 };
  await espera(1200, 2000);
  const r2 = await aba.ev(prepararCaixaJS(it.user));
  if (!r2.ok) return r2;
  const resto = texto.slice(r2.antes.length);
  if (r2.antes.toLowerCase() + resto.toLowerCase() !== texto.toLowerCase()) return { ok: false, erro: 'o começo da resposta não bate com a caixa', antes: r2.antes };
  await aba.cdp('Input.insertText', { text: resto });
  await espera(1500, 2500);
  texto = r2.antes + resto;
  // sair da página sem postar descarta o rascunho da caixa (testado em 27/11)
  const descartar = async () => { try { await aba.cdp('Page.navigate', { url: 'about:blank' }); await sleep(1200); } catch {} };
  const r3 = await aba.ev(postarJS(texto, true)); // só confere o botão
  if (!r3.ok) { await descartar(); return r3; }
  const envio = { vistos: 0, ok: false, erro: null, pai: null, corrigido: false };
  const ligou = await aba.vigiar(corpo => {
    const c = conferirEnvio(corpo, { texto, cpk: it.cpk, mpk: it.mpk });
    if (!c) return null;
    envio.vistos++; envio.pai = c.pai; envio.erro = c.erro || null; envio.ok = c.acao !== 'barrar'; envio.corrigido = c.acao === 'trocar';
    return ensaio || c.acao === 'barrar' ? { acao: 'barrar' } : c;
  });
  let desc = '';
  try {
    if (!ligou) { await descartar(); return { ok: false, erro: 'não consegui ligar a conferência do envio no navegador (nada foi enviado)' }; }
    const r4 = await aba.ev(postarJS(texto, false));
    if (!r4.ok) { await descartar(); return r4; }
    for (let i = 0; i < 40 && !envio.vistos; i++) await sleep(250);
    if (!envio.vistos) { await descartar(); return { ok: false, erro: 'cliquei em Postar, mas o envio não passou pela conferência (descartei a resposta)' }; }
    desc = envio.ok ? `resposta dentro da conversa do comentário ${it.cpk}${envio.corrigido ? ` (o navegador ia mandar ${envio.pai}; corrigi)` : ''}` : envio.erro;
    if (ensaio) { await descartar(); return { ok: envio.ok, ensaio: true, envio: desc + ' | envio bloqueado: nada publicado' }; }
    if (!envio.ok) { await descartar(); throw new Parar(`bloqueei a resposta para @${it.user} em ${link(it.code)}: ${envio.erro}. Nada foi publicado.`); }
    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      const d = await aba.ev(depoisJS(texto));
      if (d.erro) throw new Parar(`o Instagram não aceitou a resposta para @${it.user}: ${d.erro}`);
      const nova = acharObjetos(aba.respostas.flatMap(r => lerJSON(r.corpo)), o => o.pk != null && o.text === texto)[0];
      if (nova) { if (String(nova.parent_comment_id ?? '') === String(it.cpk)) return { ok: true, pk: String(nova.pk), desc }; break; }
      if (i >= 8 && d.vazia) break;
    }
  } finally { await aba.soltar(); }
  const onde = await confirmarNaConversa(aba, it, texto);
  if (onde === 'dentro') return { ok: true, pk: null, desc };
  if (onde === 'solto') throw new Parar(`a resposta para @${it.user} saiu SOLTA (fora da conversa) em ${link(it.code)}. Apague pelo celular. Parei para não repetir.`);
  throw new Parar(`publiquei a resposta para @${it.user} em ${link(it.code)}, mas não consegui confirmar que ficou dentro da conversa. Confira no celular antes de liberar.`);
}
const horas = s => { const h = (Date.now() / 1000 - s) / 3600; return h < 1 ? 'há menos de 1 h' : h < 48 ? `há ${Math.round(h)} h` : `há ${Math.round(h / 24)} dias`; };
const curto = s => (s.length > 90 ? s.slice(0, 87) + '...' : s);
const link = code => `https://www.instagram.com/p/${code}/`;

// ---------- ensaio num post (não publica) ----------
async function ensaio() {
  const code = String(ENSAIAR).replace(/^.*\/(p|reel|reels)\//, '').replace(/[/?#].*$/, '');
  const porta = await acharPorta();
  const aba = await abrirAba(porta);
  try {
    const { principais } = await lerComentarios(aba, code, '', lerEstado(), false);
    console.log(`post ${link(code)}: ${principais.length} comentários principais lidos da página`);
    principais.slice(0, 5).forEach(c => console.log(`  @${c.user?.username} | filhos ${c.child_comment_count} | ${horas(c.created_at)} | "${curto(limpo(c.text))}"`));
    const alvo = principais.find(c => c.user?.username && c.user.username.toLowerCase() !== CONTA);
    if (!alvo) return console.log('Nenhum comentário de outra pessoa para ensaiar.');
    const it = { code, user: alvo.user.username, txt: alvo.text, cpk: String(alvo.pk), mpk: '' };
    const r = await responder(aba, it, MODELOS[0](it.user), true);
    console.log(`ENSAIO (nada publicado) em @${it.user}:`, JSON.stringify(r));
    console.log(r.ok && r.ensaio ? 'Resultado: a resposta ia sair DENTRO da conversa do comentário. O envio foi bloqueado no navegador.' : 'Resultado: a resposta NÃO sairia certa. Não ligue a resposta automática; avise o gestor.');
  } finally { await aba.fechar(); }
}

// ---------- uma rodada ----------
async function rodada() {
  const est = lerEstado();
  if (est.parado) { const e = new Parar(`a @${CONTA} está travada desde ${est.parado.quando}: ${est.parado.motivo}`); e.jaTravada = true; throw e; }
  if (!TESTAR && (est.dias[hoje()] || 0) >= MAXD) { log(`@${CONTA}: limite do dia atingido (${MAXD}). Volto amanhã.`); return; }
  pegarTrava();
  let aba = null;
  try {
    const porta = await acharPorta();
    aba = await abrirAba(porta);
    const { posts, dono, meu } = await lerPosts(aba);
    if (!meu) {
      if (!TESTAR) throw new Parar(`o perfil do BitBrowser não está logado na @${CONTA} (não aparece "Editar perfil")`);
      log(`AVISO: o perfil não está logado na @${CONTA}. Teste só de leitura.`);
    }
    if (!posts.length) { log(`@${CONTA}: nenhum post encontrado.`); return; }
    if (!dono) throw new Error('não consegui identificar a conta nos posts');

    const fila = [], ver = [], cont = { posts: posts.length, comComentario: 0, deOutros: 0, jaRespondidos: 0, antigos: 0, semNovidade: 0 };
    const desde = Date.now() / 1000 - DIAS * 86400;
    for (const p of posts) {
      const mpk = String(p.pk); const n = p.comment_count || 0;
      if (!n || p.comments_disabled) continue;
      cont.comComentario++;
      const antes = est.posts[mpk];
      if (!TESTAR && antes && antes.n === n && !antes.pendente) { cont.semNovidade++; continue; }
      await espera(1500, 3500);
      const { principais, comResposta } = await lerComentarios(aba, p.code, dono, est);
      for (const c of principais) {
        const uid = doUsuario(c);
        if (!uid || uid === dono) continue;
        cont.deOutros++;
        if ((c.created_at || 0) < desde) { cont.antigos++; continue; }
        const cpk = String(c.pk);
        if (est.respondidos[cpk] || comResposta.has(cpk)) { cont.jaRespondidos++; continue; }
        const txt = limpo(c.text);
        const tipo = NEGATIVO.test(txt) ? 'negativo' : PROPAGANDA.test(txt) ? 'propaganda' : JA_CHAMOU.test(txt) ? 'disse que já chamou' : null;
        const item = { code: p.code, mpk, cpk, user: c.user?.username || '?', txt, quando: c.created_at || 0 };
        if (tipo) ver.push({ ...item, tipo }); else fila.push(item);
      }
      est.posts[mpk] = { n, pendente: false };
    }
    fila.sort((a, b) => b.quando - a.quando);
    const vagas = Math.max(0, Math.min(MAXR, MAXD - (est.dias[hoje()] || 0)));

    if (TESTAR) {
      console.log(`\nCONTA @${CONTA} | posts lidos: ${cont.posts} | com comentário: ${cont.comComentario} | comentários de outras pessoas: ${cont.deOutros} | já respondidos: ${cont.jaRespondidos} | mais antigos que ${DIAS} dias: ${cont.antigos}`);
      console.log(`\nVOU RESPONDER (${fila.length}; até ${MAXR} por rodada e ${MAXD} por dia, um a cada 40 a 90 s, os mais novos primeiro):`);
      fila.forEach((it, i) => console.log(`  ${i + 1}. ${link(it.code)} | @${it.user} | "${curto(it.txt)}" | ${horas(it.quando)}`));
      console.log(`\nPARA VOCÊ VER (sem resposta automática) (${ver.length}):`);
      ver.forEach((it, i) => console.log(`  ${i + 1}. [${it.tipo}] ${link(it.code)} | @${it.user} | "${curto(it.txt)}"`));
      console.log(`\nExemplo de resposta: "${MODELOS[0](fila[0]?.user || 'fulano')}"`);
      console.log('Modo teste: nada foi escrito no Instagram.');
      return;
    }

    const novos = ver.filter(it => !est.vistos[it.cpk]);
    if (novos.length) {
      fs.appendFileSync(PARA_VER, novos.map(it => `${new Date().toLocaleString('pt-BR')} | ${it.tipo} | ${link(it.code)} | @${it.user} | ${curto(it.txt)}`).join('\n') + '\n');
      for (const it of novos) est.vistos[it.cpk] = new Date().toISOString();
    }
    let feitos = 0, naTela = '';
    try {
      for (const it of fila.slice(0, vagas)) {
        if (fresco(POSTANDO, 15)) { log('post sendo publicado nesta conta: paro as respostas desta rodada'); break; }
        if (feitos) await espera(40000, 90000);
        if (naTela !== it.code) { await aba.navegar(`https://www.instagram.com/p/${it.code}/`); await espera(3000, 5000); naTela = it.code; }
        let k; do { k = Math.floor(Math.random() * MODELOS.length); } while (k === est.ultimoModelo);
        const r = await responder(aba, it, MODELOS[k](it.user), false);
        if (!r.ok) {
          if (r.erro === 'não achei o comentário na tela') { log(`não achei o comentário de @${it.user} em ${link(it.code)} (pode ter sido apagado): pulei`); est.respondidos[it.cpk] = new Date().toISOString(); continue; }
          throw new Parar(`não consegui responder @${it.user} em ${link(it.code)}: ${r.erro}`);
        }
        est.ultimoModelo = k;
        est.respondidos[it.cpk] = new Date().toISOString();
        est.dias[hoje()] = (est.dias[hoje()] || 0) + 1;
        salvarEstado(est);
        feitos++;
        log(`respondi @${it.user} em ${link(it.code)}: ${r.desc || 'dentro da conversa'}`);
        naTela = ''; // depois de publicar, reabre o post antes da próxima resposta
      }
    } finally {
      for (const it of fila.slice(feitos)) if (est.posts[it.mpk] && !est.respondidos[it.cpk]) est.posts[it.mpk].pendente = true;
      est.falhas = 0;
      salvarEstado(est);
    }
    log(`@${CONTA}: respondi ${feitos} | ficaram para a próxima rodada: ${fila.length - feitos} | para você ver: ${novos.length} novos (${PARA_VER}) | já respondidos: ${cont.jaRespondidos} | posts sem comentário novo: ${cont.semNovidade} | hoje: ${est.dias[hoje()] || 0}/${MAXD}`);
  } finally {
    if (aba) await aba.fechar();
    soltarTrava();
  }
}

// ---------- tarefa do Windows ----------
function prepararArquivos() {
  if (process.platform !== 'win32') sair(1, '--agendar e --preparar só funcionam no Windows.');
  const script = fileURLToPath(import.meta.url);
  const raiz = path.resolve(path.dirname(script), '..', '..', '..');
  const pct = s => String(s).replace(/%/g, '%%');
  const partes = [`--conta @${CONTA}`, PORTA ? `--porta ${PORTA}` : `--perfil "${pct(PERFIL)}"`, `--whatsapp ${ZAP}`, `--posts ${POSTS}`, `--dias ${DIAS}`, `--max-por-rodada ${MAXR}`, `--max-por-dia ${MAXD}`, '--uma-vez'];
  if (TESTAR) partes.push('--testar');
  const logf = path.join(LOGS, `comentarios-${CONTA}.log`);
  const cmd = path.join(PASTA, `responder-${CONTA}.cmd`);
  fs.writeFileSync(cmd, ['@echo off', 'chcp 65001 >nul', `cd /d "${pct(raiz)}"`, `"${pct(process.execPath)}" "${pct(script)}" ${partes.join(' ')} >> "${pct(logf)}" 2>&1`, ''].join('\r\n'));
  const vbs = path.join(PASTA, `responder-${CONTA}.vbs`);
  fs.writeFileSync(vbs, '﻿' + `CreateObject("WScript.Shell").Run """${cmd}""", 0, False\r\n`, 'utf16le');
  return { cmd, vbs, logf };
}
function agendar() {
  const { vbs, logf } = prepararArquivos();
  execFileSync('schtasks', ['/Create', '/TN', TAREFA, '/SC', 'MINUTE', '/MO', String(INTERVALO), '/TR', `wscript.exe "${vbs}"`, '/F'], { stdio: 'inherit' });
  console.log(`\nLigado: uma rodada a cada ${INTERVALO} min${TESTAR ? ' (MODO TESTE: só lê)' : ''}, enquanto o PC estiver ligado com o seu usuário e o BitBrowser aberto com o perfil.`);
  console.log(`Tarefa do Windows: "${TAREFA}". Log: ${logf}`);
  console.log(`Para desligar: node 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs --conta @${CONTA} --desagendar`);
}
function desagendar() {
  try { execFileSync('schtasks', ['/Delete', '/TN', TAREFA, '/F'], { stdio: 'inherit' }); console.log(`Desligado: a tarefa "${TAREFA}" foi apagada.`); }
  catch { console.log(`Não havia tarefa "${TAREFA}" ligada.`); }
}

// ---------- início ----------
if (!CONTA) sair(1, 'Falta --conta @conta.');
if (tem('--desagendar')) { desagendar(); sair(0); }
if (tem('--liberar')) { const e = lerEstado(); e.parado = null; e.falhas = 0; salvarEstado(e); sair(0, `Trava tirada da @${CONTA}. A próxima rodada volta a responder.`); }
if (!PERFIL && !PORTA) sair(1, 'Falta --perfil "NOME DO PERFIL NO BITBROWSER" (ou --porta N).');
if (!NUM) sair(1, 'O --whatsapp precisa ser 55 + DDD + número, só dígitos. Ex.: 5577999999999.');
if (tem('--preparar')) { const a = prepararArquivos(); sair(0, `Arquivos prontos (nenhuma tarefa criada):\n  ${a.cmd}\n  ${a.vbs}\nPara rodar uma rodada escondida, como a tarefa faria: wscript.exe "${a.vbs}"\nLog: ${a.logf}`); }
if (tem('--agendar')) { agendar(); sair(0); }
if (ENSAIAR) { try { await ensaio(); sair(0); } catch (e) { sair(e instanceof Parar ? 2 : 1, 'erro no ensaio: ' + e.message); } }

for (;;) {
  try { await rodada(); }
  catch (e) {
    if (e instanceof Parar) {
      if (!e.jaTravada) {
        const est = lerEstado(); est.parado = { motivo: e.message, quando: new Date().toLocaleString('pt-BR') }; salvarEstado(est);
        avisarNaTela(`As respostas automáticas da @${CONTA} pararam: ${e.message}\n\nConfira a conta no BitBrowser e chame o Claude. Nada mais será respondido até liberar.`);
      }
      log(`PARADO: ${e.message}`);
      sair(2, `Para liberar depois de conferir a conta: node 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs --conta @${CONTA} --liberar`);
    }
    if (e instanceof Pular) log(`@${CONTA}: pulei a rodada: ${e.message}`);
    else {
      log(`@${CONTA}: erro: ${e.message}`);
      if (!TESTAR) {
        const est = lerEstado(); est.falhas = (est.falhas || 0) + 1; salvarEstado(est);
        if (est.falhas >= 3) {
          est.parado = { motivo: `3 rodadas seguidas com erro. Último: ${e.message}`, quando: new Date().toLocaleString('pt-BR') }; salvarEstado(est);
          avisarNaTela(`As respostas automáticas da @${CONTA} pararam depois de 3 erros seguidos: ${e.message}\n\nChame o Claude para ver.`);
          sair(2, 'PARADO depois de 3 erros seguidos.');
        }
      }
      if (UMA) sair(1);
    }
  }
  if (UMA) break;
  log(`próxima rodada em ${INTERVALO} min`);
  await sleep(INTERVALO * 60e3);
}
