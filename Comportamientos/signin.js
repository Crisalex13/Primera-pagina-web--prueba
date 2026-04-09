// ================================================================
//  USUARIOS — guardados en localStorage
//  Formato: { name, email, password, role }
//  role: 'admin' o 'user'
// ================================================================
function getUsers() {
  return JSON.parse(localStorage.getItem('sn_users') || '[]');
}
function saveUsers(u) {
  localStorage.setItem('sn_users', JSON.stringify(u));
}

// Cuentas de prueba iniciales
(function() {
  if (getUsers().length === 0) {
    saveUsers([
      { name: 'Admin',        email: 'admin@shopnova.com',   password: '123456', role: 'admin' },
      { name: 'Usuario Demo', email: 'usuario@shopnova.com', password: '123456', role: 'user'  }
    ]);
  }
})();

// Si ya hay sesion activa, ir directo a la tienda
if (localStorage.getItem('sn_session')) {
  window.location.href = '../index.html';
}

// ================================================================
//  HELPERS
// ================================================================
function get(id)  { return document.getElementById(id); }
function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

function markErr(inputId, msgId, msg) {
  get(inputId).classList.remove('ok'); get(inputId).classList.add('err');
  if (msgId) get(msgId).textContent = msg;
}
function markOk(inputId, msgId) {
  get(inputId).classList.remove('err'); get(inputId).classList.add('ok');
  if (msgId) get(msgId).textContent = '';
}
function clear(inputId, msgId) {
  get(inputId).classList.remove('err','ok');
  if (msgId) get(msgId).textContent = '';
}

function togglePwd(inputId, iconEl) {
  const inp = get(inputId);
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  iconEl.querySelector('i').className = show ? 'fas fa-eye' : 'fas fa-eye-slash';
}

// ================================================================
//  TOGGLE PASSWORD
// ================================================================
get('togglePass').addEventListener('click',  () => togglePwd('iPass',  get('togglePass')));
get('toggleRPass').addEventListener('click', () => togglePwd('rPass', get('toggleRPass')));

// Limpiar errores al escribir
get('iEmail').addEventListener('input', () => clear('iEmail','eEmail'));
get('iPass').addEventListener('input',  () => clear('iPass','ePass'));

// ================================================================
//  LOGIN
// ================================================================
get('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  let ok = true;
  const email = get('iEmail').value.trim();
  const pass  = get('iPass').value;

  get('alertErr').classList.add('hidden');

  if (!email)             { markErr('iEmail','eEmail','El email es obligatorio.'); ok=false; }
  else if(!validEmail(email)){ markErr('iEmail','eEmail','Email no valido.'); ok=false; }
  else                    { markOk('iEmail','eEmail'); }

  if (!pass)              { markErr('iPass','ePass','La contrasena es obligatoria.'); ok=false; }
  else if(pass.length<6)  { markErr('iPass','ePass','Minimo 6 caracteres.'); ok=false; }
  else                    { markOk('iPass','ePass'); }

  if (!ok) return;

  // Animacion de carga
  get('btnTxt').classList.add('hidden');
  get('btnSpin').classList.remove('hidden');
  get('btnSignIn').disabled = true;

  setTimeout(() => {
    get('btnTxt').classList.remove('hidden');
    get('btnSpin').classList.add('hidden');
    get('btnSignIn').disabled = false;

    const user = getUsers().find(u =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    );

    if (user) {
      localStorage.setItem('sn_session', JSON.stringify({
        name: user.name, email: user.email, role: user.role
      }));
      window.location.href = '../index.html';
    } else {
      get('alertMsg').textContent = 'Email o contrasena incorrectos.';
      get('alertErr').classList.remove('hidden');
      markErr('iEmail','eEmail',''); markErr('iPass','ePass','');
    }
  }, 800);
});

// ================================================================
//  MODAL REGISTRO
// ================================================================
get('btnSignUp').addEventListener('click', () => {
  get('modalReg').classList.remove('hidden');
  get('formReg').reset();
  ['rName','rEmail','rPass','rPass2'].forEach(id => clear(id, 'e'+id.charAt(0).toUpperCase()+id.slice(1)));
  get('okReg').classList.add('hidden');
});
get('closeReg').addEventListener('click',    () => get('modalReg').classList.add('hidden'));
get('modalReg').addEventListener('click',    e => { if(e.target===get('modalReg')) get('modalReg').classList.add('hidden'); });

get('formReg').addEventListener('submit', function(e) {
  e.preventDefault();
  let ok = true;
  const name  = get('rName').value.trim();
  const email = get('rEmail').value.trim();
  const pass  = get('rPass').value;
  const pass2 = get('rPass2').value;

  get('okReg').classList.add('hidden');

  if (!name || name.length<2) { markErr('rName','eRName','Nombre muy corto.'); ok=false; }
  else                         { markOk('rName','eRName'); }

  if (!email)                  { markErr('rEmail','eREmail','El email es obligatorio.'); ok=false; }
  else if(!validEmail(email))  { markErr('rEmail','eREmail','Email no valido.'); ok=false; }
  else {
    const existe = getUsers().find(u => u.email.toLowerCase()===email.toLowerCase());
    if (existe) { markErr('rEmail','eREmail','Este email ya esta registrado.'); ok=false; }
    else          { markOk('rEmail','eREmail'); }
  }

  if (!pass || pass.length<6) { markErr('rPass','eRPass','Minimo 6 caracteres.'); ok=false; }
  else                         { markOk('rPass','eRPass'); }

  if (!pass2)       { markErr('rPass2','eRPass2','Confirma tu contrasena.'); ok=false; }
  else if(pass!==pass2){ markErr('rPass2','eRPass2','Las contrasenas no coinciden.'); ok=false; }
  else               { markOk('rPass2','eRPass2'); }

  if (!ok) return;

  // Guardar nuevo usuario (siempre con rol 'user')
  const users = getUsers();
  users.push({ name, email, password: pass, role: 'user' });
  saveUsers(users);

  get('okReg').classList.remove('hidden');
  get('formReg').reset();

  setTimeout(() => {
    get('modalReg').classList.add('hidden');
    get('okReg').classList.add('hidden');
    get('iEmail').value = email;
    markOk('iEmail','eEmail');
  }, 2000);
});

// ================================================================
//  MODAL RECUPERAR
// ================================================================
get('linkForgot').addEventListener('click', e => {
  e.preventDefault();
  get('modalForgot').classList.remove('hidden');
  get('formForgot').reset();
  clear('fEmail','eFEmail');
  get('okForgot').classList.add('hidden');
});
get('closeForgot').addEventListener('click',   () => get('modalForgot').classList.add('hidden'));
get('modalForgot').addEventListener('click',   e => { if(e.target===get('modalForgot')) get('modalForgot').classList.add('hidden'); });

get('formForgot').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = get('fEmail').value.trim();
  get('okForgot').classList.add('hidden');

  if (!email)              { markErr('fEmail','eFEmail','Ingresa tu email.'); return; }
  if (!validEmail(email))  { markErr('fEmail','eFEmail','Email no valido.'); return; }

  markOk('fEmail','eFEmail');
  // En produccion aqui se enviaria el correo
  const u = getUsers().find(u => u.email.toLowerCase()===email.toLowerCase());
  if (u) console.log('[ShopNova Demo] Contrasena:', u.password);

  get('okForgot').classList.remove('hidden');
  setTimeout(() => {
    get('modalForgot').classList.add('hidden');
    get('okForgot').classList.add('hidden');
  }, 2500);
});