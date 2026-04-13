/**
 * Internationalization (i18n) System — Arabic/English Toggle
 * Stores preference in localStorage. Uses data-i18n attributes for translation.
 * Arabic strings are loaded dynamically from /locales/ar.json.
 */
const I18N = (function () {
  const translations = {
    en: {
      // Navbar
      'nav.title': 'Dhofar University',
      'nav.subtitle': 'Kiosk Experience',
      'nav.reset': 'Email Password Reset',

      // Splash
      'splash.welcome': 'Welcome,',
      'splash.student': 'Student.',
      'splash.subtitle': "Forgot your Email Password? Let's get you back online.",
      'splash.status': 'System Status: Ready',
      'splash.start': 'Start Password Reset',
      'splash.tap': 'Tap anywhere to begin',
      'splash.location.label': 'Kiosk Location',
      'splash.location.value': 'Main Admin Building',
      'splash.available.label': 'Available',
      'splash.available.value': '24/7 Self-Service',

      // Onboarding
      'onboard.s1.title': "We'll Verify Your Identity",
      'onboard.s1.desc': 'Have your <span class="text-secondary font-semibold">Student Card</span> and <span class="text-secondary font-semibold">Date of Birth</span> ready. This ensures only you can reset your password.',
      'onboard.s1.card': 'Student Card',
      'onboard.s1.dob': 'Date of Birth',
      'onboard.s1.time': 'Takes approximately 3 minutes',
      'onboard.s2.title': 'Additional Verification Required',
      'onboard.s2.desc': 'You\'ll also need your <span class="text-tertiary font-semibold">Civil ID</span> and <span class="text-tertiary font-semibold">registered mobile number</span> to complete the verification process.',
      'onboard.s2.civil': 'Civil ID',
      'onboard.s2.mobile': 'Mobile Number',
      'onboard.s3.title': 'Your New Password Will Be SMS\'d to You',
      'onboard.s3.desc': 'Once verified, a <span class="text-primary font-semibold">new secure password</span> is generated and sent to your mobile instantly.',
      'onboard.s3.sms': 'Password delivered via SMS',
      'onboard.s3.security': 'Your password is never shown on screen',
      'onboard.back': 'Back',
      'onboard.next': 'Next',
      'onboard.getStarted': 'Get Started',
      'onboard.skip': 'Skip Onboarding',

      // Student ID
      'sid.title': 'Enter Your Student ID',
      'sid.subtitle': 'Your Student ID is printed on your university card',
      'sid.placeholder': 'Enter Student ID',
      'sid.status': 'Awaiting Student ID',
      'sid.verify': 'Verify & Continue',
      'sid.verifying': 'Verifying…',
      'sid.back': 'Back',
      'sid.cancel': 'Cancel & Exit',

      // DOB
      'dob.title': 'Enter Your Date of Birth',
      'dob.subtitle': 'Scroll each column to select your date',
      'dob.day': 'Day',
      'dob.month': 'Month',
      'dob.year': 'Year',
      'dob.select': 'Select your date',
      'dob.scroll': 'Scroll each column to select',
      'dob.verify': 'Verify & Continue',
      'dob.verifying': 'Verifying…',

      // Civil ID
      'cid.title': 'Enter Your Civil ID',
      'cid.subtitle': 'Your Civil ID is your national identity card number',
      'cid.placeholder': 'Enter Civil ID Number',
      'cid.status': 'Awaiting Civil ID',
      'cid.verify': 'Verify & Continue',
      'cid.verifying': 'Verifying…',

      // Mobile
      'mob.title': 'Enter Your Registered Mobile Number',
      'mob.subtitle': 'Enter the mobile number registered with the university',
      'mob.status': 'Awaiting mobile number',
      'mob.send': 'Send Password',
      'mob.sending': 'Resetting Password…',

      // Shared
      'shared.attempts': 'Attempts remaining:',
      'shared.locked': 'Too many failed attempts. Please visit the IT Help Desk for assistance.',
      'shared.verifyAs': 'Verifying as',
      'shared.cancelTitle': 'Are you sure you want to cancel?',
      'shared.cancelDesc': 'All progress will be lost.',
      'shared.cancelNo': 'No, Continue',
      'shared.cancelYes': 'Yes, Cancel',

      // Success
      'success.title': 'Password Reset Successful!',
      'success.subtitle': 'Your new password has been generated and saved.',
      'success.format': 'New Password Format',
      'success.formatDesc': 'Where XXXXX is a 5-digit random number',
      'success.sms': 'Password Sent via SMS',
      'success.smsTo': 'Sent to',
      'success.next': 'Next Steps',
      'success.step1': 'Check your SMS for the new password',
      'success.step2': 'Use this password to log in to your email, ERP, or Wi-Fi',
      'success.step3': 'You may change your password after logging in',
      'success.timer': 'This screen will reset in',
      'success.done': 'Finish & Return to Home',
      'success.privacy': 'For your security, please do not share your password with anyone.',
      'success.qr': 'Scan to change password from your phone',

      // Idle
      'idle.title': 'Are you still there?',
      'idle.desc': 'Session resets in',
      'idle.seconds': 'seconds',
      'idle.dismiss': "I'm Still Here",

      // Footer
      'footer.powered': 'Powered by Dhofar University | CNC Department',

      // Progress Steps
      'step.studentId': 'Student ID',
      'step.dob': 'Date of Birth',
      'step.civilId': 'Civil ID',
      'step.mobile': 'Mobile',

      // Activity Log
      'log.title': 'Activity Log',
      'log.studentIdVerified': 'Student ID verified',
      'log.dobVerified': 'Date of Birth verified',
      'log.civilIdVerified': 'Civil ID verified',
      'log.mobileVerified': 'Mobile number verified',

      // Accessibility
      'a11y.highContrast': 'High Contrast',
      'a11y.screenReader': 'Screen Reader',

      // Help Modal
      'sid.whatNeed': 'First time? See what you\'ll need',
      'help.title': 'What You\'ll Need',
      'help.desc': 'Have these items ready before you start:',
      'help.item1': 'Student ID Card',
      'help.item1d': 'Your university student number',
      'help.item2': 'Date of Birth',
      'help.item2d': 'As registered with the university',
      'help.item3': 'Civil ID Number',
      'help.item3d': 'Your national identity card number',
      'help.item4': 'Registered Mobile',
      'help.item4d': 'To receive your new password via SMS',
      'help.time': 'Takes approximately 3 minutes',
      'help.gotIt': 'Got It, Let\'s Go!',

      // Theme Toggle
      'theme.toggle': 'Toggle Light/Dark Mode',
      'theme.light': 'Light Mode',
      'theme.dark': 'Dark Mode',
    },
    // Arabic strings are loaded asynchronously from /locales/ar.json
    ar: {}
  };

  let currentLang = localStorage.getItem('du-lang') || 'en';

  function t(key) {
    return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('du-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations();
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
  }

  function toggleLang() {
    setLang(currentLang === 'en' ? 'ar' : 'en');
  }

  /** Fetch Arabic translations from /locales/ar.json (cache-busted) */
  function loadArabic() {
    return fetch('/locales/ar.json?v=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        translations.ar = data;
        applyTranslations();
      })
      .catch(function () { /* ar.json unavailable — English fallback */ });
  }

  /** Reload Arabic translations (called from admin after saving) */
  function reload() { return loadArabic(); }

  // Initial apply on DOM ready
  function _init() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    loadArabic();               // async — will re-apply when fetched
    applyTranslations();        // immediate pass with English fallback
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  // Re-apply translations after each AJAX page swap
  document.addEventListener('page:enter', applyTranslations);

  return { t, getLang, setLang, toggleLang, applyTranslations, reload };
})();
