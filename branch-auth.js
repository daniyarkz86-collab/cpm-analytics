(() => {
  const cfg = window.BRANCH_PORTAL;
  const gate = document.getElementById('branch-gate');
  const portal = document.getElementById('branch-portal');
  const form = document.getElementById('branch-login');
  const input = document.getElementById('branch-pin');
  const error = document.getElementById('branch-error');
  const sessionKey = `cpm-branch-access:${cfg.slug}`;

  async function digest(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function deriveKey(pin) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: Uint8Array.from(atob(cfg.encSalt), c => c.charCodeAt(0)), iterations: cfg.iterations || 150000, hash: 'SHA-1' }, material, { name: 'AES-CBC', length: 256 }, true, ['decrypt']);
  }

  async function revealWithKey(key) {
    const plain = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: Uint8Array.from(atob(cfg.iv), c => c.charCodeAt(0)) }, key, Uint8Array.from(atob(cfg.payload), c => c.charCodeAt(0)));
    portal.innerHTML = new TextDecoder().decode(plain);
    gate.hidden = true;
    portal.hidden = false;
    document.title = `${cfg.name} — финансовый кабинет`;
    document.getElementById('logout').addEventListener('click', () => {
      sessionStorage.removeItem(sessionKey);
      sessionStorage.removeItem(`${sessionKey}:key`);
      location.href = '../index.html';
    });
  }

  const savedKey = sessionStorage.getItem(`${sessionKey}:key`);
  if (sessionStorage.getItem(sessionKey) === 'granted' && savedKey) {
    crypto.subtle.importKey('raw', Uint8Array.from(atob(savedKey), c => c.charCodeAt(0)), { name: 'AES-CBC' }, true, ['decrypt']).then(revealWithKey).catch(() => sessionStorage.clear());
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const pin = input.value.trim();
    if (!/^\d{6}$/.test(pin)) { error.textContent = 'Введите шестизначный код.'; return; }
    const value = await digest(`${cfg.salt}:${pin}`);
    if (value !== cfg.hash) { error.textContent = 'Неверный код доступа.'; input.select(); return; }
    const key = await deriveKey(pin);
    const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
    sessionStorage.setItem(sessionKey, 'granted');
    sessionStorage.setItem(`${sessionKey}:key`, btoa(String.fromCharCode(...raw)));
    await revealWithKey(key);
  });
})();
