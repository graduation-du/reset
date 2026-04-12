/**
 * Idle Timeout Handler — Enhanced with Countdown Ring + Auto-Clear Wipe
 * Exposed as IdleTimeoutController so page-router can call .init() after each AJAX navigation.
 * Event listeners are registered only ONCE (guarded by _eventsRegistered).
 */
var IdleTimeoutController = (function () {
  var RING_CIRCUMFERENCE = 2 * Math.PI * 54; // ~339.29

  var _idleTimer        = null;
  var _countdownInterval = null;
  var _eventsRegistered = false;
  var _active           = false;

  function _cfg() {
    return {
      idle: parseInt((document.body && document.body.dataset.idleTimeout) || '60000'),
      warn: parseInt((document.body && document.body.dataset.idleWarning)  || '10000')
    };
  }

  function _clearTimers() {
    clearTimeout(_idleTimer);
    clearInterval(_countdownInterval);
    _idleTimer = _countdownInterval = null;
  }

  function _hideOverlay() {
    var ov = document.getElementById('idle-overlay');
    if (ov) { ov.classList.add('hidden'); ov.classList.remove('flex'); }
  }

  function _resetTimer() {
    _clearTimers();
    _hideOverlay();
    if (!_active) return;
    _idleTimer = setTimeout(_showWarning, _cfg().idle);
  }

  function _showWarning() {
    var overlay        = document.getElementById('idle-overlay');
    var countdownEl    = document.getElementById('idle-countdown');
    var countdownTextEl = document.getElementById('idle-countdown-text');
    var ringEl         = document.getElementById('idle-ring');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    var cfg       = _cfg();
    var totalSecs = Math.floor(cfg.warn / 1000);
    var remaining = totalSecs;

    if (ringEl) {
      ringEl.style.strokeDasharray  = RING_CIRCUMFERENCE;
      ringEl.style.strokeDashoffset = 0;
    }

    function _updateRing() {
      if (countdownEl)     countdownEl.textContent     = remaining;
      if (countdownTextEl) countdownTextEl.textContent = remaining;
      if (ringEl) {
        ringEl.style.strokeDashoffset =
          RING_CIRCUMFERENCE * ((totalSecs - remaining) / totalSecs);
      }
    }
    _updateRing();

    if (typeof AudioFeedback !== 'undefined') AudioFeedback.play('warning');

    _countdownInterval = setInterval(function () {
      remaining--;
      _updateRing();
      if (remaining <= 5 && remaining > 0 && typeof AudioFeedback !== 'undefined') {
        AudioFeedback.play('click');
      }
      if (remaining <= 0) {
        clearInterval(_countdownInterval);
        _wipeAndReset();
      }
    }, 1000);
  }

  function _wipeAndReset() {
    _hideOverlay();
    var wipe = document.createElement('div');
    wipe.className = 'wipe-overlay';
    wipe.innerHTML =
      '<div class="wipe-icon flex flex-col items-center gap-3">' +
      '<span class="material-symbols-outlined text-6xl text-primary">cleaning_services</span>' +
      '<span class="font-headline font-bold text-xl text-white">Session Cleared</span></div>';
    document.body.appendChild(wipe);
    sessionStorage.clear();
    if (typeof ActivityLog !== 'undefined') ActivityLog.clear();
    setTimeout(function () { window.location.href = '/'; }, 1100);
  }

  // ── Register document-level event listeners ONCE ──────────────────────────
  function _registerEvents() {
    if (_eventsRegistered) return;
    _eventsRegistered = true;

    // Dismiss button (capture phase so stopPropagation works reliably)
    document.addEventListener('click', function (e) {
      var overlay    = document.getElementById('idle-overlay');
      var dismissBtn = document.getElementById('idle-dismiss');
      if (!overlay || overlay.classList.contains('hidden')) return;

      if (dismissBtn && (e.target === dismissBtn || dismissBtn.contains(e.target))) {
        e.stopPropagation();
        if (typeof AudioFeedback !== 'undefined') AudioFeedback.play('click');
        _resetTimer();
      } else if (e.target === overlay) {
        _resetTimer();
      }
    }, true);

    // User activity resets the timer when warning overlay is not showing
    ['touchstart', 'touchmove', 'keydown', 'mousemove'].forEach(function (evt) {
      document.addEventListener(evt, function () {
        var overlay = document.getElementById('idle-overlay');
        if (_active && overlay && overlay.classList.contains('hidden')) _resetTimer();
      }, { passive: true });
    });
  }

  // ── Public init — called on first load and after each AJAX navigation ─────
  function init() {
    _clearTimers();
    var main = document.querySelector('[data-idle-enabled="true"]');
    if (!main) {
      _active = false;
      return;
    }
    _active = true;
    _registerEvents();
    _resetTimer();
  }

  // Auto-init on first page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init on every AJAX page change
  document.addEventListener('page:enter', init);

  return { init: init };
}());
