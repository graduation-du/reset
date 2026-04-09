require('dotenv').config();
const express = require('express');
const path = require('path');
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
    MAX_ATTEMPTS: parseInt(process.env.MAX_ATTEMPTS) || 3,
    OTP_EXPIRY: parseInt(process.env.OTP_EXPIRY) || 300,
    MAX_OTP_RESENDS: parseInt(process.env.MAX_OTP_RESENDS) || 3
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

// Screen 7 — OTP Verification
app.get('/verify/otp', (req, res) => {
  res.render('otp');
});

// Screen 8 — Success
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
    res.json({ success: true, message: 'OTP sent successfully.', maskedMobile: `+968 ${cleaned.substring(0, 4).replace(/./g, '●')} ${cleaned.substring(4, 7).replace(/./g, '●')}${cleaned.substring(7)}` });
  }, delay);
});

// Simulate OTP validation
app.post('/api/verify/otp', (req, res) => {
  const { otp } = req.body;
  const testOtp = process.env.TEST_OTP || '123456';
  const delay = parseInt(process.env.VERIFY_DELAY) || 1500;

  setTimeout(() => {
    if (!otp || otp.length !== 6) {
      return res.json({ success: false, message: 'Please enter a valid 6-digit OTP.' });
    }
    if (otp === testOtp) {
      res.json({ success: true, message: 'OTP verified successfully.' });
    } else {
      res.json({ success: false, message: 'Incorrect OTP. Please try again.' });
    }
  }, delay);
});

// Simulate OTP resend
app.post('/api/resend-otp', (req, res) => {
  const delay = parseInt(process.env.VERIFY_DELAY) || 1500;
  setTimeout(() => {
    res.json({ success: true, message: 'A new OTP has been sent to your mobile.' });
  }, delay);
});

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
