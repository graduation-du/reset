/**
 * On-Screen Virtual Keyboard — Kiosk Touch Input
 * Supports numeric, alphanumeric, and text modes.
 * Optimised for 1080×1920 portrait kiosk with touch screen.
 * Uses Pointer Events for universal mouse + touch support on Windows 11 Chrome.
 */
const VirtualKeyboard = (function () {
  let activeInput = null;
  let kbEl = null;
  let mode = 'alpha'; // 'alpha' | 'numeric'
  let shifted = false;
  let visible = false;

  const layouts = {
    alpha: [
      ['1','2','3','4','5','6','7','8','9','0'],
      ['q','w','e','r','t','y','u','i','o','p'],
      ['a','s','d','f','g','h','j','k','l'],
      ['{shift}','z','x','c','v','b','n','m','{backspace}'],
      ['{space}','{done}']
    ],
    numeric: [
      ['1','2','3'],
      ['4','5','6'],
      ['7','8','9'],
      ['{clear}','0','{backspace}'],
      ['{done}']
    ]
  };

  function create() {
    if (kbEl) return;
    kbEl = document.createElement('div');
    kbEl.id = 'virtual-keyboard';
    kbEl.className = 'vkb-container';
    kbEl.innerHTML = '<div class="vkb-inner"></div>';
    document.body.appendChild(kbEl);

    // Prevent keyboard container from stealing focus via mouse
    kbEl.addEventListener('mousedown', e => e.preventDefault());
    // Prevent touch-based focus steal on container background
    kbEl.addEventListener('pointerdown', e => {
      if (e.target === kbEl || e.target.classList.contains('vkb-inner') || e.target.classList.contains('vkb-row')) {
        e.preventDefault();
      }
    });
  }

  // Universal tap handler using Pointer Events (works for mouse + touch on Windows 11 Chrome)
  function onTap(btn, handler) {
    btn.addEventListener('pointerdown', e => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add('vkb-key-pressed');
      handler();
      setTimeout(() => btn.classList.remove('vkb-key-pressed'), 150);
    });
  }

  function render() {
    const inner = kbEl.querySelector('.vkb-inner');
    const layout = layouts[mode];
    inner.innerHTML = '';

    layout.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'vkb-row';

      row.forEach(key => {
        const btn = document.createElement('button');
        btn.className = 'vkb-key';
        btn.type = 'button';
        btn.setAttribute('tabindex', '-1');

        if (key === '{shift}') {
          btn.classList.add('vkb-key-special');
          btn.innerHTML = '<span class="material-symbols-outlined">keyboard_capslock</span>';
          if (shifted) btn.classList.add('vkb-key-active');
          onTap(btn, () => { shifted = !shifted; render(); });
        } else if (key === '{backspace}') {
          btn.classList.add('vkb-key-special');
          btn.innerHTML = '<span class="material-symbols-outlined">backspace</span>';
          onTap(btn, () => handleBackspace());
        } else if (key === '{space}') {
          btn.classList.add('vkb-key-space');
          btn.textContent = '⎵';
          onTap(btn, () => insertChar(' '));
        } else if (key === '{done}') {
          btn.classList.add('vkb-key-done');
          btn.innerHTML = '<span class="material-symbols-outlined">keyboard_hide</span>';
          onTap(btn, () => hide());
        } else if (key === '{clear}') {
          btn.classList.add('vkb-key-special');
          btn.textContent = 'C';
          onTap(btn, () => {
            if (activeInput) {
              activeInput.value = '';
              activeInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
        } else {
          const display = shifted ? key.toUpperCase() : key;
          btn.textContent = display;
          onTap(btn, () => {
            insertChar(display);
            if (shifted) { shifted = false; render(); }
          });
        }

        rowEl.appendChild(btn);
      });

      inner.appendChild(rowEl);
    });
  }

  function insertChar(ch) {
    if (!activeInput) return;
    const start = activeInput.selectionStart || activeInput.value.length;
    const end = activeInput.selectionEnd || activeInput.value.length;
    const max = parseInt(activeInput.maxLength) || 999;

    if (activeInput.value.length >= max && start === end) return;

    const before = activeInput.value.substring(0, start);
    const after = activeInput.value.substring(end);
    activeInput.value = before + ch + after;
    activeInput.selectionStart = activeInput.selectionEnd = start + ch.length;
    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    playSound('key');
  }

  function handleBackspace() {
    if (!activeInput) return;
    const start = activeInput.selectionStart || 0;
    const end = activeInput.selectionEnd || 0;

    if (start === end && start > 0) {
      activeInput.value = activeInput.value.substring(0, start - 1) + activeInput.value.substring(end);
      activeInput.selectionStart = activeInput.selectionEnd = start - 1;
    } else if (start !== end) {
      activeInput.value = activeInput.value.substring(0, start) + activeInput.value.substring(end);
      activeInput.selectionStart = activeInput.selectionEnd = start;
    }
    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
    playSound('key');
  }

  function playSound(type) {
    if (typeof AudioFeedback !== 'undefined') AudioFeedback.play(type);
  }

  function show(inputEl, kbMode) {
    if (!kbEl) create();
    activeInput = inputEl;
    mode = kbMode || (inputEl.inputMode === 'numeric' || inputEl.type === 'number' ? 'numeric' : 'alpha');
    shifted = false;
    render();
    kbEl.classList.add('vkb-visible');
    visible = true;

    // Scroll input into view above keyboard
    setTimeout(() => {
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  function hide() {
    if (kbEl) kbEl.classList.remove('vkb-visible');
    visible = false;
    activeInput = null;
  }

  function isVisible() {
    return visible;
  }

  // Auto-attach to inputs with data-vkb attribute
  document.addEventListener('focusin', e => {
    const el = e.target;
    if (el.tagName === 'INPUT' && el.dataset.vkb !== undefined) {
      show(el, el.dataset.vkb || undefined);
    }
  });

  document.addEventListener('focusout', e => {
    // Delay hide to allow keyboard button taps to fire first
    setTimeout(() => {
      if (visible && activeInput && !activeInput.matches(':focus')) {
        // Don't hide if focus moved to keyboard
        if (!kbEl || !kbEl.contains(document.activeElement)) {
          hide();
        }
      }
    }, 300);
  });

  return { show, hide, isVisible, create };
})();
