const THEME_KEY = 'bmi-theme-preference';

function applyTheme(mode) {
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  return isDark;
}

function updateToggleState(button, isDark) {
  if (!button) return;
  const icon = button.querySelector('span');
  if (icon) {
    icon.textContent = isDark ? '🌙' : '☀️';
  }
  button.setAttribute('aria-pressed', String(isDark));
  button.setAttribute('data-mode', isDark ? 'dark' : 'light');
}

export function initThemeToggle(button) {
  if (!button) return;

  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialMode = stored ?? (prefersDark ? 'dark' : 'light');
  const isDark = applyTheme(initialMode);
  updateToggleState(button, isDark);

  button.addEventListener('click', () => {
    const nextMode = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    const nextIsDark = applyTheme(nextMode);
    localStorage.setItem(THEME_KEY, nextMode);
    updateToggleState(button, nextIsDark);
  });
}
