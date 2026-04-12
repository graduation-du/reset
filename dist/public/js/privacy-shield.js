/**
 * Privacy Shield — Toggle sensitive field masking
 * Adds eye icon buttons to inputs with data-privacy attribute.
 */
const PrivacyShield = (function () {
  function init() {
    document.querySelectorAll('[data-privacy]').forEach(input => {
      if (input.dataset.privacyInit) return;
      input.dataset.privacyInit = 'true';

      const wrapper = input.closest('.relative') || input.parentElement;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.tabIndex = -1;
      btn.className = 'privacy-toggle absolute top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant transition-colors z-10';
      btn.innerHTML = '<span class="material-symbols-outlined text-xl">visibility</span>';

      let masked = false;
      btn.addEventListener('click', () => {
        masked = !masked;
        if (masked) {
          input.style.webkitTextSecurity = 'disc';
          input.style.textSecurity = 'disc';
          btn.innerHTML = '<span class="material-symbols-outlined text-xl">visibility_off</span>';
        } else {
          input.style.webkitTextSecurity = 'none';
          input.style.textSecurity = 'none';
          btn.innerHTML = '<span class="material-symbols-outlined text-xl">visibility</span>';
        }
        if (typeof AudioFeedback !== 'undefined') AudioFeedback.play('click');
      });

      wrapper.style.position = 'relative';
      wrapper.appendChild(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-scan new inputs after each AJAX page swap
  document.addEventListener('page:enter', init);

  return { init };
})();
