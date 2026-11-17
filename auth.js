(() => {
  const records = [{"role":"admin","name":"Полный обзор","slug":"admin","salt":"hAqFEg8qeXVEWRF5","hash":"3b5d89e123623a2f7724442a337682ef7e82112f251d0bf0866ce8b54294a489","url":"index.html","encSalt":"Dxs48JOeJ1+jWBztYnJoZw==","iterations":100000},{"role":"branch","name":"Актау","slug":"aktau","salt":"lE5wSjDXG6WNt10r","hash":"6248ba78ec643d22fe2d0f25223302dc7bb0a5ffb10ab51d9f21f1e4db8d19be","url":"branches/aktau.html","encSalt":"cEq2gzZ9X4+KNarpQrpbEg=="},{"role":"branch","name":"Актобе","slug":"aktobe","salt":"ci5ZmXxgvBga76At","hash":"ea0d9ea534f5d2681f8f8e83bf2bf5f7ffbeb150c0cb2a96f199b2ebb32ea845","url":"branches/aktobe.html","encSalt":"1nLo2eTsLZQRDhe/hZOMDw=="},{"role":"branch","name":"Алматы","slug":"almaty","salt":"xOuTeO5ea71uh9o4","hash":"abfc4c0a99f6ca2d1097ee3c542f7098f9586fbc9fa0b4bf02d4c20f7acc2115","url":"branches/almaty.html","encSalt":"zvtISnJieRHO7XQ7BBWl2Q=="},{"role":"branch","name":"Атырау","slug":"atyrau","salt":"Lixv9D6WnspbDdyE","hash":"5bfad7e9c8ce88d402758f9ed60f5993dce5b36dc3d1299414835b510ba10947","url":"branches/atyrau.html","encSalt":"SLbNvnGvKZYGJyznlrSSdg=="},{"role":"branch","name":"Караганда","slug":"karaganda","salt":"HIUouGzNG6e9jLmC","hash":"851e9db8ee8e479aba59be5fc1757f94d2e1084a507ef971a99086c29ce630d2","url":"branches/karaganda.html","encSalt":"iYaz/+qHT5iup0cxKANBQA=="},{"role":"branch","name":"Кокшетау","slug":"kokshetau","salt":"YWot1wQjM0KTI3ng","hash":"524f66764b2f887f62861bcb7c4f385a37acc5ee6c4549a033bc22861c8f433e","url":"branches/kokshetau.html","encSalt":"/I/Z4S7vxYZqz04H71D7zQ=="},{"role":"branch","name":"Костанай","slug":"kostanay","salt":"O40YAy5uHeBK7Oct","hash":"ea94bafc7320789245e8303615501dee2cf190ac6f943da8ae2f9ace055cd42e","url":"branches/kostanay.html","encSalt":"SmNdl+ZWR8mC1IhhOdsCvQ=="},{"role":"branch","name":"Кызылорда","slug":"kyzylorda","salt":"yXreY2kZH3eJs1J5","hash":"2c2754f84d8076ddb1eb006af6ca678f46737d88629be64c66278f913c7f915c","url":"branches/kyzylorda.html","encSalt":"hkaA09tyhRDAQfi+nbMYtQ=="},{"role":"branch","name":"Павлодар","slug":"pavlodar","salt":"r2UuOkucmjeTIq/3","hash":"5715e161e756fa007ad68e32258a0a12ad8b1ca692fa26978a4d907d1b4c7a62","url":"branches/pavlodar.html","encSalt":"vvvC6nDnNWbFLec/5BZ0RQ=="},{"role":"branch","name":"Петропавловск","slug":"petropavlovsk","salt":"eeHyhOqNhsXFnD4C","hash":"0ad4327dc7f0f8c7de4f8e1a50869e4c35706779a16a606b4d687f806046c1e9","url":"branches/petropavlovsk.html","encSalt":"D0rOevfhjLAXG6wn4kHSOg=="},{"role":"branch","name":"Талдыкорган","slug":"taldykorgan","salt":"K6+p6HI60XUuZdcb","hash":"6ae365f601ea1101756b1ef952d71c4cb2586ebaadd2694a1451a2c78aadbe97","url":"branches/taldykorgan.html","encSalt":"gFjUZWZSWp+ax0dsudazYQ=="},{"role":"branch","name":"Тараз","slug":"taraz","salt":"cGvLfkAAQ+eHRgdD","hash":"54efb62c4c052166669832826bc99a3cd5ad6747c916b5ea24ecc533f96bd7b0","url":"branches/taraz.html","encSalt":"dWXCMglzDsezvwYgl7OY0A=="},{"role":"branch","name":"Уральск","slug":"uralsk","salt":"iPsU7Lxu+LcWIcTc","hash":"9607eaca17ec80e70edee072af5ef5e75a2a46dd247064e92af247603c1af84f","url":"branches/uralsk.html","encSalt":"i0Xo3WucVbvsBq2rd/HlZw=="},{"role":"branch","name":"Усть-Каменогорск","slug":"ust-kamenogorsk","salt":"kBFCLRs5kTWZK5XU","hash":"80bb40a6d734d8a245199b46a3cc22515e6f135083a43c24aa05661b4687d5a2","url":"branches/ust-kamenogorsk.html","encSalt":"K4ay0dqKRkSVPb6i6SHUeg=="},{"role":"branch","name":"Шымкент","slug":"shymkent","salt":"20P13umSUiAhB9jv","hash":"302962f91f0aea94ed08e912e7382a03d1f8ec99c9e785a8fa4eec205ba9b229","url":"branches/shymkent.html","encSalt":"6EnIFGgPTxLk0+/slZ8XLQ=="}];
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
