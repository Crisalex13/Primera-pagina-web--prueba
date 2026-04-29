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

// Cuentas de prueba iniciales (CORREGIDO - ahora fuerza la creación)
(function initUsers() {
  const users = getUsers();
  
  // Usuarios por defecto que deben existir siempre
  const defaultUsers = [
    { name: 'Administrador', email: 'admin@audiostudio.com', password: '123456', role: 'admin' },
    { name: 'Cliente Demo', email: 'cliente@audiostudio.com', password: '123456', role: 'user' }
  ];
  
  // Verificar si faltan los usuarios importantes
  const hasAdmin = users.some(u => u.email === 'admin@audiostudio.com');
  const hasClient = users.some(u => u.email === 'cliente@audiostudio.com');
  
  // Si no hay usuarios O falta alguno de los principales, recrear todo
  if (users.length === 0 || !hasAdmin || !hasClient) {
    console.log('🔄 Creando/actualizando usuarios de prueba...');
    saveUsers(defaultUsers);
    console.log('✅ Usuarios listos:', getUsers());
  }
})();

// Si ya hay sesión activa, redirigir a la tienda
const session = localStorage.getItem('sn_session');
if (session) {
  try {
    const user = JSON.parse(session);
    if (user && user.email) {
      window.location.href = '../index.html';
    }
  } catch(e) {}
}

// ================================================================
//  HELPERS
// ================================================================
function get(id)  { return document.getElementById(id); }
function validEmail(email) { 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
}

function markErr(inputId, msgId, msg) {
  const input = get(inputId);
  if (input) {
    input.classList.remove('ok');
    input.classList.add('err');
  }
  if (msgId && get(msgId)) get(msgId).textContent = msg;
}

function markOk(inputId, msgId) {
  const input = get(inputId);
  if (input) {
    input.classList.remove('err');
    input.classList.add('ok');
  }
  if (msgId && get(msgId)) get(msgId).textContent = '';
}

function clearField(inputId, msgId) {
  const input = get(inputId);
  if (input) {
    input.classList.remove('err', 'ok');
  }
  if (msgId && get(msgId)) get(msgId).textContent = '';
}

function togglePassword(inputId, iconEl) {
  const inp = get(inputId);
  if (!inp) return;
  const isPassword = inp.type === 'password';
  inp.type = isPassword ? 'text' : 'password';
  const icon = iconEl.querySelector('i');
  if (icon) {
    icon.className = isPassword ? 'fas fa-eye' : 'fas fa-eye-slash';
  }
}

// ================================================================
//  TOGGLE PASSWORD
// ================================================================
const togglePass = get('togglePass');
const toggleRPass = get('toggleRPass');

if (togglePass) {
  togglePass.addEventListener('click', () => togglePassword('iPass', togglePass));
}
if (toggleRPass) {
  toggleRPass.addEventListener('click', () => togglePassword('rPass', toggleRPass));
}

// Limpiar errores al escribir
const iEmail = get('iEmail');
const iPass = get('iPass');
if (iEmail) iEmail.addEventListener('input', () => clearField('iEmail', 'eEmail'));
if (iPass) iPass.addEventListener('input', () => clearField('iPass', 'ePass'));

// ================================================================
//  LOGIN
// ================================================================
const loginForm = get('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let ok = true;
    const email = get('iEmail')?.value.trim() || '';
    const pass  = get('iPass')?.value || '';

    const alertErr = get('alertErr');
    if (alertErr) alertErr.classList.add('hidden');

    // Validaciones
    if (!email) {
      markErr('iEmail', 'eEmail', 'El email es obligatorio.');
      ok = false;
    } else if (!validEmail(email)) {
      markErr('iEmail', 'eEmail', 'Email no válido.');
      ok = false;
    } else {
      markOk('iEmail', 'eEmail');
    }

    if (!pass) {
      markErr('iPass', 'ePass', 'La contraseña es obligatoria.');
      ok = false;
    } else if (pass.length < 6) {
      markErr('iPass', 'ePass', 'Mínimo 6 caracteres.');
      ok = false;
    } else {
      markOk('iPass', 'ePass');
    }

    if (!ok) return;

    // Animación de carga
    const btnTxt = get('btnTxt');
    const btnSpin = get('btnSpin');
    const btnSignIn = get('btnSignIn');
    
    if (btnTxt) btnTxt.classList.add('hidden');
    if (btnSpin) btnSpin.classList.remove('hidden');
    if (btnSignIn) btnSignIn.disabled = true;

    setTimeout(() => {
      if (btnTxt) btnTxt.classList.remove('hidden');
      if (btnSpin) btnSpin.classList.add('hidden');
      if (btnSignIn) btnSignIn.disabled = false;

      const users = getUsers();
      console.log('📋 Usuarios disponibles:', users);
      
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === pass
      );

      if (user) {
        console.log('✅ Bienvenido:', user.name);
        localStorage.setItem('sn_session', JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role
        }));
        window.location.href = '../index.html';
      } else {
        console.log('❌ No se encontró usuario con:', email);
        const alertMsg = get('alertMsg');
        if (alertMsg) alertMsg.textContent = 'Email o contraseña incorrectos.';
        if (alertErr) alertErr.classList.remove('hidden');
        markErr('iEmail', 'eEmail', '');
        markErr('iPass', 'ePass', '');
      }
    }, 800);
  });
}

// ================================================================
//  MODAL REGISTRO
// ================================================================
const btnSignUp = get('btnSignUp');
const modalReg = get('modalReg');
const closeReg = get('closeReg');
const formReg = get('formReg');
const okReg = get('okReg');

if (btnSignUp) {
  btnSignUp.addEventListener('click', () => {
    if (modalReg) modalReg.classList.remove('hidden');
    if (formReg) formReg.reset();
    ['rName', 'rEmail', 'rPass', 'rPass2'].forEach(id => clearField(id, 'e' + id.charAt(0).toUpperCase() + id.slice(1)));
    if (okReg) okReg.classList.add('hidden');
  });
}

if (closeReg) {
  closeReg.addEventListener('click', () => {
    if (modalReg) modalReg.classList.add('hidden');
  });
}

if (modalReg) {
  modalReg.addEventListener('click', e => {
    if (e.target === modalReg) modalReg.classList.add('hidden');
  });
}

if (formReg) {
  formReg.addEventListener('submit', function(e) {
    e.preventDefault();
    let ok = true;
    
    const name = get('rName')?.value.trim() || '';
    const email = get('rEmail')?.value.trim() || '';
    const pass = get('rPass')?.value || '';
    const pass2 = get('rPass2')?.value || '';

    if (okReg) okReg.classList.add('hidden');

    // Validaciones
    if (!name || name.length < 2) {
      markErr('rName', 'eRName', 'Nombre muy corto (mínimo 2 caracteres)');
      ok = false;
    } else {
      markOk('rName', 'eRName');
    }

    if (!email) {
      markErr('rEmail', 'eREmail', 'El email es obligatorio');
      ok = false;
    } else if (!validEmail(email)) {
      markErr('rEmail', 'eREmail', 'Email no válido');
      ok = false;
    } else {
      const users = getUsers();
      const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        markErr('rEmail', 'eREmail', 'Este email ya está registrado');
        ok = false;
      } else {
        markOk('rEmail', 'eREmail');
      }
    }

    if (!pass || pass.length < 6) {
      markErr('rPass', 'eRPass', 'Mínimo 6 caracteres');
      ok = false;
    } else {
      markOk('rPass', 'eRPass');
    }

    if (!pass2) {
      markErr('rPass2', 'eRPass2', 'Confirma tu contraseña');
      ok = false;
    } else if (pass !== pass2) {
      markErr('rPass2', 'eRPass2', 'Las contraseñas no coinciden');
      ok = false;
    } else {
      markOk('rPass2', 'eRPass2');
    }

    if (!ok) return;

    // Guardar nuevo usuario (siempre con rol 'user')
    const users = getUsers();
    users.push({ name, email, password: pass, role: 'user' });
    saveUsers(users);

    if (okReg) okReg.classList.remove('hidden');
    if (formReg) formReg.reset();

    setTimeout(() => {
      if (modalReg) modalReg.classList.add('hidden');
      if (okReg) okReg.classList.add('hidden');
      const emailInput = get('iEmail');
      if (emailInput) emailInput.value = email;
      markOk('iEmail', 'eEmail');
    }, 2000);
  });
}

// ================================================================
//  MODAL RECUPERAR CONTRASEÑA
// ================================================================
const linkForgot = get('linkForgot');
const modalForgot = get('modalForgot');
const closeForgot = get('closeForgot');
const formForgot = get('formForgot');
const okForgot = get('okForgot');

if (linkForgot) {
  linkForgot.addEventListener('click', e => {
    e.preventDefault();
    if (modalForgot) modalForgot.classList.remove('hidden');
    if (formForgot) formForgot.reset();
    clearField('fEmail', 'eFEmail');
    if (okForgot) okForgot.classList.add('hidden');
  });
}

if (closeForgot) {
  closeForgot.addEventListener('click', () => {
    if (modalForgot) modalForgot.classList.add('hidden');
  });
}

if (modalForgot) {
  modalForgot.addEventListener('click', e => {
    if (e.target === modalForgot) modalForgot.classList.add('hidden');
  });
}

if (formForgot) {
  formForgot.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = get('fEmail')?.value.trim() || '';

    if (okForgot) okForgot.classList.add('hidden');

    if (!email) {
      markErr('fEmail', 'eFEmail', 'Ingresa tu email');
      return;
    }
    if (!validEmail(email)) {
      markErr('fEmail', 'eFEmail', 'Email no válido');
      return;
    }

    markOk('fEmail', 'eFEmail');
    
    // Buscar usuario (solo para demostración)
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      console.log('[Demo] Tu contraseña es:', user.password);
    }

    if (okForgot) okForgot.classList.remove('hidden');
    
    setTimeout(() => {
      if (modalForgot) modalForgot.classList.add('hidden');
      if (okForgot) okForgot.classList.add('hidden');
    }, 2500);
  });
}

// ================================================================
//  BOTÓN DE RESET PARA DESARROLLO (útil para pruebas)
// ================================================================
// Agrega este botón en tu HTML si lo necesitas:
// <button id="devResetBtn" style="position: fixed; bottom: 10px; left: 10px; background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 11px; cursor: pointer; z-index: 9999;">🔄 Reset Usuarios</button>

const resetBtn = document.getElementById('devResetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    const confirmar = confirm('⚠️ Esto eliminará TODOS los usuarios y la sesión actual. ¿Continuar?');
    if (confirmar) {
      localStorage.removeItem('sn_users');
      localStorage.removeItem('sn_session');
      const defaultUsers = [
        { name: 'Administrador', email: 'admin@audiostudio.com', password: '123456', role: 'admin' },
        { name: 'Cliente Demo', email: 'cliente@audiostudio.com', password: '123456', role: 'user' }
      ];
      localStorage.setItem('sn_users', JSON.stringify(defaultUsers));
      alert('✅ Usuarios reseteados correctamente');
      location.reload();
    }
  });
}