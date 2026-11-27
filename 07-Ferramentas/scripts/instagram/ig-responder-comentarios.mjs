// ig-responder-comentarios.mjs: responde com o WhatsApp do operador os comentários que estão sem resposta (27/11/2026).
// Autorizado pelo gestor (Samuel) em 27/11/2026. Ver 02-Funcoes/Respondedor de comentarios.md.
// Só a mensagem padrão ("me chama no WhatsApp"). Nunca valor, conversa, Direct, curtida ou seguir.
//
// Uso (da pasta raiz do cofre, com o BitBrowser aberto e o perfil da conta aberto e logado):
//   node 07-Ferramentas/scripts/instagram/ig-responder-comentarios.mjs --conta @conta --perfil "NOME NO BITBROWSER" --whatsapp 5577999999999 --testar
//   --testar          só mostra o que responderia. Não escreve nada no Instagram.
//   (sem --testar)    responde de verdade. --uma-vez: uma rodada e sai. Sem --uma-vez: repete a cada --intervalo-min.
//   --agendar         cria a tarefa do Windows que roda uma rodada a cada --intervalo-min (padrão 20), sem abrir janela.
//   --desagendar      apaga a tarefa.   --liberar: tira a trava depois de uma parada (só depois de conferir a conta).
//   --preparar        só escreve os arquivos que a tarefa usa (.cmd e .vbs), sem criar a tarefa.
//   --porta N         porta do perfil, no lugar de --perfil.
//   --posts 12  --dias 30  --max-por-rodada 8  --max-por-dia 60  --intervalo-min 20
// Responde só comentário principal (não a resposta dentro de uma conversa), de outra pessoa, sem resposta da conta,
// dos últimos --dias dias, nos --posts posts mais novos. Comentário negativo ("golpe" etc.), propaganda e "já te chamei"
// não recebem resposta automática: vão para uma lista para o operador ver.
// Para no primeiro sinal de login, verificação, limite, bloqueio ou erro ao responder (saída 2), trava a conta até
// --liberar e mostra um aviso na tela.
// Não abre nem fecha perfil (perfil fechado = pula a rodada). Usa uma aba própria em segundo plano e fecha no fim.
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
const TESTAR = tem('--testar');
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
const PARA_VER = path.join(PASTA, `comentarios-${CONTA}-para-ver.txt`);
const TAREFA = `MOVECON comentarios ${CONTA}`;

const log = (...a) => console.log(new Date().toLocaleString('pt-BR'), ...a);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const espera = (a, b) => sleep(a + Math.random() * (b - a));
class Parar extends Error {} // problema na conta: trava até --liberar (saída 2)
class Pular extends Error {} // nada a fazer agora (perfil fechado, outra rodada rodando): tenta na próxima
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
function pegarTrava() {
  try { const t = JSON.parse(fs.readFileSync(TRAVA, 'utf8')); if (Date.now() - new Date(t.inicio).getTime() < 30 * 60e3) throw new Pular('outra rodada desta conta ainda está rodando'); }
  catch (e) { if (e instanceof Pular) throw e; }
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
  let id = 0; const pend = new Map();
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.j(new Error(JSON.stringify(m.error))) : p.r(m.result); } };
  const send = (method, params = {}, to = 60000) => new Promise((r, j) => { const i = ++id; const t = setTimeout(() => { pend.delete(i); j(new Error('o navegador demorou: ' + method)); }, to); pend.set(i, { r: v => { clearTimeout(t); r(v); }, j: e => { clearTimeout(t); j(e); } }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { pronto, send, fechar: () => { try { ws.close(); } catch {} } };
}
async function abrirAba(porta) {
  let ver;
  try { ver = await (await fetch(`http://127.0.0.1:${porta}/json/version`, { signal: AbortSignal.timeout(10000) })).json(); }
  catch { throw new Pular(`o perfil não respondeu na porta ${porta} (fechado?)`); }
  const nav = conectar(ver.webSocketDebuggerUrl); await nav.pronto;
  const { targetId } = await nav.send('Target.createTarget', { url: `https://www.instagram.com/${CONTA}/`, background: true });
  const fecharAba = async () => { try { await nav.send('Target.closeTarget', { targetId }, 10000); } catch {} nav.fechar(); };
  let aba = null;
  for (let i = 0; i < 30 && !aba; i++) { await sleep(500); aba = (await (await fetch(`http://127.0.0.1:${porta}/json/list`)).json()).find(t => t.id === targetId && t.webSocketDebuggerUrl); }
  if (!aba) { await fecharAba(); throw new Error('a aba nova não apareceu no navegador'); }
  const pg = conectar(aba.webSocketDebuggerUrl); await pg.pronto;
  const ev = async (expr, to = 90000) => { const r = await pg.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, to); if (r.exceptionDetails) throw new Error('JS: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text)); return r.result?.value; };
  return { ev, fechar: async () => { pg.fechar(); await fecharAba(); } };
}
async function esperarPagina(aba) {
  for (let i = 0; i < 40; i++) {
    await sleep(750);
    let s; try { s = await aba.ev('({ host: location.hostname, path: location.pathname, pronto: document.readyState })', 10000); } catch { continue; }
    if (s.host !== 'www.instagram.com') continue;
    if (/^\/(accounts\/login|challenge|checkpoint|accounts\/suspended|accounts\/disabled)/.test(s.path)) throw new Parar(`o Instagram abriu ${s.path} (login, verificação ou bloqueio)`);
    if (s.pronto !== 'loading') return s;
  }
  throw new Pular('a página do Instagram não carregou (internet?)');
}

// ---------- Instagram (a mesma sessão já logada no navegador) ----------
const chamarJS = (metodo, rota, form) => `(async () => {
  const ck = n => (document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)')) || [])[1] || '';
  const h = { 'X-CSRFToken': ck('csrftoken'), 'X-IG-App-ID': '936619743392459', 'X-Requested-With': 'XMLHttpRequest', 'X-IG-WWW-Claim': sessionStorage.getItem('www-claim-v2') || '0' };
  const ini = { method: ${JSON.stringify(metodo)}, headers: h, credentials: 'include' };
  const form = ${JSON.stringify(form || null)};
  if (form) { h['Content-Type'] = 'application/x-www-form-urlencoded'; ini.body = new URLSearchParams(form).toString(); }
  try { const r = await fetch(${JSON.stringify(rota)}, ini); return { status: r.status, url: r.url, text: await r.text() }; }
  catch (e) { return { status: 0, url: '', text: String(e) }; }
})()`;
// números de 16+ dígitos (ids) viram texto antes do JSON.parse, para não perder precisão
const aspasNosIds = t => String(t || '').replace(/("\w+"\s*:\s*)(-?\d{16,})(?=\s*[,}\]])/g, '$1"$2"');
async function ig(aba, metodo, rota, form) {
  const r = await aba.ev(chamarJS(metodo, rota, form));
  let j = null; try { j = JSON.parse(aspasNosIds(r.text)); } catch {}
  const ok = r.status === 200 && !!j && (j.status === 'ok' || j.status === undefined);
  if (!ok) {
    const t = String(r.text || '').slice(0, 3000);
    let motivo = null;
    if (/checkpoint_required|challenge_required|"\/challenge\//i.test(t)) motivo = 'o Instagram pediu verificação (checkpoint)';
    else if (r.status === 401 || /login_required|"require_login"\s*:\s*true/i.test(t) || /\/accounts\/login/.test(r.url || '')) motivo = 'o Instagram pediu login';
    else if (r.status === 429 || /feedback_required|"spam"\s*:\s*true|please wait|tente novamente|try again later|rate.?limit|limitamos/i.test(t)) motivo = 'limite ou bloqueio de ação do Instagram';
    else if (/suspend|disabled|desativad|suspens/i.test(t)) motivo = 'conta suspensa ou desativada';
    if (motivo) throw new Parar(`${motivo} (HTTP ${r.status} em ${rota.split('?')[0]}): ${t.slice(0, 300)}`);
  }
  return { ...r, j, ok };
}
const doUsuario = x => String(x?.user?.pk ?? x?.user?.id ?? x?.user_id ?? '');
async function lerComentarios(aba, mpk) {
  const todos = []; let cursor = '', tipo = '', pags = 0;
  do {
    const r = await ig(aba, 'GET', `/api/v1/media/${mpk}/comments/?can_support_threading=true&permalink_enabled=false` + (cursor ? `&${tipo}=${encodeURIComponent(cursor)}` : ''));
    if (!r.ok) throw new Error(`não consegui ler os comentários (HTTP ${r.status}): ${String(r.text).slice(0, 200)}`);
    todos.push(...(r.j.comments || []));
    if (r.j.has_more_headload_comments && r.j.next_min_id) { cursor = r.j.next_min_id; tipo = 'min_id'; }
    else if (r.j.has_more_comments && r.j.next_max_id) { cursor = r.j.next_max_id; tipo = 'max_id'; }
    else cursor = '';
    if (cursor) await espera(1000, 2500);
  } while (cursor && ++pags < 6);
  const unicos = new Map(); for (const c of todos) unicos.set(String(c.pk), c);
  return [...unicos.values()];
}
async function temRespostaDaConta(aba, mpk, c, dono) {
  const n = c.child_comment_count || 0;
  if (!n) return false;
  const prev = c.preview_child_comments || [];
  if (prev.some(x => doUsuario(x) === dono)) return true;
  if (prev.length >= n) return false;
  let cursor = '', pags = 0;
  do {
    await espera(1000, 2500);
    const r = await ig(aba, 'GET', `/api/v1/media/${mpk}/comments/${c.pk}/child_comments/` + (cursor ? `?max_id=${encodeURIComponent(cursor)}` : ''));
    if (!r.ok) throw new Error(`não consegui ler as respostas (HTTP ${r.status})`);
    if ((r.j.child_comments || []).some(x => doUsuario(x) === dono)) return true;
    cursor = r.j.has_more_tail_child_comments ? (r.j.next_max_child_cursor || '') : '';
  } while (cursor && ++pags < 4);
  return false;
}
async function respostaApareceu(aba, it, dono) {
  for (let i = 0; i < 2; i++) {
    await espera(4000, 8000);
    const r = await ig(aba, 'GET', `/api/v1/media/${it.mpk}/comments/${it.cpk}/child_comments/`);
    if (r.ok && (r.j.child_comments || []).some(x => doUsuario(x) === dono)) return true;
  }
  return false;
}
const horas = s => { const h = (Date.now() / 1000 - s) / 3600; return h < 1 ? 'há menos de 1 h' : h < 48 ? `há ${Math.round(h)} h` : `há ${Math.round(h / 24)} dias`; };
const curto = s => (s.length > 90 ? s.slice(0, 87) + '...' : s);

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
    await esperarPagina(aba);
    let eu = await aba.ev(`(document.cookie.match(/(?:^|; )ds_user_id=(\\d+)/) || [])[1] || ''`);
    const perfil = await ig(aba, 'GET', `/api/v1/users/web_profile_info/?username=${encodeURIComponent(CONTA)}`);
    const dono = String(perfil.j?.data?.user?.id || '');
    if (!dono) throw new Error(`não achei a conta @${CONTA} (HTTP ${perfil.status})`);
    if (!eu) { const cu = await ig(aba, 'GET', '/api/v1/accounts/current_user/?edit=true'); eu = String(cu.j?.user?.pk ?? cu.j?.user?.pk_id ?? ''); }
    if (!eu) throw new Parar('o perfil do BitBrowser não está logado no Instagram');
    if (eu !== dono) {
      if (!TESTAR) throw new Parar(`o perfil do BitBrowser está logado em outra conta, não na @${CONTA}`);
      log(`AVISO: o perfil está logado em outra conta, não na @${CONTA}. Teste só de leitura.`);
    }
    await espera(1000, 2500);
    const feed = await ig(aba, 'GET', `/api/v1/feed/user/${dono}/?count=${POSTS}`);
    if (!feed.ok) throw new Error(`não consegui ler os posts (HTTP ${feed.status}): ${String(feed.text).slice(0, 200)}`);
    const posts = (feed.j.items || []).slice(0, POSTS);

    const fila = [], ver = [], cont = { posts: posts.length, comComentario: 0, deOutros: 0, jaRespondidos: 0, antigos: 0, semNovidade: 0 };
    const desde = Date.now() / 1000 - DIAS * 86400;
    for (const p of posts) {
      const mpk = String(p.pk ?? String(p.id || '').split('_')[0]);
      const n = p.comment_count || 0;
      if (!n || p.comments_disabled) continue;
      cont.comComentario++;
      const antes = est.posts[mpk];
      if (!TESTAR && antes && antes.n === n && !antes.pendente) { cont.semNovidade++; continue; }
      await espera(1200, 3000);
      for (const c of await lerComentarios(aba, mpk)) {
        const uid = doUsuario(c);
        if (!uid || uid === dono) continue;
        cont.deOutros++;
        if ((c.created_at || 0) < desde) { cont.antigos++; continue; }
        const cpk = String(c.pk);
        if (est.respondidos[cpk] || await temRespostaDaConta(aba, mpk, c, dono)) { cont.jaRespondidos++; continue; }
        const txt = String(c.text || '').replace(/\s+/g, ' ').trim();
        const tipo = NEGATIVO.test(txt) ? 'negativo' : PROPAGANDA.test(txt) ? 'propaganda' : JA_CHAMOU.test(txt) ? 'disse que já chamou' : null;
        const item = { post: p.code, mpk, cpk, user: c.user?.username || '?', txt, quando: c.created_at || 0 };
        if (tipo) ver.push({ ...item, tipo }); else fila.push(item);
      }
      est.posts[mpk] = { n, pendente: false };
    }
    fila.sort((a, b) => b.quando - a.quando);
    const vagas = Math.max(0, Math.min(MAXR, MAXD - (est.dias[hoje()] || 0)));
    const link = it => `https://www.instagram.com/p/${it.post}/`;

    if (TESTAR) {
      console.log(`\nCONTA @${CONTA} | posts lidos: ${cont.posts} | com comentário: ${cont.comComentario} | comentários de outras pessoas: ${cont.deOutros} | já respondidos: ${cont.jaRespondidos} | mais antigos que ${DIAS} dias: ${cont.antigos}`);
      console.log(`\nVOU RESPONDER (${fila.length}; até ${MAXR} por rodada e ${MAXD} por dia, um a cada 40 a 90 s, os mais novos primeiro):`);
      fila.forEach((it, i) => console.log(`  ${i + 1}. ${link(it)} | @${it.user} | "${curto(it.txt)}" | ${horas(it.quando)}`));
      console.log(`\nPARA VOCÊ VER (sem resposta automática) (${ver.length}):`);
      ver.forEach((it, i) => console.log(`  ${i + 1}. [${it.tipo}] ${link(it)} | @${it.user} | "${curto(it.txt)}"`));
      console.log(`\nExemplo de resposta: "${MODELOS[0](fila[0]?.user || 'fulano')}"`);
      console.log('Modo teste: nada foi escrito no Instagram.');
      return;
    }

    const novos = ver.filter(it => !est.vistos[it.cpk]);
    if (novos.length) {
      fs.appendFileSync(PARA_VER, novos.map(it => `${new Date().toLocaleString('pt-BR')} | ${it.tipo} | ${link(it)} | @${it.user} | ${curto(it.txt)}`).join('\n') + '\n');
      for (const it of novos) est.vistos[it.cpk] = new Date().toISOString();
    }
    let feitos = 0;
    try {
      for (const it of fila.slice(0, vagas)) {
        if (feitos) await espera(40000, 90000);
        let k; do { k = Math.floor(Math.random() * MODELOS.length); } while (k === est.ultimoModelo);
        const r = await ig(aba, 'POST', `/api/v1/web/comments/${it.mpk}/add/`, { comment_text: MODELOS[k](it.user), replied_to_comment_id: it.cpk });
        if (!r.ok) throw new Parar(`o Instagram não aceitou a resposta (HTTP ${r.status}): ${String(r.text).slice(0, 300)}`);
        est.ultimoModelo = k;
        est.respondidos[it.cpk] = new Date().toISOString();
        est.dias[hoje()] = (est.dias[hoje()] || 0) + 1;
        salvarEstado(est);
        feitos++;
        log(`respondi @${it.user} em ${link(it)}`);
        if (feitos === 1 && !(await respostaApareceu(aba, it, dono))) throw new Parar(`o Instagram aceitou a resposta para @${it.user}, mas ela não apareceu no post (${link(it)}). Pode ser filtro de spam. Confira no celular antes de liberar.`);
      }
    } finally {
      for (const it of fila.slice(feitos)) if (est.posts[it.mpk]) est.posts[it.mpk].pendente = true;
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
