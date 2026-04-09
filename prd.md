# PRD: E-Kiosk Active Directory Password Reset System
## Dhofar University — Student Self-Service Password Reset Kiosk

---

## Table of Contents

1. [Document Control](#1-document-control)
2. [Executive Summary](#2-executive-summary)
3. [Scope of Work](#3-scope-of-work)
4. [Technology Stack & Architecture](#4-technology-stack--architecture)
5. [User Personas](#5-user-personas)
6. [User Journey & Screen Flow](#6-user-journey--screen-flow)
7. [Functional Requirements — Phase 1 (Frontend)](#7-functional-requirements--phase-1-frontend)
8. [Future Integrations — Phase 2 Placeholder](#8-future-integrations--phase-2-placeholder)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Acceptance Criteria](#10-acceptance-criteria)

---

## 1. Document Control

| Field | Details |
|-------|---------|
| **Document Title** | E-Kiosk Active Directory Password Reset System — PRD |
| **Version** | 1.0 — Phase 1 Draft |
| **Status** | Pending Stakeholder Approval |
| **Date** | April 2026 |
| **Author** | Technical Project Manager / Product Owner |
| **Institution** | Dhofar University |
| **Intended Audience** | Stakeholders, UI/UX Team, Frontend Developers, IT Department |

### Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | March 2026 | PM/PO | Initial draft — scope definition |
| 1.0 | April 2026 | PM/PO | Phase 1 full specification — submitted for stakeholder review |
| 2.0 | TBD | TBD | Phase 2 backend integrations — to be authored post-Phase 1 approval |

---

## 2. Executive Summary

### 2.1 Problem Statement

University students frequently forget or lose access to their Microsoft Active Directory (AD) credentials, which govern access to a wide range of essential university systems — including institutional email, the internal ERP platform, campus Wi-Fi, and other integrated services. Under the current process, students must queue at the IT Help Desk during staffed hours to have their passwords manually reset by a technician. This creates:

- **Operational bottlenecks** at peak times (semester start, exam periods)
- **Dependency on IT staff availability** — no self-service option outside office hours
- **Friction for students** who cannot access critical systems while waiting for resolution
- **Unnecessary IT staff workload** for a task that can be safely automated

### 2.2 Proposed Solution

Deploy a network of **E-Kiosk machines** — touch-screen, Windows-based self-service terminals — positioned at accessible campus locations. Students interact with the kiosk to verify their identity through a multi-factor challenge (Student ID, Date of Birth, Civil ID, and registered mobile OTP), after which the system automatically generates a new password, resets it in Active Directory, and delivers it to the student's registered mobile number via SMS.

The system is available **24/7 without IT staff intervention**, removing the primary bottleneck in the current process.

### 2.3 Strategic Goals

| # | Goal | Outcome |
|---|------|---------|
| 1 | Eliminate dependency on IT staff for password resets | Reduced help desk ticket volume |
| 2 | Provide 24/7 self-service availability to students | Improved student satisfaction and service continuity |
| 3 | Implement multi-factor identity verification | Secure, auditable password reset process |
| 4 | Generate and deliver passwords automatically | Zero manual steps; consistent password policy enforcement |
| 5 | Build a maintainable, extensible system | Clean Phase 1 → Phase 2 transition path |

### 2.4 Password Policy

Generated passwords follow a fixed format to ensure compliance with AD complexity requirements while remaining communicable via SMS:

```
St@[5 random digits]
```

**Examples:** `St@48291`, `St@07634`, `St@99012`

This format satisfies standard Active Directory complexity rules (uppercase, lowercase, special character, numeric) and is easy for a student to read from an SMS and type.

---

## 3. Scope of Work

### 3.1 Phased Delivery Overview

The project is structured into two discrete phases to allow stakeholder review and approval of the user-facing experience before backend integrations are commissioned.

```
┌─────────────────────────────────────────────────────┐
│                     PHASE 1                         │
│          UI/UX Design & Frontend Flow               │
│                                                     │
│  • All 8 kiosk screens built and navigable          │
│  • Touch-optimised, responsive Tailwind CSS UI      │
│  • Simulated verification at every step             │
│  • Simulated OTP flow                               │
│  • Simulated success + password display             │
│  • Idle timeout and session reset logic             │
│  • Node.js server routing and screen serving        │
└─────────────────────────────────────────────────────┘
                          │
                          ▼  (Stakeholder Sign-Off)
┌─────────────────────────────────────────────────────┐
│                     PHASE 2                         │
│         Backend Integration & Live Services         │
│                                                     │
│  • Oracle DB (OCI8) student data validation         │
│  • Ooredoo SMS API — OTP dispatch & delivery        │
│  • Active Directory password reset scripts          │
│  • Secure server-side session management            │
│  • Audit logging and monitoring                     │
│  • Production hardening and kiosk lockdown          │
└─────────────────────────────────────────────────────┘
```

### 3.2 Phase 1 — In Scope

- Design and implementation of all 8 screens as defined in Section 6
- Touch-screen-optimised UI using Tailwind CSS with large tap targets, readable fonts, and accessible colour contrast
- Client-side input validation for all form fields (Student ID, DOB, Civil ID, Mobile Number, OTP)
- Simulated backend responses for all verification steps (ID check, DOB check, Civil ID check, mobile number check, OTP validation)
- Idle timeout detection with automatic session reset to the Splash Screen
- Node.js application serving all screens with Express.js routing
- Integration of existing design assets (splash screen visuals, branding, imagery) provided by the stakeholder
- Deployment of the Phase 1 build to the VPS/Plesk Windows server for review

### 3.3 Phase 2 — Out of Scope for Phase 1

- Live Oracle Database (OCI8) queries for student identity verification
- Ooredoo SMS gateway API integration for OTP dispatch
- Active Directory password reset script execution (PowerShell/LDAP)
- Server-side session token generation and validation
- Real password generation and delivery via SMS
- Audit logging to database
- Rate limiting, brute-force protection, and IP blocking
- Full kiosk OS lockdown (Group Policy enforcement)

---

## 4. Technology Stack & Architecture

### 4.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime / Server** | Node.js (LTS) | Application server; serves HTML, handles routing, will proxy backend calls in Phase 2 |
| **Web Framework** | Express.js | HTTP routing, middleware, session handling |
| **Templating Engine** | EJS or Handlebars.js | Server-side HTML rendering for each screen |
| **Frontend Styling** | Tailwind CSS (v3+) | Touch-optimised, utility-first CSS framework |
| **Frontend Interactivity** | Vanilla JavaScript / Alpine.js | Client-side form validation, transitions, idle timeout |
| **Hosting Platform** | Windows VPS with Plesk Control Panel | Application hosting, process management, SSL termination |
| **Process Manager** | PM2 | Node.js process persistence and auto-restart on the VPS |
| **Kiosk Browser** | Chromium / Microsoft Edge (kiosk mode) | Full-screen browser, JavaScript enabled, no URL bar |
| **Target OS** | Windows 10/11 (kiosk terminals) | Touch-screen workstations; OS-level lockdown in Phase 2 |

### 4.2 Phase 1 Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    KIOSK TERMINAL (Windows)                  │
│                                                              │
│   ┌──────────────────────────────────────────────────────┐   │
│   │        Chromium / Edge — Kiosk Mode (Full Screen)    │   │
│   │                                                      │   │
│   │   Renders HTML/CSS/JS screens served by Node.js      │   │
│   │   Touch events → form inputs → Express routes        │   │
│   └──────────────────────────────────────────────────────┘   │
│                            │ HTTP / LAN                      │
└────────────────────────────│─────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              VPS SERVER — Windows + Plesk                    │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐    │
│   │               Node.js / Express App                 │    │
│   │                                                     │    │
│   │   GET  /                  → Splash Screen           │    │
│   │   GET  /onboarding        → Onboarding Screens      │    │
│   │   GET  /verify/student-id → Student ID Input        │    │
│   │   GET  /verify/dob        → DOB Input               │    │
│   │   GET  /verify/civil-id   → Civil ID Input          │    │
│   │   GET  /verify/mobile     → Mobile Number Input     │    │
│   │   GET  /verify/otp        → OTP Verification        │    │
│   │   GET  /success           → Success Screen          │    │
│   │                                                     │    │
│   │   POST /api/verify/*      → Simulated responses     │    │
│   │                             (Phase 1)               │    │
│   └─────────────────────────────────────────────────────┘    │
│                      Managed by PM2                          │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Phase 2 Architecture (Preview — To Be Detailed in Phase 2 PRD)

In Phase 2, the Node.js server will act as a secure middleware layer between the kiosk frontend and three backend systems:

```
Node.js App
    ├── Oracle DB (OCI8)         — Student identity validation
    ├── Ooredoo SMS API          — OTP generation and dispatch
    └── AD PowerShell Scripts    — Password reset execution
```

### 4.4 Kiosk Deployment Notes

- The browser must launch in full-screen kiosk mode with no address bar, tab bar, or browser UI chrome visible
- The start URL must point to the Node.js application's Splash Screen (`http://localhost:[PORT]/` or the VPS IP/domain)
- Physical keyboard access should be restricted; an on-screen virtual keyboard (OSK) must be available for all text inputs
- The Windows taskbar must be hidden during kiosk operation (Phase 2 OS lockdown)

---

## 5. User Personas

### Primary Persona: The Student — "Mariam"

| Attribute | Detail |
|-----------|--------|
| **Name** | Mariam Al-Balushi (representative) |
| **Role** | Undergraduate student |
| **Age Range** | 18–28 |
| **Technical Level** | Moderate — comfortable with smartphone apps; not necessarily technical |
| **Language** | Arabic primary; English secondary |
| **Device Familiarity** | Highly comfortable with touch screens (smartphone / tablet) |
| **Trigger** | Cannot log in to university email, ERP, or Wi-Fi due to forgotten/expired password |
| **Available Time** | Typically in a hurry — between classes, before an exam, or during a short break |
| **Goal** | Reset password quickly, without queuing at the IT desk, and get back to her studies |
| **Pain Points** | Does not know her current password; IT desk is closed or has a long queue; she needs access urgently |
| **Key Expectation** | The process should take under 3 minutes and be self-explanatory with no prior instructions needed |

### Secondary Persona: The IT Administrator — "Mr. Hassan"

| Attribute | Detail |
|-----------|--------|
| **Role** | IT Help Desk / Systems Administrator |
| **Goal** | Reduce repetitive password reset tickets; monitor system usage |
| **Concern** | Ensuring only legitimate students can reset passwords; preventing misuse |
| **Phase 1 Interaction** | None — system operates fully autonomously |
| **Phase 2 Interaction** | Reviews audit logs; manages AD integration scripts; monitors SMS delivery |

---

## 6. User Journey & Screen Flow

### 6.1 High-Level Flow Diagram

```
[IDLE]
  │
  ▼
┌─────────────────┐
│  1. SPLASH      │  ◄── Default idle screen; auto-returns here on timeout
│     SCREEN      │
└────────┬────────┘
         │ Tap anywhere
         ▼
┌─────────────────┐
│  2. ONBOARDING  │  ◄── Multi-slide informational walkthrough
│     SCREENS     │
└────────┬────────┘
         │ Tap "Get Started" / "Next" / "Begin"
         ▼
┌─────────────────┐
│  3. STUDENT ID  │  ◄── Enter Student ID; simulate verification
│     INPUT       │
└────────┬────────┘
         │ ID Verified ✓
         ▼
┌─────────────────┐
│  4. DATE OF     │  ◄── Select DOB via date picker; simulate verification
│  BIRTH INPUT    │
└────────┬────────┘
         │ DOB Verified ✓
         ▼
┌─────────────────┐
│  5. CIVIL ID    │  ◄── Enter Civil ID; simulate verification
│     INPUT       │
└────────┬────────┘
         │ Civil ID Verified ✓
         ▼
┌─────────────────┐
│  6. MOBILE NO.  │  ◄── Enter registered mobile; simulate verification
│     INPUT       │
└────────┬────────┘
         │ Mobile Verified ✓ / OTP simulated as sent
         ▼
┌─────────────────┐
│  7. OTP         │  ◄── Enter 6-digit OTP; simulate validation
│  VERIFICATION   │
└────────┬────────┘
         │ OTP Valid ✓
         ▼
┌─────────────────┐
│  8. SUCCESS &   │  ◄── Display generated password; explain delivery
│  CONFIRMATION   │
└────────┬────────┘
         │ Auto-timeout (30 seconds) or "Done" tap
         ▼
      [SPLASH]
```

---

### 6.2 Screen-by-Screen Specifications

---

#### SCREEN 1 — Splash Screen

**Route:** `GET /`
**Purpose:** Default idle state. Attracts and invites students to begin the process.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Background | Full-screen branded visual using existing design assets (university imagery/branding provided) |
| University Logo | Positioned top-center or top-left; high contrast against background |
| Headline | Large, bold text: e.g., _"Forgot Your Password?"_ or _"Reset Your University Password"_ |
| Sub-headline | Supporting line: e.g., _"Available 24/7 — No IT staff needed"_ |
| CTA Prompt | Animated pulsing text or icon: _"Tap anywhere to begin"_ |
| Animation | Subtle idle animation (fade loop, gentle motion) to signal the screen is live |
| Inactivity Reset | Any session that returns from a deeper screen lands back here automatically after the idle timeout elapses |

**Interaction:**
- Any tap on the screen navigates to Screen 2 (Onboarding)
- No back navigation from this screen

**Touch Target:** Entire screen is the tap target.

---

#### SCREEN 2 — Onboarding Screens

**Route:** `GET /onboarding`
**Purpose:** Briefly orient the student to what information they will need and what to expect. Builds confidence before the verification steps begin.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Layout | Full-screen slide/card carousel (swipeable or button-navigated) |
| Number of Slides | 3 slides recommended (configurable) |
| Progress Indicator | Dot pagination or numbered step indicator at the bottom |
| Navigation Buttons | "Next" (right-aligned, prominent) and "Back" (left-aligned, subtle) |
| Final Slide CTA | "Get Started" or "Begin Reset" — primary action button, full-width |
| Skip Option | Optional "Skip" link (top right) to proceed directly to Screen 3 for returning users |

**Suggested Slide Content:**

| Slide | Icon/Visual | Heading | Body Text |
|-------|------------|---------|-----------|
| 1 | 🎓 Identity icon | "We'll Verify Your Identity" | "Have your Student ID ready. This ensures only you can reset your password." |
| 2 | 📱 Mobile phone icon | "You'll Need Your Registered Mobile" | "An OTP will be sent to your university-registered mobile number." |
| 3 | 🔒 Lock/key icon | "Your New Password Will Be SMS'd to You" | "Once verified, a new secure password is generated and sent to your mobile instantly." |

**Interaction:**
- Swipe left/right OR tap Next/Back to navigate slides
- Tapping "Get Started" / "Begin" navigates to Screen 3
- "Back" on Slide 1 returns to Screen 1 (Splash)

**Touch Targets:** All buttons minimum 56px height; full-width on mobile-equivalent canvas.

---

#### SCREEN 3 — Student ID Input

**Route:** `GET /verify/student-id`
**Purpose:** Capture and verify the student's university-issued Student ID number.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Screen Title | "Enter Your Student ID" |
| Progress Indicator | Step 1 of 4 (verification steps); visual stepper shown at top |
| Input Field | Large, touch-friendly numeric/alphanumeric input; prominent border; large font size (min 24px) |
| On-Screen Keyboard | Virtual keyboard auto-displayed below the input field (numeric pad or full keyboard depending on ID format) |
| Helper Text | Subtle label below input: e.g., _"Your Student ID is printed on your university card"_ |
| Primary Action Button | "Verify & Continue" — full-width, primary colour, minimum 64px height |
| Back Button | "Back" — secondary/ghost button; returns to Onboarding |
| Loading State | On "Verify" tap: button shows spinner + "Verifying…" text; input disabled |
| Error State | If simulated verification fails: red border on input, inline error message: _"Student ID not found. Please check and try again."_ |
| Max Attempts | After 3 failed attempts: show a message directing the student to the IT Help Desk; disable further input on this session |

**Client-Side Validation (Phase 1 Simulation):**

| Rule | Behaviour |
|------|-----------|
| Empty input | Block submission; show: _"Please enter your Student ID"_ |
| Minimum length | Define minimum character count (e.g., 6); show format hint if not met |
| Allowed characters | Alphanumeric only; reject special characters inline |
| Simulated result | Any validly formatted ID passes verification in Phase 1 |

**Interaction Flow:**
1. Student taps input field → OSK appears
2. Student types Student ID
3. Student taps "Verify & Continue"
4. Loading state shown for 1–2 seconds (simulated)
5. Simulated success → navigate to Screen 4
6. Simulated failure → show inline error; allow retry (up to 3 attempts)

---

#### SCREEN 4 — Date of Birth (DOB) Input

**Route:** `GET /verify/dob`
**Purpose:** Secondary identity verification using the student's date of birth.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Screen Title | "Enter Your Date of Birth" |
| Progress Indicator | Step 2 of 4 |
| Input Method | Touch-friendly date picker — three separate scrollable drum/wheel selectors for Day, Month, Year (native or custom); no keyboard-only date entry |
| Default State | No date pre-selected; placeholders shown (DD / MM / YYYY) |
| Year Range | Restrict to realistic student birth year range (e.g., 1985–2010) |
| Primary Action Button | "Verify & Continue" |
| Back Button | Returns to Screen 3 |
| Loading / Error States | Same pattern as Screen 3 |
| Error Message | _"Date of birth does not match our records. Please try again."_ |

**Client-Side Validation:**

| Rule | Behaviour |
|------|-----------|
| Incomplete date | Block submission if any field is not selected |
| Future date | Reject dates in the future |
| Simulated result | Any complete, past date passes in Phase 1 |

**UX Note:** Avoid native browser `<input type="date">` for kiosk use — it produces small, hard-to-tap UI. Implement a custom touch wheel picker (e.g., via a lightweight JS library or custom Tailwind component) sized for finger-based interaction.

---

#### SCREEN 5 — Civil ID Input

**Route:** `GET /verify/civil-id`
**Purpose:** Tertiary identity verification using the student's national Civil ID number.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Screen Title | "Enter Your Civil ID" |
| Progress Indicator | Step 3 of 4 |
| Input Field | Numeric-only; large touch-friendly input; OSK auto-displays (numeric pad) |
| Character Limit | Civil ID format: typically 8–10 digits (confirm exact format with university) |
| Helper Text | _"Your Civil ID is your national identity card number"_ |
| Primary Action Button | "Verify & Continue" |
| Back Button | Returns to Screen 4 |
| Loading / Error States | Same pattern as Screens 3 & 4 |
| Error Message | _"Civil ID not found or does not match. Please check and try again."_ |

**Client-Side Validation:**

| Rule | Behaviour |
|------|-----------|
| Empty input | Block; show required message |
| Non-numeric characters | Reject inline; numeric pad OSK prevents this by default |
| Incorrect length | Show format error before submission |
| Simulated result | Any validly formatted Civil ID passes in Phase 1 |

---

#### SCREEN 6 — Mobile Number Input

**Route:** `GET /verify/mobile`
**Purpose:** Final identity verification step, and also captures the mobile number to which the OTP and new password will be sent.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Screen Title | "Enter Your Registered Mobile Number" |
| Progress Indicator | Step 4 of 4 |
| Input Field | Numeric; OSK numeric pad; country code prefix displayed as static label (e.g., `+968`) |
| Helper Text | _"Enter the mobile number registered with the university"_ |
| Number Masking (optional) | After entry, partially mask the number for confirmation display: e.g., `+968 ●●●● ●321` |
| Primary Action Button | "Send OTP" |
| Back Button | Returns to Screen 5 |
| Loading State | "Sending OTP…" with spinner after tap |
| Success Transition | Navigate to Screen 7 with a brief toast/notification: _"OTP sent to +968 ●●●● ●321"_ |
| Error Message | _"This mobile number is not registered with your account. Please contact IT support."_ |

**Client-Side Validation:**

| Rule | Behaviour |
|------|-----------|
| Empty input | Block; required message |
| Non-numeric | Reject inline |
| Incorrect length | Omani mobile numbers: 8 digits after `+968`; validate length |
| Simulated result | Any validly formatted mobile number passes; OTP simulated as sent |

**Phase 1 Simulation Note:** In Phase 1, no real SMS is sent. The system simulates dispatch and navigates to the OTP screen. A hardcoded test OTP (e.g., `123456`) is used for Phase 1 validation.

---

#### SCREEN 7 — OTP Verification

**Route:** `GET /verify/otp`
**Purpose:** Confirm the student has access to the registered mobile number by entering the OTP received via SMS.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Screen Title | "Enter the OTP Sent to Your Mobile" |
| Sub-heading | Masked mobile number confirmation: _"A 6-digit code was sent to +968 ●●●● ●321"_ |
| OTP Input | 6 individual single-digit boxes (standard OTP UI pattern); auto-advance cursor on each digit entry; paste support |
| OSK | Numeric pad only |
| OTP Expiry Timer | Visible countdown timer (e.g., 5:00 minutes); shown below OTP boxes; timer ticks down in real time |
| Resend OTP | "Resend OTP" button — disabled until timer reaches 0:00; re-activates on expiry |
| Resend Limit | Maximum 3 resend attempts per session; after limit show: _"Please visit the IT Help Desk for further assistance."_ |
| Primary Action Button | "Verify OTP" — activates only when all 6 digits are entered |
| Back Button | Returns to Screen 6 (clears OTP entry) |
| Loading State | "Verifying…" spinner |
| Error State | Red border on all boxes; _"Incorrect OTP. Please try again."_; remaining attempts counter shown |
| Expiry State | If timer reaches 0:00 before submission: grey out boxes, show _"OTP expired. Please request a new code."_; auto-enable Resend button |
| Max Failed Attempts | 3 incorrect OTP attempts → lock session, show IT Help Desk message |

**Client-Side Validation:**

| Rule | Behaviour |
|------|-----------|
| Incomplete (< 6 digits) | "Verify" button remains disabled |
| Non-numeric | Rejected at input level |
| Phase 1 test OTP | Hardcoded value (e.g., `123456`) passes; any other value triggers simulated failure |

**UX Note:** The 6-box OTP input pattern is well-understood from banking and app experiences. The individual boxes provide clear affordance for touch entry and make the input count visually clear to the student.

---

#### SCREEN 8 — Success & Confirmation Screen

**Route:** `GET /success`
**Purpose:** Inform the student that their password has been successfully reset, display the new password format, and explain what to do next.

**UI/UX Requirements:**

| Element | Specification |
|---------|--------------|
| Visual Indicator | Large animated success icon (green checkmark with a subtle scale/bounce animation via CSS) |
| Primary Headline | "Password Reset Successful!" |
| Sub-headline | "Your new password has been generated and saved." |
| Password Format Panel | Styled info card displaying: _"Your new password follows the format: **St@XXXXX**"_ with a generic example (do NOT display the actual generated password on screen for security) |
| SMS Notification Message | _"Your new password has been sent to your registered mobile number: +968 ●●●● ●321"_ |
| Instructions | Numbered list of next steps: (1) Check your SMS, (2) Use this password to log in to your email/ERP/Wi-Fi, (3) You may change it after logging in |
| Auto-Reset Timer | Visible countdown (e.g., 30 seconds): _"This screen will reset in 0:30"_ — returns to Splash on expiry |
| "Done" Button | Full-width primary button: "Finish & Return to Home" — immediately returns to Splash Screen |
| Privacy Note | Small text: _"For your security, please do not share your password with anyone."_ |

**Security Consideration — Phase 1:**
The actual generated password value must **never be displayed on screen**. The kiosk is in a semi-public space; displaying the password creates a shoulder-surfing risk. The student must retrieve it from their SMS. The screen only confirms the format and confirms delivery.

**Post-Session Behaviour:**
- All form data collected in the session (Student ID, DOB, Civil ID, Mobile) must be cleared from client-side memory/state immediately upon reaching this screen
- After the 30-second auto-timer or "Done" tap, the application navigates to Screen 1 (Splash) and resets all session state

---

### 6.3 Global UX Patterns (All Screens)

| Pattern | Specification |
|---------|--------------|
| **Idle Timeout** | If no user interaction is detected for **60 seconds** on any screen (except the Splash Screen), display a 10-second warning overlay: _"Are you still there? Session resets in 10…"_. If no tap, reset to Splash and clear all state. |
| **Session Data Clearing** | On any navigation back to Splash (timeout, cancel, or completion), all form inputs and session variables are cleared |
| **Back Navigation** | Each verification screen (3–7) has a "Back" button that returns to the previous screen. The user's previously entered data is retained on back navigation within the same session to avoid re-entry frustration |
| **Cancel / Exit** | A subtle "Cancel & Exit" option available on all screens (Screens 3–8); tapping it shows a confirmation modal: _"Are you sure you want to cancel? All progress will be lost."_ with "Yes, Cancel" and "No, Continue" options |
| **Accessibility** | Minimum font size 18px for body text; 28px+ for headings. All tap targets minimum 56×56px. WCAG AA colour contrast on all text. |
| **Error Recovery** | All error states include a clear action path: retry the input, go back, or visit IT Help Desk |
| **Branding** | University logo present on every screen (top bar or corner watermark). Consistent Tailwind colour theme matching university brand guide. |
| **No Browser Chrome** | The browser runs in kiosk mode — no back/forward browser buttons, no address bar. All navigation is application-controlled. |

---

## 7. Functional Requirements — Phase 1 (Frontend)

### 7.1 Routing & Navigation

| Requirement ID | Requirement | Priority |
|---------------|-------------|---------|
| FR-01 | The application must serve all 8 screens as distinct routes via Express.js | Must Have |
| FR-02 | Navigation between screens must be controlled exclusively by the application (no browser navigation) | Must Have |
| FR-03 | The root route (`/`) must always serve the Splash Screen | Must Have |
| FR-04 | Direct URL access to any verification route without a valid session must redirect to `/` | Must Have (Phase 2 enforcement) |
| FR-05 | All screen transitions must include a smooth CSS/JS animation (fade, slide) for a polished kiosk feel | Should Have |
| FR-06 | The application must handle the browser's back button gracefully — either disable it or redirect to Splash | Must Have |

### 7.2 Form Input & Validation

| Requirement ID | Requirement | Priority |
|---------------|-------------|---------|
| FR-07 | All text inputs must display a suitable on-screen virtual keyboard (OSK) automatically on focus | Must Have |
| FR-08 | Numeric-only fields (Civil ID, Mobile, OTP) must show a numeric OSK pad | Must Have |
| FR-09 | All input fields must display inline validation errors without a full page reload | Must Have |
| FR-10 | No form submission must be possible while required fields are empty or contain invalid data | Must Have |
| FR-11 | The DOB selector must use a touch-optimised wheel/drum picker, not a native browser date input | Must Have |
| FR-12 | The OTP input must use 6 individual single-digit boxes with auto-advance between them | Must Have |
| FR-13 | The OTP "Verify" button must remain disabled until all 6 OTP digits are entered | Must Have |

### 7.3 Simulated Verification Logic (Phase 1)

| Requirement ID | Requirement | Simulation Behaviour |
|---------------|-------------|---------------------|
| FR-14 | Student ID verification | Any correctly formatted ID → success after 1.5s delay |
| FR-15 | DOB verification | Any complete, past date → success after 1.5s delay |
| FR-16 | Civil ID verification | Any correctly formatted Civil ID → success after 1.5s delay |
| FR-17 | Mobile number verification | Any valid-length mobile number → success after 1.5s delay |
| FR-18 | OTP dispatch simulation | Navigate to OTP screen; display confirmation toast |
| FR-19 | OTP validation | Hardcoded test OTP (configurable in `.env`) → success; any other value → failure |
| FR-20 | Failed attempt counter | Track failure count client-side; lock after 3 failures with IT Help Desk message |

### 7.4 Session & Timeout Management

| Requirement ID | Requirement | Priority |
|---------------|-------------|---------|
| FR-21 | Idle timeout of 60 seconds must be active on all screens except the Splash Screen | Must Have |
| FR-22 | A 10-second countdown warning overlay must appear before session reset | Must Have |
| FR-23 | On session reset (timeout or cancel), all form data must be cleared | Must Have |
| FR-24 | The OTP countdown timer must be implemented as a real-time client-side countdown | Must Have |
| FR-25 | The Success Screen auto-reset timer must count down visibly and return to Splash | Must Have |

### 7.5 UI/UX Standards

| Requirement ID | Requirement | Priority |
|---------------|-------------|---------|
| FR-26 | All interactive elements must have a minimum touch target size of 56×56px | Must Have |
| FR-27 | The application must render correctly at the kiosk screen resolution (confirm with hardware spec; typically 1080×1920 portrait or 1920×1080 landscape) | Must Have |
| FR-28 | University branding (logo, colours, fonts) must be applied consistently across all screens | Must Have |
| FR-29 | Existing splash screen design assets provided by the stakeholder must be integrated as-is | Must Have |
| FR-30 | All loading states must display a visual spinner or progress indicator | Must Have |
| FR-31 | The application must not display any browser navigation UI (tabs, address bar, bookmarks) | Must Have |

---

## 8. Future Integrations — Phase 2 Placeholder

> **Note:** The sections below are intentionally left as structured placeholders. They define the integration points, data contracts, and considerations to be fully specified in the Phase 2 PRD document, authored after Phase 1 stakeholder sign-off.

---

### 8.1 Oracle Database Integration (OCI8)

**Purpose:** Replace all simulated verification responses in Screens 3–6 with live queries against the university's Oracle student records database.

| Placeholder Item | Details to Define in Phase 2 |
|-----------------|------------------------------|
| **Connection method** | Node.js `node-oracledb` driver (OCI8 thick/thin mode); connection pool configuration |
| **Student ID query** | `SELECT` query against student table; confirm exact table/column names with DBA |
| **DOB validation** | Query to match DOB against student record for a given Student ID |
| **Civil ID validation** | Query to match Civil ID against student record |
| **Mobile number validation** | Query to retrieve registered mobile number; used for OTP dispatch |
| **Credential storage** | Oracle connection string, username, password — stored in server-side environment variables (`.env`); never exposed to client |
| **Error handling** | DB connection failure fallback; timeout handling; partial match handling |
| **Data sensitivity** | All student PII retrieved from Oracle must not be logged or stored by the Node.js application beyond the current session |

---

### 8.2 Ooredoo SMS API Integration

**Purpose:** Replace the simulated OTP dispatch in Screen 6 and the simulated password SMS delivery in Screen 8 with real SMS messages sent via the Ooredoo SMS gateway.

| Placeholder Item | Details to Define in Phase 2 |
|-----------------|------------------------------|
| **API provider** | Ooredoo Oman Business SMS Gateway |
| **API credentials** | API key / username / password — stored server-side in environment variables |
| **OTP dispatch endpoint** | `POST` to Ooredoo SMS API with recipient number and generated OTP body |
| **OTP format** | 6-digit numeric OTP; generated server-side using a cryptographically secure random function |
| **OTP storage** | Server-side only (session store or Redis); never sent to or stored on the client |
| **OTP expiry enforcement** | Server-side TTL matching the client-side 5-minute timer |
| **Password delivery SMS** | After successful AD password reset, dispatch SMS containing the new password (`St@XXXXX`) to the verified mobile number |
| **SMS delivery failure handling** | If SMS fails, the AD reset should still succeed; user must be informed on-screen to contact IT |
| **Rate limiting** | Max OTP requests per Student ID per time window (e.g., 3 per hour) — enforced server-side |

---

### 8.3 Active Directory Password Reset

**Purpose:** Replace the simulated success in Screen 8 with an actual Active Directory password reset for the authenticated student.

| Placeholder Item | Details to Define in Phase 2 |
|-----------------|------------------------------|
| **Reset mechanism** | PowerShell script (`Set-ADAccountPassword`) executed from Node.js via `child_process.exec` or a dedicated Windows service; OR LDAP write operation via `ldapjs` |
| **Password generation** | Server-side generation of `St@` + 5 cryptographically random digits; never generated client-side |
| **AD service account** | A dedicated AD service account with minimum permissions (password reset only); credentials stored in environment variables; not the admin account |
| **AD connectivity** | Node.js server must have network access to the university's AD domain controller on port 389 (LDAP) or 636 (LDAPS) |
| **Script security** | PowerShell execution policy; script signing; isolation of the reset operation |
| **Rollback / failure handling** | If AD reset fails after OTP success: do not send SMS; display error to student with IT Help Desk referral |
| **Audit logging** | Every reset attempt (success and failure) must be logged with timestamp, Student ID (hashed or masked), and outcome — written to the Oracle DB or a dedicated log table |

---

### 8.4 Server-Side Session Management (Phase 2 Upgrade)

| Placeholder Item | Details to Define in Phase 2 |
|-----------------|------------------------------|
| **Session library** | `express-session` with a persistent store (e.g., `connect-redis` or Oracle-backed) |
| **Session token** | Server-issued token after each successful verification step; required to access the next screen |
| **Step-locking** | Students cannot access Screen N+1 without a server-validated session token from Screen N |
| **Session expiry** | Server-side TTL matching the client-side idle timeout |

---

### 8.5 Audit Logging

| Placeholder Item | Details to Define in Phase 2 |
|-----------------|------------------------------|
| **Log table schema** | To be defined: `reset_audit_log` table with fields: timestamp, student_id_hash, terminal_id, ip_address, action, outcome, failure_reason |
| **Retention policy** | Define log retention period in line with university data policy |
| **Monitoring** | Alerting on anomalous reset patterns (e.g., same terminal, multiple failures in short window) |

---

## 9. Non-Functional Requirements

### 9.1 Security

| Requirement | Detail |
|-------------|--------|
| **No PII on client** | Student ID, Civil ID, DOB, and mobile number must never be stored in browser localStorage, sessionStorage, or cookies. All sensitive state lives server-side (Phase 2). In Phase 1, no PII is transmitted to or stored by the simulated backend. |
| **Password never displayed** | The generated password must never be shown on screen. It is delivered exclusively via SMS. |
| **OTP server-side only** | In Phase 2, OTPs are generated and validated server-side only. The client sends the entered OTP; the server validates it against the stored value. |
| **HTTPS** | All traffic between kiosk and server must be encrypted via TLS (HTTPS). Plesk/Let's Encrypt certificate to be configured before Phase 2 launch. |
| **Session isolation** | Each kiosk session is fully isolated. Completing or abandoning a session must leave no recoverable state for the next user. |
| **Input sanitisation** | All user inputs must be sanitised server-side before any database query or AD operation. Parameterised queries only for Oracle interactions. |
| **Brute-force protection** | Maximum 3 failed attempts per verification field per session. After limit, session locks and student is directed to IT Help Desk. (Phase 2: rate limiting enforced at server level). |
| **Kiosk OS lockdown** | Phase 2: Windows Group Policy to disable Task Manager, Alt+Tab, Win key, and any OS-level escape from the kiosk application. |

### 9.2 Performance

| Requirement | Target |
|-------------|--------|
| **Screen load time** | Any screen transition must complete within 1 second on the LAN connection |
| **Simulated verification delay** | Phase 1 simulated responses should complete within 1.5–2 seconds to feel realistic without being slow |
| **OTP timer accuracy** | Client-side countdown must not drift by more than ±1 second over a 5-minute period |
| **Concurrent sessions** | The Node.js server must handle requests from all deployed kiosk terminals simultaneously without degradation (define number of terminals with IT) |
| **Uptime** | Target 99.5% availability during university operating hours; PM2 auto-restart on crash |

### 9.3 Usability & Accessibility

| Requirement | Detail |
|-------------|--------|
| **Touch target size** | All interactive elements minimum 56×56px |
| **Font size** | Body text minimum 18px; primary headings minimum 32px |
| **Colour contrast** | WCAG 2.1 AA compliance on all text/background combinations |
| **Language** | Phase 1: English. Phase 2 consideration: Arabic (RTL layout support) |
| **Error messaging** | All error messages must be plain-language, actionable, and free of technical jargon |
| **Self-explanatory** | Each screen must be understandable without reading the onboarding — helper text and labels on every input |

### 9.4 Kiosk Environment

| Requirement | Detail |
|-------------|--------|
| **Screen orientation** | Confirm with hardware vendor: portrait (1080×1920) or landscape (1920×1080). Application must target the correct orientation. |
| **Touch input** | Application must respond to touch events, not mouse events exclusively. No hover-dependent UI. |
| **No keyboard dependency** | All text input achievable via the OSK. Physical keyboard unavailable to the student. |
| **No external navigation** | Browser runs in kiosk mode with no address bar, tabs, or bookmarks. Application routing is the sole navigation mechanism. |
| **Offline handling** | If the kiosk loses network connectivity, display a clear error screen: _"Service temporarily unavailable. Please try again or visit the IT Help Desk."_ Do not show a browser error page. |

### 9.5 Maintainability

| Requirement | Detail |
|-------------|--------|
| **Environment configuration** | All environment-specific values (test OTP, server URL, timeout durations) stored in `.env` file — not hardcoded in source |
| **Modular screen components** | Each screen implemented as a discrete template/component for independent updates |
| **Code documentation** | All route handlers and simulation functions commented for Phase 2 developer handover |
| **Deployment** | Node.js app managed by PM2 on Plesk; deployable via `git pull` + `pm2 restart` |

---

## 10. Acceptance Criteria

The following criteria must be met for Phase 1 to be considered complete and ready for stakeholder sign-off.

### 10.1 Screen Completeness

| # | Criterion | Pass Condition |
|---|-----------|----------------|
| AC-01 | All 8 screens are implemented and navigable | Each screen renders correctly at kiosk resolution with no broken layouts |
| AC-02 | Existing splash screen design assets are integrated | Splash screen matches approved design assets exactly |
| AC-03 | University branding is consistent across all screens | Logo, colours, and typography match the university brand guide on every screen |
| AC-04 | Onboarding slides display correct content | All 3 onboarding slides render with correct text, icons, and navigation |

### 10.2 User Flow Completeness

| # | Criterion | Pass Condition |
|---|-----------|----------------|
| AC-05 | Full flow navigable end-to-end | A tester can complete the entire flow from Splash to Success without errors |
| AC-06 | Back navigation works on all verification screens | Tapping "Back" on Screen 3–7 returns to the correct previous screen with data preserved |
| AC-07 | Cancel flow works | Tapping "Cancel & Exit" at any step shows confirmation modal; confirming returns to Splash and clears data |
| AC-08 | Session auto-resets to Splash after Success screen | After 30-second countdown (or "Done" tap), application returns to Splash with all state cleared |

### 10.3 Input & Validation

| # | Criterion | Pass Condition |
|---|-----------|----------------|
| AC-09 | All required field validations fire correctly | Tapping "Verify" with an empty field shows the correct inline error message |
| AC-10 | Student ID validation rejects incorrect formats | Incorrectly formatted ID shows format error before POST |
| AC-11 | DOB picker is touch-friendly and functional | A tester can select a complete date using touch on the kiosk device |
| AC-12 | Civil ID accepts only numeric input | Non-numeric characters cannot be entered into the Civil ID field |
| AC-13 | Mobile number length is validated | Incorrect-length mobile number shows error before POST |
| AC-14 | OTP input auto-advances through 6 boxes | Entering a digit in box N automatically focuses box N+1 |
| AC-15 | OTP "Verify" button is disabled with < 6 digits | Button is non-interactive until all 6 boxes are filled |

### 10.4 Simulation & Logic

| # | Criterion | Pass Condition |
|---|-----------|----------------|
| AC-16 | Simulated verifications succeed with valid input | Correctly formatted inputs on Screens 3–6 produce a loading state then navigate to the next screen |
| AC-17 | Simulated verification failure shows error state | An empty or malformed input on Screens 3–6 shows the correct inline error |
| AC-18 | 3-attempt lock engages correctly | Three consecutive failed attempts on any verification screen locks that step and displays the IT Help Desk message |
| AC-19 | OTP countdown timer runs and expires | Timer counts down from 5:00 to 0:00 accurately; "Resend OTP" activates on expiry |
| AC-20 | Test OTP passes; incorrect OTP fails | Entering the configured test OTP navigates to Success; any other value shows OTP error |
| AC-21 | Success screen does not display the actual password | Success screen shows only the password format (`St@XXXXX`) and the SMS notification message — no actual value |

### 10.5 Timeouts & Session Management

| # | Criterion | Pass Condition |
|---|-----------|----------------|
| AC-22 | Idle timeout triggers warning overlay | After 60 seconds of inactivity on any screen (except Splash), the warning overlay appears |
| AC-23 | Session resets after timeout warning | If no interaction occurs within the 10-second warning, the application resets to Splash and clears all data |
| AC-24 | Touch during warning cancels reset | Tapping "I'm still here" (or anywhere on the overlay) dismisses the warning and resets the 60-second timer |

### 10.6 Environment & Deployment

| # | Criterion | Pass Condition |
|---|-----------|----------------|
| AC-25 | Application deploys successfully to VPS/Plesk | `npm start` (or PM2 equivalent) launches the application without errors on the Windows VPS |
| AC-26 | Application renders correctly in Chromium kiosk mode | All screens render correctly when Chromium is launched in `--kiosk` mode pointed at the application URL |
| AC-27 | Application is accessible from a kiosk terminal on the LAN | A kiosk device on the same network can access and run the full flow against the VPS-hosted application |
| AC-28 | All environment variables are externalised | No hardcoded credentials, OTP values, or environment-specific URLs exist in the committed source code |

---

*Document prepared by: Technical Project Manager / Product Owner*
*Project: E-Kiosk Active Directory Password Reset System*
*Institution: Dhofar University*
*Phase 1 | Version 1.0 | April 2026*
*Status: DRAFT — Submitted for Stakeholder Review and Sign-Off*