import { writeFileSync } from 'fs';
import { connectTab, PAGE_STATE_JS, sleep } from './cdp.mjs';
const PROFILES = [
  [1,56934,'4ECFE63E6847803AEF48A025A3F56BA8'],[2,56930,'3BCC6B1FEBBD92D17DB95AB8ADAD5F7F'],[3,56852,'1F699FF09921EEB1E9D0569BC16BE09A'],
  [4,56839,'FEF8C602AFD928070460530840B92E1E'],[6,56784,'6D848E0052F4AD3670CE909296E4DA35'],[7,56782,'267D03697B45145EF6B054000DFC6EB5'],
  [9,62275,'85324F95CDC9D2027820552EEAD663FC'],[10,62218,'71C747DE464F833FD368501BCC7F34CF']];
const only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
const out = {};
for (const [n,port,tab] of PROFILES) {
  if (only && !only.includes(n)) continue;
  let c;
  try {
    c = await connectTab(port, tab);
    await c.send('Page.enable'); await c.send('Runtime.enable');
    await c.navigate('https://www.facebook.com/marketplace/you/selling', 10000);
    await sleep(2500);
    const st = await c.evaluate(PAGE_STATE_JS);
    const t = await c.evaluate(`(document.body.innerText||'')`);
    out[n] = { flags: st.flags, url: st.url, text: t.slice(0,2500).replace(/\n+/g,' | ') };
  } catch(e){ out[n] = { error: String(e).slice(0,300) }; }
  finally { if (c) c.close(); }
}
console.log(JSON.stringify(out,null,1));
