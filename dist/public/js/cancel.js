/**
 * Cancel & Exit button handler.
 * Shows a confirmation modal; on confirm, clears session and returns to splash.
 * Re-inits on page:enter so the cancel button works after every AJAX navigation.
 */
(function () {
  var _modalListening = false;

  function init() {
    var cancelBtn = document.getElementById('cancel-btn');
    var modal = document.getElementById('cancel-modal');
    if (!cancelBtn || !modal) return;

    // cancelBtn lives inside <main> and is replaced on every AJAX swap,
    // so we always attach a fresh listener to the new element.
    cancelBtn.addEventListener('click', function () {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });

    // modal, cancel-no, cancel-yes live in overlays (outside <main>),
    // so they are never replaced — only register their listeners once.
    if (!_modalListening) {
      _modalListening = true;
      var cancelNo  = document.getElementById('cancel-no');
      var cancelYes = document.getElementById('cancel-yes');
      if (cancelNo) {
        cancelNo.addEventListener('click', function () {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        });
      }
      if (cancelYes) {
        cancelYes.addEventListener('click', function () {
          sessionStorage.clear();
          window.location.href = '/';
        });
      }
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-attach to the new cancelBtn after every AJAX page swap
  document.addEventListener('page:enter', init);
})();
