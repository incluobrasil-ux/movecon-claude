(() => {
  const want = (window.__wantTitle || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const links = Array.from(document.querySelectorAll('a[href*="/marketplace/item/"]'));
  const items = links.map(a => {
    const href = a.href;
    const m = href.match(/marketplace\/item\/(\d+)/);
    return {
      id: m ? m[1] : null,
      href: href.split('?')[0],
      text: String(a.innerText || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 200)
    };
  }).filter(x => x.id);
  const uniq = [];
  const seen = new Set();
  for (const it of items) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    uniq.push(it);
  }
  const match = uniq.find(it => it.text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(want));
  return JSON.stringify({ match, first: uniq.slice(0, 8), count: uniq.length });
})()
