/**
 * Cancel & Exit button handler.
 * Shows a confirmation modal; on confirm, clears session and returns to splash.
 */
(function () {
  const cancelBtn = document.getElementById('cancel-btn');
  const modal = document.getElementById('cancel-modal');
  const cancelNo = document.getElementById('cancel-no');
  const cancelYes = document.getElementById('cancel-yes');

  if (!cancelBtn || !modal) return;

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });

  cancelNo.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  cancelYes.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/';
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
})();
