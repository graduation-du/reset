/**
 * Avatar Guide Controller
 * Shows an animated Omani character with contextual speech bubbles per route.
 * Integrates with I18N for bilingual messages and triggers SVG animations.
 */
const AvatarGuide = (function () {
  'use strict';

  const STORAGE_KEY = 'du-avatar-hidden';

  // Route-based guide configuration
  var messages = {
    '/': {
      en: "Marhaba! Tap anywhere to start your password reset.",
      ar: "مرحباً! اضغط في أي مكان لبدء إعادة تعيين كلمة المرور.",
      delay: 2500,
      anim: 'waving',
      duration: 8000
    },
    '/onboarding': {
      en: "Get your Student Card, Civil ID, and phone ready!",
      ar: "جهّز بطاقة الطالب والهوية المدنية وهاتفك!",
      delay: 1200,
      anim: 'pointing',
      duration: 7000
    },
    '/verify/student-id': {
      en: "Enter the Student ID printed on your university card.",
      ar: "أدخل رقم الطالب المطبوع على بطاقتك الجامعية.",
      delay: 800,
      anim: 'pointing',
      duration: 6000
    },
    '/verify/dob': {
      en: "Scroll the wheels to select your date of birth.",
      ar: "مرر العجلات لاختيار تاريخ ميلادك.",
      delay: 800,
      anim: 'talking',
      duration: 6000
    },
    '/verify/civil-id': {
      en: "Type your national Civil ID number here.",
      ar: "اكتب رقم هويتك المدنية هنا.",
      delay: 800,
      anim: 'pointing',
      duration: 6000
    },
    '/verify/mobile': {
      en: "Enter the mobile number registered with the university.",
      ar: "أدخل رقم الهاتف المسجّل لدى الجامعة.",
      delay: 800,
      anim: 'talking',
      duration: 6000
    },
    '/verify/otp': {
      en: "Check your phone — an OTP code has been sent!",
      ar: "تحقق من هاتفك — تم إرسال رمز التحقق!",
      delay: 600,
      anim: 'waving',
      duration: 6000
    },
    '/success': {
      en: "Mabrook! Your new password has been sent to your phone.",
      ar: "مبروك! تم إرسال كلمة المرور الجديدة إلى هاتفك.",
      delay: 1000,
      anim: 'celebrating',
      duration: 10000
    }
  };

  var guideEl, bubbleEl, messageEl, characterEl, svgImg, dismissBtn;
  var hideTimer = null;
  var isVisible = false;

  function init() {
    guideEl = document.getElementById('avatar-guide');
    bubbleEl = document.getElementById('avatar-bubble');
    messageEl = document.getElementById('avatar-message');
    characterEl = document.getElementById('avatar-character');
    svgImg = document.getElementById('avatar-svg-img');
    dismissBtn = document.getElementById('avatar-dismiss');

    if (!guideEl || !bubbleEl || !messageEl) return;

    // If user has dismissed permanently, don't show
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;

    // Dismiss button hides the current bubble
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        hide();
      });
    }

    // Tap on character toggles bubble
    if (characterEl) {
      characterEl.addEventListener('click', function () {
        if (isVisible) {
          hide();
        } else {
          showForRoute();
        }
      });
    }

    // Show guide for current route
    showForRoute();
  }

  function showForRoute() {
    var route = window.location.pathname;
    var msg = messages[route];
    if (!msg) return;

    setTimeout(function () {
      show(msg);
    }, msg.delay);
  }

  function show(msg) {
    if (!guideEl || !messageEl || !bubbleEl) return;

    var lang = (typeof I18N !== 'undefined') ? I18N.getLang() : 'en';
    messageEl.textContent = msg[lang] || msg.en;

    // Set SVG animation class
    clearAnimationClasses();
    if (svgImg && msg.anim) {
      svgImg.classList.add('avatar-' + msg.anim);
    }

    // Slide avatar in
    guideEl.style.transform = 'translateX(0)';
    guideEl.classList.add('avatar-visible');
    isVisible = true;

    // Fade in bubble after character appears
    setTimeout(function () {
      bubbleEl.style.opacity = '1';
      bubbleEl.style.transform = 'scale(1) translateY(0)';
    }, 400);

    // Auto-hide after duration
    clearTimeout(hideTimer);
    if (msg.duration) {
      hideTimer = setTimeout(function () {
        hideBubble();
      }, msg.duration);
    }
  }

  function hideBubble() {
    if (!bubbleEl) return;
    bubbleEl.style.opacity = '0';
    bubbleEl.style.transform = 'scale(0.8) translateY(10px)';
    clearAnimationClasses();
  }

  function hide() {
    if (!guideEl) return;
    clearTimeout(hideTimer);
    bubbleEl.style.opacity = '0';
    bubbleEl.style.transform = 'scale(0.8) translateY(10px)';

    setTimeout(function () {
      var isRtl = document.documentElement.dir === 'rtl';
      guideEl.style.transform = isRtl ? 'translateX(140%)' : 'translateX(-140%)';
      guideEl.classList.remove('avatar-visible');
      isVisible = false;
      clearAnimationClasses();
    }, 300);
  }

  function clearAnimationClasses() {
    if (!svgImg) return;
    svgImg.classList.remove('avatar-waving', 'avatar-pointing', 'avatar-celebrating', 'avatar-talking');
  }

  // Re-show on language change (update message text)
  function onLanguageChange() {
    if (!isVisible) return;
    var route = window.location.pathname;
    var msg = messages[route];
    if (!msg || !messageEl) return;
    var lang = (typeof I18N !== 'undefined') ? I18N.getLang() : 'en';
    messageEl.textContent = msg[lang] || msg.en;
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    show: showForRoute,
    hide: hide,
    onLanguageChange: onLanguageChange
  };
})();
