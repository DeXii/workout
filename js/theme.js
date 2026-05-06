/**
 * Theme Module
 * Light/Dark theme switcher with persistence
 */

/* global notify */

const themes = {
  dark: {
    bg1: '#0a0a0f',
    bg2: '#111118',
    bg3: '#1a1a24',
    bg4: '#20202e',
    a1: '#00d4ff',
    a2: '#7c3aed',
    a3: '#10b981',
    a4: '#f59e0b',
    a5: '#ef4444',
    a6: '#f43f8f',
    t1: '#f0f0f0',
    t2: '#a0a0b0',
    t3: '#606070',
    brd: 'rgba(255,255,255,0.07)'
  },
  light: {
    bg1: '#ffffff',
    bg2: '#f8f9fa',
    bg3: '#e9ecef',
    bg4: '#dee2e6',
    a1: '#0066cc',
    a2: '#6610f2',
    a3: '#0d8a5f',
    a4: '#d97706',
    a5: '#dc2626',
    a6: '#db2777',
    t1: '#1a1a1a',
    t2: '#4a4a4a',
    t3: '#8a8a8a',
    brd: 'rgba(0,0,0,0.1)'
  }
};

function applyTheme(themeName) {
  const theme = themes[themeName];
  if (!theme) return;

  const root = document.documentElement;

  Object.keys(theme).forEach(key => {
    root.style.setProperty(`--${key}`, theme[key]);
  });

  // Save preference
  localStorage.setItem('ay_theme', themeName);

  // Update theme toggle button if exists
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = themeName === 'dark' ? '☀️' : '🌙';
    themeToggle.title = themeName === 'dark' ? 'Светлая тема' : 'Темная тема';
  }

  // Update body class for additional styling
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(`theme-${themeName}`);

  console.log(`Theme switched to: ${themeName}`);
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('ay_theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);

  // Notify user
  if (typeof notify === 'function') {
    notify(`Тема изменена на ${newTheme === 'dark' ? 'темную' : 'светлую'}`, 'success');
  }
}

function initTheme() {
  // Check saved preference
  const savedTheme = localStorage.getItem('ay_theme');

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem('ay_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function getCurrentTheme() {
  return localStorage.getItem('ay_theme') || 'dark';
}

function createThemeToggleButton() {
  const currentTheme = getCurrentTheme();
  const icon = currentTheme === 'dark' ? '☀️' : '🌙';
  const title = currentTheme === 'dark' ? 'Светлая тема' : 'Темная тема';

  return `
    <button
      id="theme-toggle"
      class="btn btn-gh btn-sm"
      onclick="toggleTheme()"
      title="${title}"
      style="font-size:1.2em;padding:6px 10px;"
    >
      ${icon}
    </button>
  `;
}

// Export functions
if (typeof window !== 'undefined') {
  window.themeModule = {
    applyTheme,
    toggleTheme,
    initTheme,
    getCurrentTheme,
    createThemeToggleButton,
    themes
  };

  // Make toggleTheme globally accessible for onclick
  window.toggleTheme = toggleTheme;
}
