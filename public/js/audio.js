/**
 * Audio Feedback System — Subtle sounds for kiosk interactions
 * Uses Web Audio API to generate tones (no external files needed).
 */
const AudioFeedback = (function () {
  let ctx = null;
  let enabled = localStorage.getItem('du-audio') !== 'false'; // on by default

  function getCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function playTone(freq, duration, type, volume) {
    if (!enabled) return;
    const c = getCtx();
    if (!c) return;

    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(volume || 0.08, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);

    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  }

  const sounds = {
    key:     () => playTone(800, 0.05, 'sine', 0.04),
    success: () => {
      playTone(523, 0.15, 'sine', 0.08);
      setTimeout(() => playTone(659, 0.15, 'sine', 0.08), 120);
      setTimeout(() => playTone(784, 0.2, 'sine', 0.1), 240);
    },
    error:   () => {
      playTone(300, 0.15, 'square', 0.06);
      setTimeout(() => playTone(250, 0.2, 'square', 0.06), 150);
    },
    click:   () => playTone(600, 0.04, 'sine', 0.05),
    warning: () => {
      playTone(440, 0.3, 'triangle', 0.08);
      setTimeout(() => playTone(440, 0.3, 'triangle', 0.08), 500);
    },
    navigate: () => playTone(900, 0.08, 'sine', 0.05),
    complete: () => {
      playTone(523, 0.12, 'sine', 0.1);
      setTimeout(() => playTone(659, 0.12, 'sine', 0.1), 100);
      setTimeout(() => playTone(784, 0.12, 'sine', 0.1), 200);
      setTimeout(() => playTone(1047, 0.3, 'sine', 0.12), 300);
    }
  };

  function play(name) {
    if (!enabled) return;
    if (sounds[name]) sounds[name]();
  }

  function toggle() {
    enabled = !enabled;
    localStorage.setItem('du-audio', enabled);
    return enabled;
  }

  function isEnabled() { return enabled; }

  // Auto-play click sound on button presses
  document.addEventListener('click', e => {
    if (e.target.closest('button') || e.target.closest('a')) {
      play('click');
    }
  }, { passive: true });

  return { play, toggle, isEnabled };
})();
