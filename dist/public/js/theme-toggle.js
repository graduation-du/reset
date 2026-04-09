/**
 * Theme Toggle — Light / Dark Mode
 * Manages the 'dark' class on <html> and persists choice in localStorage.
 * Default: dark (matching the kiosk branded design).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'du-theme';
  var html = document.documentElement;
  var btn, icon;

  // Read saved preference — default to dark
  var saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  applyTheme(saved);

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateIcon();
  }

  function updateIcon() {
    if (!icon) return;
    var isDark = html.classList.contains('dark');
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  function toggle() {
    var isDark = html.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  function init() {
    btn = document.getElementById('theme-toggle');
    if (!btn) return;
    icon = btn.querySelector('.material-symbols-outlined');
    updateIcon();

    btn.addEventListener('click', function () {
      toggle();
      // Play audio feedback if available
      if (typeof AudioFeedback !== 'undefined' && AudioFeedback.play) {
        AudioFeedback.play('tap');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
