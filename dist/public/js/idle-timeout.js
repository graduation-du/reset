/**
 * Idle Timeout Handler — Enhanced with Countdown Ring (#11) + Auto-Clear Wipe (#12)
 * Shows a warning overlay with circular countdown after IDLE_TIMEOUT ms.
 * Plays wipe animation on session clear.
 */
(function () {
  const IDLE_TIMEOUT = parseInt(document.body.dataset.idleTimeout || '60000');
  const IDLE_WARNING = parseInt(document.body.dataset.idleWarning || '10000');
  const RING_CIRCUMFERENCE = 2 * Math.PI * 54; // ~339.29

  // Only activate on screens that opt in
  const main = document.querySelector('[data-idle-enabled="true"]');
  if (!main) return;

  const overlay = document.getElementById('idle-overlay');
  const countdownEl = document.getElementById('idle-countdown');
  const countdownTextEl = document.getElementById('idle-countdown-text');
  const ringEl = document.getElementById('idle-ring');
  const dismissBtn = document.getElementById('idle-dismiss');
  if (!overlay) return;

  // Set ring dasharray
  if (ringEl) {
    ringEl.style.strokeDasharray = RING_CIRCUMFERENCE;
    ringEl.style.strokeDashoffset = 0;
  }

  let idleTimer = null;
  let warningTimer = null;
  let countdownInterval = null;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    clearTimeout(warningTimer);
    clearInterval(countdownInterval);
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');

    idleTimer = setTimeout(showWarning, IDLE_TIMEOUT);
  }

  function showWarning() {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    const totalSecs = Math.floor(IDLE_WARNING / 1000);
    let remaining = totalSecs;

    function updateRing() {
      if (countdownEl) countdownEl.textContent = remaining;
      if (countdownTextEl) countdownTextEl.textContent = remaining;
      if (ringEl) {
        const progress = (totalSecs - remaining) / totalSecs;
        ringEl.style.strokeDashoffset = RING_CIRCUMFERENCE * progress;
      }
    }
    updateRing();

    // Play warning sound
    if (typeof AudioFeedback !== 'undefined') AudioFeedback.play('warning');

    countdownInterval = setInterval(() => {
      remaining--;
      updateRing();

      // Tick sound in last 5 seconds
      if (remaining <= 5 && remaining > 0 && typeof AudioFeedback !== 'undefined') {
        AudioFeedback.play('click');
      }

      if (remaining <= 0) {
        clearInterval(countdownInterval);
        showWipeAndReset();
      }
    }, 1000);
  }

  // Auto-Clear Wipe Animation (#12)
  function showWipeAndReset() {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');

    const wipe = document.createElement('div');
    wipe.className = 'wipe-overlay';
    wipe.innerHTML = `
      <div class="wipe-icon flex flex-col items-center gap-3">
        <span class="material-symbols-outlined text-6xl text-primary">cleaning_services</span>
        <span class="font-headline font-bold text-xl text-white">Session Cleared</span>
      </div>
    `;
    document.body.appendChild(wipe);

    sessionStorage.clear();
    if (typeof ActivityLog !== 'undefined') ActivityLog.clear();

    setTimeout(() => {
      window.location.href = '/';
    }, 1100);
  }

  // Dismiss warning
  if (dismissBtn) {
    dismissBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof AudioFeedback !== 'undefined') AudioFeedback.play('click');
      resetIdleTimer();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      resetIdleTimer();
    }
  });

  // Listen for all interaction events
  const events = ['touchstart', 'touchmove', 'click', 'keydown', 'mousemove'];
  events.forEach(evt => {
    document.addEventListener(evt, () => {
      // Only reset if warning is not showing
      if (overlay.classList.contains('hidden')) {
        resetIdleTimer();
      }
    }, { passive: true });
  });

  // Start the timer
  resetIdleTimer();
})();
