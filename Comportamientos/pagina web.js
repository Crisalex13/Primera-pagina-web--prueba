// ========== MENÚ HAMBURGUESA ==========
const menuBtn = document.getElementById('menuButton');
const menuContainer = document.getElementById('menuContainer');

if (menuBtn && menuContainer) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuContainer.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!menuContainer.contains(e.target)) {
      menuContainer.classList.remove('active');
    }
  });
}

// ========== TOGGLE DÍA/NOCHE DESLIZANTE ==========
const themeCheckbox = document.getElementById('themeToggleCheckbox');

function loadThemeWithToggle() {
  const savedTheme = localStorage.getItem('theme');
  const isLightMode = savedTheme === 'light';
  
  if (themeCheckbox) {
    themeCheckbox.checked = isLightMode;
  }
  
  if (isLightMode) {
    document.documentElement.classList.add('light-mode');
  } else {
    document.documentElement.classList.remove('light-mode');
  }
}

function toggleThemeWithAnimation(isLight) {
  const oldTheme = document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
  const newTheme = isLight ? 'light' : 'dark';
  
  if (oldTheme === newTheme) return;
  
  if (isLight) {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    showThemeNotification('☀️ Modo Día activado', '#f8f9fa');
  } else {
    document.documentElement.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    showThemeNotification('🌙 Modo Noche activado', '#1a1a2e');
  }
}

function showThemeNotification(message, bgColor) {
  const oldNotification = document.querySelector('.theme-notification');
  if (oldNotification) oldNotification.remove();
  
  const notification = document.createElement('div');
  notification.className = 'theme-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: ${bgColor};
    color: ${bgColor === '#1a1a2e' ? '#fff' : '#212529'};
    padding: 12px 24px;
    border-radius: 40px;
    font-weight: 600;
    z-index: 9999;
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    pointer-events: none;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';
    setTimeout(() => notification.remove(), 400);
  }, 2000);
}

if (themeCheckbox) {
  themeCheckbox.addEventListener('change', (e) => {
    toggleThemeWithAnimation(e.target.checked);
  });
}

loadThemeWithToggle();

// ========== FILTRO DE BÚSQUEDA Y CATEGORÍA ==========
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cards = document.querySelectorAll('.card');

function filterProducts() {
  if (!searchInput || !categoryFilter) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  cards.forEach(card => {
    const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
    const description = card.querySelector('p')?.innerText.toLowerCase() || '';
    const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
    const matchesCategory = (category === 'all') || (card.dataset.category === category);
    
    if (matchesSearch && matchesCategory) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

if (searchInput && categoryFilter) {
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
}

// ========== BOTONES DE COMPRA ==========
document.querySelectorAll('.card-content button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const product = btn.closest('.card')?.querySelector('h3')?.innerText || 'Producto';
    alert(`🛒 Agregaste "${product}" al carrito`);
  });
});

// ========== CERRAR MENÚ AL HACER CLIC EN ITEMS ==========
document.querySelectorAll('.more-button-list-item').forEach(item => {
  item.addEventListener('click', () => {
    if (menuContainer) menuContainer.classList.remove('active');
    console.log(`📌 Seleccionaste: ${item.querySelector('span')?.innerText || 'opción'}`);
  });
});

// ========== HEADER OCULTABLE AL HACER SCROLL ==========
let lastScroll = 0;
const header = document.querySelector('.header');
const scrollThreshold = 50;

if (header) {
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= scrollThreshold) {
      header.classList.remove('hide');
      return;
    }
    
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      header.classList.add('hide');
    } else if (currentScroll < lastScroll) {
      header.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
  });
}

// ========== ABRIR SIDEBAR DESDE EL MENÚ ==========
const configMenuItem = document.querySelector('.more-button-list-item:first-child');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebar');

if (configMenuItem && sidebar) {
  configMenuItem.addEventListener('click', () => {
    sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    if (menuContainer) menuContainer.classList.remove('active');
  });
}

if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', () => {
    if (sidebar) sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });
}

if (sidebar) {
  sidebar.addEventListener('click', (e) => e.stopPropagation());
}

// ========== TOGGLE DE TEMA DENTRO DEL SIDEBAR ==========
const themeToggleSidebar = document.getElementById('themeToggleSidebar');
const themeOptions = document.querySelectorAll('.theme-option');

function updateSidebarThemeUI(theme) {
  themeOptions.forEach(opt => {
    if (opt.getAttribute('data-theme') === theme) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });
  
  if (themeToggleSidebar) {
    themeToggleSidebar.setAttribute('data-theme-state', theme);
  }
}

function loadThemeInSidebar() {
  const savedTheme = localStorage.getItem('theme');
  const currentTheme = savedTheme === 'light' ? 'light' : 'dark';
  updateSidebarThemeUI(currentTheme);
}

function setThemeFromSidebar(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
    showThemeNotification('☀️ Modo Día activado', '#f8f9fa');
    if (themeCheckbox) themeCheckbox.checked = true;
  } else {
    document.documentElement.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
    showThemeNotification('🌙 Modo Noche activado', '#1a1a2e');
    if (themeCheckbox) themeCheckbox.checked = false;
  }
  updateSidebarThemeUI(theme);
}

themeOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    e.stopPropagation();
    const theme = option.getAttribute('data-theme');
    setThemeFromSidebar(theme);
  });
});

if (themeToggleSidebar) {
  themeToggleSidebar.addEventListener('click', (e) => {
    if (!e.target.classList.contains('theme-option')) {
      const currentState = themeToggleSidebar.getAttribute('data-theme-state');
      const newTheme = currentState === 'light' ? 'dark' : 'light';
      setThemeFromSidebar(newTheme);
    }
  });
}

loadThemeInSidebar();

// ========== OPCIONES DEL SIDEBAR ==========
const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
  languageSelect.addEventListener('change', (e) => {
    console.log(`🌐 Idioma cambiado a: ${e.target.value}`);
  });
}

const notificationsToggle = document.getElementById('notificationsToggle');
if (notificationsToggle) {
  const savedNotifications = localStorage.getItem('notifications');
  if (savedNotifications === 'false') {
    notificationsToggle.checked = false;
  }
  
  notificationsToggle.addEventListener('change', (e) => {
    localStorage.setItem('notifications', e.target.checked);
    console.log(`🔔 Notificaciones: ${e.target.checked ? 'Activadas' : 'Desactivadas'}`);
  });
}

// ============================================================
// ========== SESIÓN Y PERFIL DE USUARIO (CORREGIDO) ==========
// ============================================================

// Mostrar el rol del usuario en el header
function loadUserStatus() {
  const session = localStorage.getItem('sn_session');
  const statusDisplay = document.getElementById('statusDisplay');
  const userRoleText = document.getElementById('userRoleText');
  
  if (!statusDisplay || !userRoleText) return;
  
  if (session) {
    try {
      const user = JSON.parse(session);
      const role = user.role;
      
      if (role === 'admin') {
        userRoleText.textContent = 'Administrador';
        statusDisplay.setAttribute('data-role', 'admin');
        const icon = statusDisplay.querySelector('i');
        if (icon) icon.className = 'fas fa-crown';
      } else {
        userRoleText.textContent = 'Cliente';
        statusDisplay.setAttribute('data-role', 'user');
        const icon = statusDisplay.querySelector('i');
        if (icon) icon.className = 'fas fa-user';
      }
    } catch (e) {
      userRoleText.textContent = 'Invitado';
      const icon = statusDisplay.querySelector('i');
      if (icon) icon.className = 'fas fa-user-circle';
    }
  } else {
    userRoleText.textContent = 'Invitado';
    const icon = statusDisplay.querySelector('i');
    if (icon) icon.className = 'fas fa-user-circle';
  }
}

// Botón Cerrar Sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    const confirmar = confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmar) {
      localStorage.removeItem('sn_session');
      alert('👋 Sesión cerrada correctamente');
      window.location.href = 'index.html';
    }
  });
}

// Botón Mi Perfil (UNIFICADO - sin duplicados)
const perfilBtn = document.getElementById('btnPerfil');
if (perfilBtn) {
  // Eliminar eventos anteriores clonando el botón (opcional, pero seguro)
  const newPerfilBtn = perfilBtn.cloneNode(true);
  perfilBtn.parentNode.replaceChild(newPerfilBtn, perfilBtn);
  
  newPerfilBtn.addEventListener('click', () => {
    const session = localStorage.getItem('sn_session');
    
    if (!session) {
      // No hay sesión activa
      const irLogin = confirm('⚠️ No has iniciado sesión.\n¿Quieres ir a la página de login?');
      if (irLogin) {
        window.location.href = 'Estructura/signin.html';
      }
    } else {
      // Hay sesión activa - mostrar perfil
      try {
        const user = JSON.parse(session);
        let mensaje = '📋 MI PERFIL\n\n';
        mensaje += `👤 Nombre: ${user.name}\n`;
        mensaje += `📧 Email: ${user.email}\n`;
        mensaje += `👑 Rol: ${user.role === 'admin' ? 'Administrador' : 'Cliente'}\n\n`;
        mensaje += '🚧 Próximamente: Editar perfil, historial de compras y más.';
        
        alert(mensaje);
        
        // Si quieres redirigir a una página de perfil dedicada:
        // window.location.href = 'Estructura/perfil.html';
        
      } catch(e) {
        console.error('Error al parsear sesión:', e);
        alert('Error al cargar los datos del usuario. Por favor, vuelve a iniciar sesión.');
        localStorage.removeItem('sn_session');
        window.location.href = 'Estructura/signin.html';
      }
    }
  });
}

// Botón Crear Cuenta (solo redirige, sin alert duplicado)
const registerBtn = document.querySelector('.btn-register');
if (registerBtn) {
  registerBtn.addEventListener('click', (e) => {
    // No hacer nada adicional, el onclick del HTML ya redirige
    console.log('📝 Redirigiendo a registro...');
  });
}

// Inicializar todo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadUserStatus();
  console.log('🎧 AudioStudio - Tu tienda de sonido profesional');
});

// Escuchar cambios en localStorage (útil si se cierra sesión en otra pestaña)
window.addEventListener('storage', (e) => {
  if (e.key === 'sn_session') {
    loadUserStatus();
  }
});