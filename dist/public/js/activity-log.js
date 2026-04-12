/**
 * Session Activity Log — Tracks completed verification steps
 * Provides a collapsible panel showing what has been verified.
 */
const ActivityLog = (function () {
  const LOG_KEY = 'du-activity-log';

  function getLog() {
    try { return JSON.parse(sessionStorage.getItem(LOG_KEY) || '[]'); } catch { return []; }
  }

  function addEntry(icon, key, time) {
    const log = getLog();
    log.push({ icon, key, time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    sessionStorage.setItem(LOG_KEY, JSON.stringify(log));
    renderPanel();
  }

  function clear() {
    sessionStorage.removeItem(LOG_KEY);
    // Also hide the panel immediately so stale entries don't show
    var panel = document.getElementById('activity-log-panel');
    if (panel) {
      panel.classList.add('hidden');
      var list = panel.querySelector('.activity-log-list');
      if (list) list.innerHTML = '';
    }
  }

  function renderPanel() {
    const panel = document.getElementById('activity-log-panel');
    if (!panel) return;

    const log = getLog();
    const list = panel.querySelector('.activity-log-list');
    if (!list) return;

    if (log.length === 0) {
      panel.classList.add('hidden');
      return;
    }

    panel.classList.remove('hidden');
    list.innerHTML = log.map(entry => `
      <div class="flex items-center gap-2 py-1.5">
        <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
        <span class="text-on-surface-variant text-xs flex-1" data-i18n="${entry.key}">${typeof I18N !== 'undefined' ? I18N.t(entry.key) : entry.key}</span>
        <span class="text-on-surface-variant/40 text-[10px] font-mono">${entry.time}</span>
      </div>
    `).join('');
  }

  // Render on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPanel);
  } else {
    renderPanel();
  }

  // Re-render log panel after each AJAX page swap
  document.addEventListener('page:enter', renderPanel);

  return { addEntry, clear, getLog, renderPanel };
})();
