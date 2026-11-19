(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const labels = Array.from(document.querySelectorAll('label')).map((l, i) => {
    const control = l.querySelector('input, textarea, select, [contenteditable="true"], [role="combobox"], [role="listbox"], [role="textbox"]');
    const forId = l.getAttribute('for');
    const byFor = forId ? document.getElementById(forId) : null;
    const c = control || byFor;
    return {
      i,
      text: clean(l.innerText).slice(0, 240),
      for: forId || '',
      control: c ? {
        tag: c.tagName,
        type: c.type || '',
        id: c.id || '',
        aria: c.getAttribute('aria-label') || '',
        placeholder: c.placeholder || '',
        role: c.getAttribute('role') || '',
        name: c.name || '',
        value: String(c.value || c.innerText || '').slice(0, 160)
      } : null
    };
  });
  const textareas = Array.from(document.querySelectorAll('textarea')).map(t => ({
    id: t.id, aria: t.getAttribute('aria-label') || '', placeholder: t.placeholder || '', value: t.value.slice(0,100)
  }));
  const combos = Array.from(document.querySelectorAll('[role="combobox"], [aria-haspopup="listbox"], [aria-haspopup="dialog"]')).map(el => ({
    tag: el.tagName, role: el.getAttribute('role'), aria: el.getAttribute('aria-label') || '',
    text: clean(el.innerText).slice(0, 160), expanded: el.getAttribute('aria-expanded')
  }));
  // left composer column likely first sticky/aside
  const left = document.querySelector('[role="main"]') || document.body;
  return JSON.stringify({
    url: location.href,
    title: document.title,
    labels,
    textareas,
    combos,
    photoStatus: (clean(document.body.innerText).match(/Fotos[^\n]{0,80}/) || [''])[0]
  });
})()
