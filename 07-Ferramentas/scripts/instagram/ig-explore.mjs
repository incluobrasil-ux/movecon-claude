import { connect, STATE_JS, clickJS, clickLabel, sleep } from './ig-lib.mjs';
const c = await connect(); const mode = process.argv[2] || 'state';
if (mode === 'state') console.log(JSON.stringify(await c.ev(STATE_JS), null, 1));
if (mode === 'shot') { await c.shot(process.argv[3]); console.log('ok'); }
if (mode === 'mclick') { console.log('clicked', JSON.stringify(await clickLabel(c, process.argv.slice(3)))); await sleep(3000); const s = await c.ev(STATE_JS); console.log(JSON.stringify({...s, text: s.dialog ? s.text : s.text.slice(0,300)}, null, 1)); }
if (mode === 'eval') console.log(JSON.stringify(await c.ev(process.argv[3]), null, 1));
c.close();
