(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const lab = Array.from(document.querySelectorAll('label')).find(l => norm(l.innerText) === 'condicao' || norm(l.innerText).startsWith('condicao'));
  if (!lab) throw new Error('condicao nao encontrada');
  lab.scrollIntoView({ block: 'center' });
  lab.click();
  return 'clicked';
})()
