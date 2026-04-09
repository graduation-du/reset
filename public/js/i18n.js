/**
 * Internationalization (i18n) System — Arabic/English Toggle
 * Stores preference in localStorage. Uses data-i18n attributes for translation.
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
    ar: {
      // Navbar
      'nav.title': 'جامعة ظفار',
      'nav.subtitle': 'تجربة الكشك',
      'nav.reset': 'إعادة تعيين كلمة مرور البريد',

      // Splash
      'splash.welcome': 'مرحباً،',
      'splash.student': 'أيها الطالب.',
      'splash.subtitle': 'هل نسيت كلمة مرور بريدك الإلكتروني؟ دعنا نساعدك.',
      'splash.status': 'حالة النظام: جاهز',
      'splash.start': 'بدء إعادة تعيين كلمة المرور',
      'splash.tap': 'اضغط في أي مكان للبدء',
      'splash.location.label': 'موقع الكشك',
      'splash.location.value': 'مبنى الإدارة الرئيسي',
      'splash.available.label': 'متاح',
      'splash.available.value': 'خدمة ذاتية 24/7',

      // Onboarding
      'onboard.s1.title': 'سنتحقق من هويتك',
      'onboard.s1.desc': 'جهّز <span class="text-secondary font-semibold">بطاقة الطالب</span> و<span class="text-secondary font-semibold">تاريخ الميلاد</span>. هذا يضمن أنك أنت فقط من يمكنه إعادة تعيين كلمة المرور.',
      'onboard.s1.card': 'بطاقة الطالب',
      'onboard.s1.dob': 'تاريخ الميلاد',
      'onboard.s1.time': 'يستغرق حوالي 3 دقائق',
      'onboard.s2.title': 'مطلوب تحقق إضافي',
      'onboard.s2.desc': 'ستحتاج أيضاً إلى <span class="text-tertiary font-semibold">الهوية المدنية</span> و<span class="text-tertiary font-semibold">رقم الهاتف المسجل</span> لإكمال عملية التحقق.',
      'onboard.s2.civil': 'الهوية المدنية',
      'onboard.s2.mobile': 'رقم الهاتف',
      'onboard.s3.title': 'سيتم إرسال كلمة المرور الجديدة عبر رسالة نصية',
      'onboard.s3.desc': 'بعد التحقق، يتم إنشاء <span class="text-primary font-semibold">كلمة مرور آمنة جديدة</span> وإرسالها إلى هاتفك فوراً.',
      'onboard.s3.sms': 'كلمة المرور ترسل عبر رسالة نصية',
      'onboard.s3.security': 'لن تظهر كلمة المرور على الشاشة أبداً',
      'onboard.back': 'رجوع',
      'onboard.next': 'التالي',
      'onboard.getStarted': 'ابدأ الآن',
      'onboard.skip': 'تخطي التعريف',

      // Student ID
      'sid.title': 'أدخل رقم الطالب',
      'sid.subtitle': 'رقم الطالب مطبوع على بطاقتك الجامعية',
      'sid.placeholder': 'أدخل رقم الطالب',
      'sid.status': 'في انتظار رقم الطالب',
      'sid.verify': 'تحقق واستمر',
      'sid.verifying': 'جارٍ التحقق…',
      'sid.back': 'رجوع',
      'sid.cancel': 'إلغاء والخروج',

      // DOB
      'dob.title': 'أدخل تاريخ ميلادك',
      'dob.subtitle': 'مرر كل عمود لاختيار التاريخ',
      'dob.day': 'اليوم',
      'dob.month': 'الشهر',
      'dob.year': 'السنة',
      'dob.select': 'اختر التاريخ',
      'dob.scroll': 'مرر كل عمود للاختيار',
      'dob.verify': 'تحقق واستمر',
      'dob.verifying': 'جارٍ التحقق…',

      // Civil ID
      'cid.title': 'أدخل رقم الهوية المدنية',
      'cid.subtitle': 'رقم الهوية المدنية هو رقم بطاقتك الوطنية',
      'cid.placeholder': 'أدخل رقم الهوية المدنية',
      'cid.status': 'في انتظار الهوية المدنية',
      'cid.verify': 'تحقق واستمر',
      'cid.verifying': 'جارٍ التحقق…',

      // Mobile
      'mob.title': 'أدخل رقم هاتفك المسجل',
      'mob.subtitle': 'أدخل رقم الهاتف المسجل لدى الجامعة',
      'mob.status': 'في انتظار رقم الهاتف',
      'mob.send': 'إرسال كلمة المرور',
      'mob.sending': 'جارٍ إعادة تعيين كلمة المرور…',

      // Shared
      'shared.attempts': 'المحاولات المتبقية:',
      'shared.locked': 'محاولات كثيرة فاشلة. يرجى زيارة مكتب دعم تكنولوجيا المعلومات.',
      'shared.verifyAs': 'التحقق باسم',
      'shared.cancelTitle': 'هل أنت متأكد أنك تريد الإلغاء؟',
      'shared.cancelDesc': 'ستفقد كل التقدم.',
      'shared.cancelNo': 'لا، استمر',
      'shared.cancelYes': 'نعم، إلغاء',

      // Success
      'success.title': 'تم إعادة تعيين كلمة المرور بنجاح!',
      'success.subtitle': 'تم إنشاء كلمة المرور الجديدة وحفظها.',
      'success.format': 'صيغة كلمة المرور الجديدة',
      'success.formatDesc': 'حيث XXXXX هو رقم عشوائي من 5 أرقام',
      'success.sms': 'تم إرسال كلمة المرور عبر رسالة نصية',
      'success.smsTo': 'أرسلت إلى',
      'success.next': 'الخطوات التالية',
      'success.step1': 'تحقق من رسائلك النصية للحصول على كلمة المرور الجديدة',
      'success.step2': 'استخدم كلمة المرور لتسجيل الدخول إلى بريدك أو ERP أو Wi-Fi',
      'success.step3': 'يمكنك تغيير كلمة المرور بعد تسجيل الدخول',
      'success.timer': 'ستتم إعادة تعيين الشاشة في',
      'success.done': 'إنهاء والعودة للرئيسية',
      'success.privacy': 'لأمانك، يرجى عدم مشاركة كلمة المرور مع أي شخص.',
      'success.qr': 'امسح لتغيير كلمة المرور من هاتفك',

      // Idle
      'idle.title': 'هل أنت لا تزال هنا؟',
      'idle.desc': 'ستتم إعادة تعيين الجلسة في',
      'idle.seconds': 'ثوانٍ',
      'idle.dismiss': 'أنا لا أزال هنا',

      // Footer
      'footer.powered': 'مقدم من جامعة ظفار | قسم شبكات الحاسب',

      // Progress Steps
      'step.studentId': 'رقم الطالب',
      'step.dob': 'تاريخ الميلاد',
      'step.civilId': 'الهوية المدنية',
      'step.mobile': 'الهاتف',

      // Activity Log
      'log.title': 'سجل النشاط',
      'log.studentIdVerified': 'تم التحقق من رقم الطالب',
      'log.dobVerified': 'تم التحقق من تاريخ الميلاد',
      'log.civilIdVerified': 'تم التحقق من الهوية المدنية',
      'log.mobileVerified': 'تم التحقق من رقم الهاتف',

      // Accessibility
      'a11y.highContrast': 'تباين عالي',
      'a11y.screenReader': 'قارئ الشاشة',

      // Help Modal
      'sid.whatNeed': 'أول مرة؟ اعرف ما تحتاجه',
      'help.title': 'ما الذي ستحتاجه',
      'help.desc': 'جهّز هذه العناصر قبل البدء:',
      'help.item1': 'بطاقة الطالب',
      'help.item1d': 'رقم الطالب الجامعي',
      'help.item2': 'تاريخ الميلاد',
      'help.item2d': 'كما هو مسجل لدى الجامعة',
      'help.item3': 'رقم الهوية المدنية',
      'help.item3d': 'رقم بطاقة الهوية الوطنية',
      'help.item4': 'الهاتف المسجل',
      'help.item4d': 'لاستلام كلمة المرور عبر رسالة نصية',
      'help.time': 'يستغرق حوالي 3 دقائق',
      'help.gotIt': 'فهمت، لنبدأ!',

      // Theme Toggle
      'theme.toggle': 'تبديل الوضع الفاتح/الداكن',
      'theme.light': 'الوضع الفاتح',
      'theme.dark': 'الوضع الداكن',
    }
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

  // Initial apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.lang = currentLang;
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
      applyTranslations();
    });
  } else {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    applyTranslations();
  }

  return { t, getLang, setLang, toggleLang, applyTranslations };
})();
