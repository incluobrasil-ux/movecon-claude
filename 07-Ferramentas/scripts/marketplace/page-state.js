(() => {
  const clean = s => String(s || '').replace(/\s+/g, ' ').trim();
  const raw = (document.body && document.body.innerText) ? document.body.innerText : '';
  const flags = [];
  const checks = [
    ['nao_pode_vender', /voc[eê] n[aã]o pode vender/i],
    ['community_standards', /padr[oõ]es da comunidade|community standards/i],
    ['checkpoint', /checkpoint/i],
    ['confirm_identity', /confirma que [eé] voc[eê]|confirme sua identidade|ajuda a confirmar/i],
    ['codigo', /digite o c[oó]digo|enviar c[oó]digo|c[oó]digo de verifica/i],
    ['recusado', /an[uú]ncio recusado|listing (was )?rejected|n[aã]o foi aprovado/i],
    ['login', /entrar no facebook|log in to facebook|inserir senha/i],
    ['bloqueio', /sua conta foi bloqueada|account (is )?disabled/i]
  ];
  for (const [name, re] of checks) { if (re.test(raw)) flags.push(name); }
  const buttons = Array.from(document.querySelectorAll('button, [role="button"]')).map(el => ({
    text: clean(el.innerText || el.getAttribute('aria-label') || '').slice(0, 120),
    disabled: !!(el.disabled || el.getAttribute('aria-disabled') === 'true')
  })).filter(b => b.text);
  return JSON.stringify({
    url: location.href,
    title: document.title,
    flags,
    buttons: buttons.slice(0, 60),
    textSample: raw.slice(0, 4000)
  });
})()
