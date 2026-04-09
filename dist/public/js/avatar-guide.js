/**
 * Avatar Guide Controller — Right-edge peeping mechanic
 * States: hidden → peek (head visible) → expanded (full body + bubble) → retreat → peek
 */
const AvatarGuide = (function () {
  'use strict';

  const STORAGE_KEY = 'du-avatar-hidden';
  const PEEK_PX = 55;           // how many px of character to show when peeking
  const EXPAND_OFFSET = 95;     // how far to slide in when fully expanded
  const PEEK_DELAY = 1500;      // ms before first peek on page load
  const AUTO_RETREAT_MS = 8000; // ms before auto-retreat from expanded

  // Route-based guide configuration
  var messages = {
    '/': {
      en: "Marhaba! Tap anywhere to start your password reset.",
      ar: "مرحباً! اضغط في أي مكان لبدء إعادة تعيين كلمة المرور.",
      delay: 2000,
      anim: 'waving',
    },
    '/onboarding': {
      en: "Get your Student Card, Civil ID, and phone ready!",
      ar: "جهّز بطاقة الطالب والهوية المدنية وهاتفك!",
      delay: 1000,
      anim: 'pointing',
    },
    '/verify/student-id': {
      en: "Enter the Student ID printed on your university card.",
      ar: "أدخل رقم الطالب المطبوع على بطاقتك الجامعية.",
      delay: 800,
      anim: 'pointing',
    },
    '/verify/dob': {
      en: "Scroll the wheels to select your date of birth.",
      ar: "مرر العجلات لاختيار تاريخ ميلادك.",
      delay: 800,
      anim: 'talking',
    },
    '/verify/civil-id': {
      en: "Type your national Civil ID number here.",
      ar: "اكتب رقم هويتك المدنية هنا.",
      delay: 800,
      anim: 'pointing',
    },
    '/verify/mobile': {
      en: "Enter the mobile number registered with the university.",
      ar: "أدخل رقم الهاتف المسجّل لدى الجامعة.",
      delay: 800,
      anim: 'talking',
    },
    '/verify/otp': {
      en: "Check your phone — an OTP code has been sent!",
      ar: "تحقق من هاتفك — تم إرسال رمز التحقق!",
      delay: 600,
      anim: 'waving',
    },
    '/success': {
      en: "Mabrook! Your new password has been sent to your phone.",
      ar: "مبروك! تم إرسال كلمة المرور الجديدة إلى هاتفك.",
      delay: 1000,
      anim: 'celebrating',
    }
  };

  // State: 'hidden' | 'peek' | 'expanded'
  var state = 'hidden';
  var guideEl, bubbleEl, messageEl, characterEl, svgImg, dismissBtn;
  var retreatTimer = null;
  var isRtl = false;
  var firstVisit = true;

  function init() {
    guideEl     = document.getElementById('avatar-guide');
    bubbleEl    = document.getElementById('avatar-bubble');
    messageEl   = document.getElementById('avatar-message');
    characterEl = document.getElementById('avatar-character');
    svgImg      = document.getElementById('avatar-svg-img');
    dismissBtn  = document.getElementById('avatar-dismiss');

    if (!guideEl || !bubbleEl || !messageEl) return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;

    isRtl = document.documentElement.dir === 'rtl';

    // Set smooth transition
    guideEl.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';

    // Dismiss button hides bubble, retreats to peek
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        retreat();
      });
    }

    // Tap on character: peek → expand, expanded → retreat
    if (characterEl) {
      characterEl.addEventListener('click', function () {
        if (state === 'peek') {
          expand();
        } else if (state === 'expanded') {
          retreat();
        }
      });
    }

    // First visit: auto-peek then auto-expand with message
    var route = window.location.pathname;
    var msg = messages[route];
    if (msg) {
      setTimeout(function () {
        peek();
        // On first visit, auto-expand after a beat
        if (firstVisit) {
          setTimeout(function () { expand(); }, 1200);
          firstVisit = false;
        }
      }, msg.delay || PEEK_DELAY);
    }
  }

  /** Show just the head peeking from the edge */
  function peek() {
    if (!guideEl) return;
    clearTimeout(retreatTimer);
    hideBubble();
    clearAnimationClasses();

    var tx = isRtl ? (PEEK_PX) + 'px' : '-' + PEEK_PX + 'px';
    guideEl.style.transform = 'translateX(' + tx + ')';
    guideEl.classList.add('avatar-peek');
    guideEl.classList.remove('avatar-expanded');
    state = 'peek';
  }

  /** Fully slide in and show the speech bubble */
  function expand() {
    if (!guideEl) return;
    clearTimeout(retreatTimer);

    var route = window.location.pathname;
    var msg = messages[route];
    if (!msg) return;

    var lang = (typeof I18N !== 'undefined') ? I18N.getLang() : 'en';
    messageEl.textContent = msg[lang] || msg.en;

    // Apply animation class to SVG
    clearAnimationClasses();
    if (svgImg && msg.anim) {
      svgImg.classList.add('avatar-' + msg.anim);
    }

    var tx = isRtl ? (EXPAND_OFFSET) + 'px' : '-' + EXPAND_OFFSET + 'px';
    guideEl.style.transform = 'translateX(' + tx + ')';
    guideEl.classList.add('avatar-expanded');
    guideEl.classList.remove('avatar-peek');
    state = 'expanded';

    // Show bubble after slide-in settles
    setTimeout(function () {
      showBubble();
    }, 350);

    // Auto-retreat after duration
    retreatTimer = setTimeout(function () {
      retreat();
    }, AUTO_RETREAT_MS);
  }

  /** Hide bubble and slide back to peek state */
  function retreat() {
    clearTimeout(retreatTimer);
    hideBubble();
    setTimeout(function () {
      peek();
    }, 300);
  }

  function showBubble() {
    if (!bubbleEl) return;
    bubbleEl.style.opacity = '1';
    bubbleEl.style.transform = 'scale(1) translateX(0)';
  }

  function hideBubble() {
    if (!bubbleEl) return;
    bubbleEl.style.opacity = '0';
    bubbleEl.style.transform = 'scale(0.8) translateX(20px)';
    clearAnimationClasses();
  }

  function clearAnimationClasses() {
    if (!svgImg) return;
    svgImg.classList.remove('avatar-waving', 'avatar-pointing', 'avatar-celebrating', 'avatar-talking');
  }

  function onLanguageChange() {
    isRtl = document.documentElement.dir === 'rtl';
    if (state === 'expanded') {
      var route = window.location.pathname;
      var msg = messages[route];
      if (msg && messageEl) {
        var lang = (typeof I18N !== 'undefined') ? I18N.getLang() : 'en';
        messageEl.textContent = msg[lang] || msg.en;
      }
      // Re-apply correct direction offset
      var tx = isRtl ? (EXPAND_OFFSET) + 'px' : '-' + EXPAND_OFFSET + 'px';
      guideEl.style.transform = 'translateX(' + tx + ')';
    } else if (state === 'peek') {
      var tx2 = isRtl ? (PEEK_PX) + 'px' : '-' + PEEK_PX + 'px';
      guideEl.style.transform = 'translateX(' + tx2 + ')';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    show: expand,
    hide: retreat,
    peek: peek,
    onLanguageChange: onLanguageChange
  };
})();
