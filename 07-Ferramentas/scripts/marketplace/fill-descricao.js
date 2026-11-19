(() => {
  const data = window.__listingData;
  if (!data || !data.descricao) throw new Error('missing descricao');
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const norm = s => clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const lab = Array.from(document.querySelectorAll('label')).find(l => norm(l.innerText) === 'descricao' || norm(l.innerText).startsWith('descricao'));
  if (!lab) throw new Error('descricao nao encontrada');
  const el = lab.querySelector('textarea, input, [contenteditable="true"]');
  if (!el) throw new Error('campo descricao nao encontrado');
  el.scrollIntoView({ block: 'center' });
  el.focus();
  el.click();
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(el, '');
  el.dispatchEvent(new Event('input', { bubbles: true }));
  setter.call(el, data.descricao);
  el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'insertText', data: data.descricao }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
  el.blur();
  return JSON.stringify({
    len: el.value.length,
    expected: data.descricao.length,
    match: el.value === data.descricao,
    start: el.value.slice(0, 80),
    end: el.value.slice(-80)
  });
})()
