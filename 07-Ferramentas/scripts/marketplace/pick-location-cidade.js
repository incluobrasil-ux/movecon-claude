(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const nodes = Array.from(document.querySelectorAll('[role="option"], [role="listbox"] *, li, [role="dialog"] *'));
  const cands = nodes.filter(el => {
    const t = norm(el.innerText);
    if (!t.includes('vitoria da conquista')) return false;
    if (t.includes('centro') || t.includes('ibirapuera') || t.includes('recreio') || t.includes(', mg') || t.includes('minas')) return false;
    // city-level: has "cidade" or is exactly the city name, optionally with bahia/ba/brasil
    return t.includes('cidade') || t === 'vitoria da conquista' || t === 'vitoria da conquista, bahia' || t === 'vitoria da conquista, ba' || t.includes('vitoria da conquista, bahia') || t.includes('vitoria da conquista, ba, brasil');
  });
  cands.sort((a, b) => {
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const sa = ra.width * ra.height, sb = rb.width * rb.height;
    const aCity = /cidade/i.test(a.innerText) ? 0 : 1;
    const bCity = /cidade/i.test(b.innerText) ? 0 : 1;
    if (aCity !== bCity) return aCity - bCity;
    return sa - sb;
  });
  if (!cands.length) {
    const sample = Array.from(document.querySelectorAll('[role="option"], [role="listbox"]')).map(el => clean(el.innerText).slice(0, 300)).filter(Boolean).slice(0, 15);
    throw new Error('opcao cidade Vitoria da Conquista nao encontrada. sample=' + sample.join(' || '));
  }
  const el = cands[0];
  el.scrollIntoView({ block: 'center' });
  el.click();
  const input = Array.from(document.querySelectorAll('input')).find(i => /localiza/i.test(i.getAttribute('aria-label') || ''));
  return JSON.stringify({
    clicked: clean(el.innerText).slice(0, 200),
    tag: el.tagName,
    valueNow: input ? input.value : null
  });
})()
