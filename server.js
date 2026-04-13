require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      mediaSrc: ["'self'", "blob:", "data:"],
      workerSrc: ["'self'", "blob:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0,
  etag: process.env.NODE_ENV === 'production',
  lastModified: process.env.NODE_ENV === 'production',
  setHeaders: process.env.NODE_ENV !== 'production' ? function(res) { res.setHeader('Cache-Control', 'no-store'); } : undefined
}));

// Expose safe env vars to all templates
app.use((req, res, next) => {
  res.locals.config = {
    IDLE_TIMEOUT: parseInt(process.env.IDLE_TIMEOUT) || 60000,
    IDLE_WARNING: parseInt(process.env.IDLE_WARNING) || 10000,
    SUCCESS_COUNTDOWN: parseInt(process.env.SUCCESS_COUNTDOWN) || 30,
    VERIFY_DELAY: parseInt(process.env.VERIFY_DELAY) || 1500,
    MAX_ATTEMPTS: parseInt(process.env.MAX_ATTEMPTS) || 3
  };
  next();
});

// --- Page Routes ---

// Screen 1 — Splash Screen
app.get('/', (req, res) => {
  res.render('splash');
});

// Screen 2 — Onboarding
app.get('/onboarding', (req, res) => {
  res.render('onboarding');
});

// Screen 3 — Student ID
app.get('/verify/student-id', (req, res) => {
  res.render('student-id');
});

// Screen 4 — Date of Birth
app.get('/verify/dob', (req, res) => {
  res.render('dob');
});

// Screen 5 — Civil ID
app.get('/verify/civil-id', (req, res) => {
  res.render('civil-id');
});

// Screen 6 — Mobile Number
app.get('/verify/mobile', (req, res) => {
  res.render('mobile');
});

// Screen 7 — Success
app.get('/success', (req, res) => {
  res.render('success');
});

// --- API Simulation Routes (Phase 1) ---

// Simulate Student ID verification
app.post('/api/verify/student-id', (req, res) => {
  const { studentId } = req.body;
  const delay = parseInt(process.env.VERIFY_DELAY) || 1500;

  setTimeout(() => {
    if (!studentId || studentId.trim().length < 6) {
      return res.json({ success: false, message: 'Student ID not found. Please check and try again.' });
    }
    // Phase 1: any validly formatted ID passes — return simulated student name
    res.json({ success: true, message: 'Student ID verified.', studentName: 'Ahmed Al-Rashdi' });
  }, delay);
});

// Simulate DOB verification
app.post('/api/verify/dob', (req, res) => {
  const { day, month, year } = req.body;
  const delay = parseInt(process.env.VERIFY_DELAY) || 1500;

  setTimeout(() => {
    if (!day || !month || !year) {
      return res.json({ success: false, message: 'Please select a complete date of birth.' });
    }
    const dob = new Date(year, month - 1, day);
    if (dob >= new Date()) {
      return res.json({ success: false, message: 'Date of birth cannot be in the future.' });
    }
    res.json({ success: true, message: 'Date of birth verified.' });
  }, delay);
});

// Simulate Civil ID verification
app.post('/api/verify/civil-id', (req, res) => {
  const { civilId } = req.body;
  const delay = parseInt(process.env.VERIFY_DELAY) || 1500;

  setTimeout(() => {
    if (!civilId || civilId.trim().length < 8 || civilId.trim().length > 10) {
      return res.json({ success: false, message: 'Civil ID not found or does not match. Please check and try again.' });
    }
    if (!/^\d+$/.test(civilId.trim())) {
      return res.json({ success: false, message: 'Civil ID must contain only numbers.' });
    }
    res.json({ success: true, message: 'Civil ID verified.' });
  }, delay);
});

// Simulate Mobile Number verification + OTP dispatch
app.post('/api/verify/mobile', (req, res) => {
  const { mobile } = req.body;
  const delay = parseInt(process.env.VERIFY_DELAY) || 1500;

  setTimeout(() => {
    const cleaned = (mobile || '').replace(/\s/g, '');
    if (!cleaned || cleaned.length !== 8 || !/^\d+$/.test(cleaned)) {
      return res.json({ success: false, message: 'This mobile number is not registered with your account. Please contact IT support.' });
    }
    // Phase 1: simulate OTP dispatch
    res.json({ success: true, message: 'Password reset successful.', maskedMobile: `+968 ${cleaned.substring(0, 4).replace(/./g, '●')} ${cleaned.substring(4, 7).replace(/./g, '●')}${cleaned.substring(7)}` });
  }, delay);
});

// --- Admin Translation Routes ---

const AR_JSON_PATH = path.join(__dirname, 'public', 'locales', 'ar.json');
const ADMIN_PIN = process.env.ADMIN_PIN || '741369';

// Simple per-IP session tracked in memory (no express-session dependency needed)
const adminSessions = new Map();

function isAdminAuthed(req) {
  const ip = req.ip;
  const session = adminSessions.get(ip);
  if (!session) return false;
  // 4-hour expiry
  if (Date.now() - session.ts > 4 * 60 * 60 * 1000) { adminSessions.delete(ip); return false; }
  return true;
}

// GET /admin/translations — show login or editor
app.get('/admin/translations', (req, res) => {
  if (!isAdminAuthed(req)) {
    return res.render('admin/login', { error: '' });
  }
  const enData = getEnTranslations();
  let arData = {};
  try { arData = JSON.parse(fs.readFileSync(AR_JSON_PATH, 'utf8')); } catch (e) { /* empty */ }
  res.render('admin/translations', { en: enData, ar: arData });
});

// POST /admin/login — validate PIN
app.post('/admin/login', (req, res) => {
  const { pin } = req.body;
  if (pin === ADMIN_PIN) {
    adminSessions.set(req.ip, { ts: Date.now() });
    return res.redirect('/admin/translations');
  }
  res.render('admin/login', { error: 'Incorrect PIN. Please try again.' });
});

// POST /admin/save-translations — write ar.json
app.post('/admin/save-translations', (req, res) => {
  if (!isAdminAuthed(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const data = req.body;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    fs.writeFileSync(AR_JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write file' });
  }
});

/** Extract English translations from i18n.js for the admin editor */
function getEnTranslations() {
  return {
    'nav.title': 'Dhofar University',
    'nav.subtitle': 'Kiosk Experience',
    'nav.reset': 'Email Password Reset',
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
    'sid.title': 'Enter Your Student ID',
    'sid.subtitle': 'Your Student ID is printed on your university card',
    'sid.placeholder': 'Enter Student ID',
    'sid.status': 'Awaiting Student ID',
    'sid.verify': 'Verify & Continue',
    'sid.verifying': 'Verifying…',
    'sid.back': 'Back',
    'sid.cancel': 'Cancel & Exit',
    'sid.whatNeed': "First time? See what you'll need",
    'dob.title': 'Enter Your Date of Birth',
    'dob.subtitle': 'Scroll each column to select your date',
    'dob.day': 'Day',
    'dob.month': 'Month',
    'dob.year': 'Year',
    'dob.select': 'Select your date',
    'dob.scroll': 'Scroll each column to select',
    'dob.verify': 'Verify & Continue',
    'dob.verifying': 'Verifying…',
    'cid.title': 'Enter Your Civil ID',
    'cid.subtitle': 'Your Civil ID is your national identity card number',
    'cid.placeholder': 'Enter Civil ID Number',
    'cid.status': 'Awaiting Civil ID',
    'cid.verify': 'Verify & Continue',
    'cid.verifying': 'Verifying…',
    'mob.title': 'Enter Your Registered Mobile Number',
    'mob.subtitle': 'Enter the mobile number registered with the university',
    'mob.status': 'Awaiting mobile number',
    'mob.send': 'Send Password',
    'mob.sending': 'Resetting Password…',
    'shared.attempts': 'Attempts remaining:',
    'shared.locked': 'Too many failed attempts. Please visit the IT Help Desk for assistance.',
    'shared.verifyAs': 'Verifying as',
    'shared.cancelTitle': 'Are you sure you want to cancel?',
    'shared.cancelDesc': 'All progress will be lost.',
    'shared.cancelNo': 'No, Continue',
    'shared.cancelYes': 'Yes, Cancel',
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
    'idle.title': 'Are you still there?',
    'idle.desc': 'Session resets in',
    'idle.seconds': 'seconds',
    'idle.dismiss': "I'm Still Here",
    'footer.powered': 'Powered by Dhofar University | CNC Department',
    'step.studentId': 'Student ID',
    'step.dob': 'Date of Birth',
    'step.civilId': 'Civil ID',
    'step.mobile': 'Mobile',
    'log.title': 'Activity Log',
    'log.studentIdVerified': 'Student ID verified',
    'log.dobVerified': 'Date of Birth verified',
    'log.civilIdVerified': 'Civil ID verified',
    'log.mobileVerified': 'Mobile number verified',
    'a11y.highContrast': 'High Contrast',
    'a11y.screenReader': 'Screen Reader',
    'help.title': "What You'll Need",
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
    'help.gotIt': "Got It, Let's Go!",
    'theme.toggle': 'Toggle Light/Dark Mode',
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode'
  };
}

// Catch-all: redirect unknown routes to splash
app.use((req, res) => {
  res.redirect('/');
});

// --- Start Server ---
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`DU AD Reset Portal running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
