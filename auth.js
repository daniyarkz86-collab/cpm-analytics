(() => {
  const records = [{"role":"admin","name":"Полный обзор","slug":"admin","salt":"hAqFEg8qeXVEWRF5","hash":"3b5d89e123623a2f7724442a337682ef7e82112f251d0bf0866ce8b54294a489","url":"index.html","encSalt":"Dxs48JOeJ1+jWBztYnJoZw==","iterations":100000},{"role":"branch","name":"Актау","slug":"aktau","salt":"3M/gm5TUzbvDgcdo","hash":"516d70cd61a2c4799ac4e87acf0a67ccee33bd45b9fca618ee7ac5a89b2851cb","url":"branches/aktau.html","encSalt":"2e87BjZlazHLjFf+dj0oEQ=="},{"role":"branch","name":"Актобе","slug":"aktobe","salt":"kfR01OW1yrm9TSfD","hash":"550de7bfbab8bd06d837dbac73a06cf6935686e88a974fe1f4f0fa6c91aa1ec0","url":"branches/aktobe.html","encSalt":"mD6Pdryo5TYPLN2k8czT8A=="},{"role":"branch","name":"Алматы","slug":"almaty","salt":"mKDDG4dXibvGtRO6","hash":"11c785c90afe8e02bfdefffbd345ca48a57701db6a7d95906984edec1c6d7bc9","url":"branches/almaty.html","encSalt":"1GEAvXXSQ+vR24hVxFt6sg=="},{"role":"branch","name":"Атырау","slug":"atyrau","salt":"/UeSdZyj6qI/0ZlP","hash":"c95b511775eb6b650b5a1a4ebf80cdc595e51b39dd51fe98e475d659f746ab08","url":"branches/atyrau.html","encSalt":"tixR87YmJNiKc6udouegWQ=="},{"role":"branch","name":"Караганда","slug":"karaganda","salt":"3981bcP3tPkJkc/q","hash":"446bdd3d22180083c7223d36fa96a148166bf5ede0eaad19c783913515a76e1a","url":"branches/karaganda.html","encSalt":"CGVCZTK5bSeQU7tXPkWVlA=="},{"role":"branch","name":"Кокшетау","slug":"kokshetau","salt":"R7tJuHA3S2aADmXL","hash":"d48952e00f3e92c6624b10054e72f8b3773b500b1ff70265b0021b414bf86cd7","url":"branches/kokshetau.html","encSalt":"TkqB+/FGP3qQGq9NbC8meA=="},{"role":"branch","name":"Костанай","slug":"kostanay","salt":"juthHynSqrXoW8K4","hash":"146bd81989deb1dba5ca777dc5b46687ef7b941391361791441635e62d137d4e","url":"branches/kostanay.html","encSalt":"BUDfi98EDQN1zdHia/u6Rg=="},{"role":"branch","name":"Кызылорда","slug":"kyzylorda","salt":"Q9xpvguEntMPmGht","hash":"abb430d720efb4f413b323f7ee163a77e6487c71f807486fe02ee6fe052f06ee","url":"branches/kyzylorda.html","encSalt":"4vwb7tuKZEy4DthSBIrf3g=="},{"role":"branch","name":"Павлодар","slug":"pavlodar","salt":"9cYikdB/iUreV+wI","hash":"b794dad37f9cc2dcfaf5b65db2b09ec1619be0429d11105f76276183fd140ceb","url":"branches/pavlodar.html","encSalt":"yzmll+qOWnyX2KXSp4Wv7g=="},{"role":"branch","name":"Петропавловск","slug":"petropavlovsk","salt":"rpORyiwJM9CuNbc2","hash":"cab3da46bbf3161b7be0cb78ba456af00cd38d5e0e867641b0ebd796087f66bc","url":"branches/petropavlovsk.html","encSalt":"keOOU+oQ68mEIlYUUs5snw=="},{"role":"branch","name":"Талдыкорган","slug":"taldykorgan","salt":"5Q7OUSDgoaTbAQdy","hash":"5a9a1e535838bf339d47a1aef60c0af6e63dd66ee1d9155191b2d154d0447de0","url":"branches/taldykorgan.html","encSalt":"GiBtuLWIZ9hToWiPaS+x5A=="},{"role":"branch","name":"Тараз","slug":"taraz","salt":"mQRa4bJ6nOn+T/bk","hash":"4e831cd98b4b1a1cd0a9300dc13cac9d06272cdf68f9f18acea079afebd0ffa3","url":"branches/taraz.html","encSalt":"MD7261xfIpMjd9PHn9fwtg=="},{"role":"branch","name":"Уральск","slug":"uralsk","salt":"6h86dfjmKtQoVeHF","hash":"05bb117f298385fcb536951d539104a54d70a7d1aa881a40bd32ca9907526386","url":"branches/uralsk.html","encSalt":"NFVBRQcRq1XmWfZ9zYHXFg=="},{"role":"branch","name":"Усть-Каменогорск","slug":"ust-kamenogorsk","salt":"KsFcwwDq5GFl9lc+","hash":"063350b7c3b74a0d7b1016bbe2bf65c976646929617271c82f130d66968d41a8","url":"branches/ust-kamenogorsk.html","encSalt":"HoeKOAGAKdcX4pw2e7xVRA=="},{"role":"branch","name":"Шымкент","slug":"shymkent","salt":"egewhnoi4lhzd1GY","hash":"ecfdb0efc7be9717900939786538aec96d426e0a9f8a2cd025592bf190d75da1","url":"branches/shymkent.html","encSalt":"dsAPrVSipK0RJVCbA3paaQ=="}];
  const gate = document.getElementById('access-gate');
  const dashboard = document.getElementById('admin-dashboard');
  const form = document.getElementById('access-form');
  const input = document.getElementById('access-pin');
  const error = document.getElementById('access-error');
  const logout = document.getElementById('admin-logout');
  const attemptsKey = 'cpm-access-attempts';

  const from64 = value => Uint8Array.from(atob(value), c => c.charCodeAt(0));
  const to64 = value => btoa(String.fromCharCode(...value));
  async function digest(value) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }
  async function deriveKey(pin, salt, iterations = 150000) {
    const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name:'PBKDF2', salt:from64(salt), iterations, hash:'SHA-1' }, material, { name:'AES-CBC', length:256 }, true, ['decrypt']);
  }
  async function revealAdmin(key) {
    const plain = await crypto.subtle.decrypt({ name:'AES-CBC', iv:from64(window.ADMIN_PAYLOAD.iv) }, key, from64(window.ADMIN_PAYLOAD.payload));
    gate.hidden = true;
    dashboard.hidden = false;
    (0, eval)(new TextDecoder().decode(plain));
  }
  async function restoreAdmin() {
    const saved = sessionStorage.getItem('cpm-admin-key');
    if (!saved) return;
    try {
      const key = await crypto.subtle.importKey('raw', from64(saved), { name:'AES-CBC' }, true, ['decrypt']);
      await revealAdmin(key);
    } catch { sessionStorage.removeItem('cpm-admin-key'); }
  }
  function locked() {
    const state = JSON.parse(localStorage.getItem(attemptsKey) || '{"count":0,"until":0}');
    if (state.until > Date.now()) {
      error.textContent = 'Слишком много попыток. Повторите вход через несколько минут.';
      return true;
    }
    if (state.until && state.until <= Date.now()) localStorage.removeItem(attemptsKey);
    return false;
  }
  function failedAttempt() {
    const state = JSON.parse(localStorage.getItem(attemptsKey) || '{"count":0,"until":0}');
    state.count += 1;
    if (state.count >= 5) { state.count = 0; state.until = Date.now() + 5 * 60 * 1000; }
    localStorage.setItem(attemptsKey, JSON.stringify(state));
  }
  restoreAdmin();
  logout.addEventListener('click', () => {
    sessionStorage.removeItem('cpm-admin-key');
    location.href = 'index.html';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (locked()) return;
    const pin = input.value.trim();
    if (!/^\d{6}$/.test(pin)) { error.textContent = 'Введите шестизначный код.'; return; }
    for (const record of records) {
      if (await digest(record.salt + ':' + pin) !== record.hash) continue;
      localStorage.removeItem(attemptsKey);
      const key = await deriveKey(pin, record.encSalt, record.iterations);
      const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
      if (record.role === 'admin') {
        sessionStorage.setItem('cpm-admin-key', to64(raw));
        await revealAdmin(key);
      } else {
        sessionStorage.setItem('cpm-branch-access:' + record.slug, 'granted');
        sessionStorage.setItem('cpm-branch-access:' + record.slug + ':key', to64(raw));
        location.href = record.url;
      }
      return;
    }
    failedAttempt();
    error.textContent = 'Неверный код доступа.';
    input.select();
  });
})();
