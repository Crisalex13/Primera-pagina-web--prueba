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

function updateThemeBasedOnCheckbox(isLight) {
  if (isLight) {
    document.documentElement.classList.add('light-mode');
    if (themeCheckbox) themeCheckbox.checked = true;
  } else {
    document.documentElement.classList.remove('light-mode');
    if (themeCheckbox) themeCheckbox.checked = false;
  }
}

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

function detectSystemThemeForToggle() {
  const savedTheme = localStorage.getItem('theme');
  
  if (!savedTheme) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (!prefersDark && themeCheckbox) {
      themeCheckbox.checked = true;
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }
}

detectSystemThemeForToggle();

// ========== FILTRO DE BÚSQUEDA Y CATEGORÍA ==========
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const cards = document.querySelectorAll('.card');

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  cards.forEach(card => {
    const title = card.querySelector('h3').innerText.toLowerCase();
    const description = card.querySelector('p').innerText.toLowerCase();
    const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
    const matchesCategory = (category === 'all') || (card.dataset.category === category);
    
    if (matchesSearch && matchesCategory) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);

// ========== BOTONES INTERACTIVOS ==========
document.querySelectorAll('.btn-perfil, .btn-register').forEach(btn => {
  btn.addEventListener('click', (e) => {
    console.log(`📢 Click en: ${btn.innerText}`);
    alert(`🔔 ${btn.innerText} - Funcionalidad en desarrollo`);
  });
});

document.querySelectorAll('.card-content button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const product = btn.closest('.card').querySelector('h3').innerText;
    alert(`🛒 Agregaste "${product}" al carrito`);
  });
});

// Cerrar menú al hacer clic en items del menú
document.querySelectorAll('.more-button-list-item').forEach(item => {
  item.addEventListener('click', () => {
    if (menuContainer) menuContainer.classList.remove('active');
    console.log(`📌 Seleccionaste: ${item.querySelector('span')?.innerText || 'opción'}`);
  });
});

// Mensaje de bienvenida en consola
console