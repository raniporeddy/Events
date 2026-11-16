# EVENTS — Smart Campus & Industry Event Management Platform

> **Discover. Participate. Connect.**  
> *Discover opportunities. Participate in experiences. Build your future.*

EVENTS is an enterprise-grade, modern Smart Campus and Industry Event Management Platform engineered to unite students, faculty members, university administrators, and corporate partners within a centralized digital ecosystem.

Built with clean modular architecture, EVENTS empowers educational institutions to organize, publish, manage, and audit technical symposiums, hands-on workshops, hackathons, conferences, cultural programs, sports meets, placement drives, and internship sessions with real-time telemetry, QR-code attendance verification, tamper-proof digital certifications, and an intelligent **EVENTS AI Assistant**.

---

## 🌟 Key Platform Highlights

- **SaaS-Grade Visual Identity**: Deep Navy (`#101B3F`), Electric Blue (`#4169E1`), and Violet (`#7957D5`) with native Light & Dark mode toggle.
- **12 Square Category Cards (1:1 Ratio)**: Curated high-resolution photography, category tags, descriptions, live event counters, and 1-click filter navigation across:
  1. Technical Symposium
  2. Workshops
  3. Hackathons
  4. Conferences
  5. Cultural Events
  6. Sports Events
  7. Industry Connect
  8. Placement Activities
  9. Internship Programs
  10. Guest Lectures
  11. Seminars
  12. Innovation and Entrepreneurship
- **EVENTS AI Assistant**:
  - Floating circular assistant button at the bottom-right of every page.
  - Interactive chat drawer with quick-prompt question chips.
  - Instant event recommendations rendered as clickable cards.
  - Answers questions on registration, certificate verification, and event schedules.
  - Backend integration via `/api/ai/chat` with local database query fallback.
- **Official Certificate Verification Portal (`verify-certificate.html`)**:
  - Centered credential lookup card with instant search and clear `✕` button.
  - Validates certificate authenticity against the student database.
  - Displays verified status, holder name, event date, issuer council, and authenticity badge.
  - Download high-resolution PNG certificate or print official copy directly.
- **Four Distinct Role Portals**:
  1. **Student Hub**: Event discovery, schedule conflict warning, 1-click registration, digital QR ticket pass, wishlist, feedback reviews with photos, and participation certificates.
  2. **Faculty / Organizer Console**: Event proposal, departmental event rosters, and live QR code / barcode camera scanner desk (`faculty/attendance-scanner.html`).
  3. **Industry & Corporate Partner Portal**: Placement recruitment drives, internship awareness sessions, applicant pool tracking, and CSV candidate export (`company/dashboard.html`).
  4. **University Administrator Command**: Executive telemetry, Chart.js category doughnut & department bar charts, 1-click event approval queue, user directory with RBAC governance, attendance analytics, and database backups (`admin/dashboard.html`).
- **Production-Ready Email OTP Engine**:
  - Express.js and Nodemailer backend with rate-limiting, 45s resend cooldown, 5-minute expiry, and single-use validation.
  - Automatic development mode fallback with formatted console boxes and auto-preview for local testing without SMTP credentials.
- **QR Code Attendance System**:
  - High-resolution SVG/Canvas QR pass generation with unique ticket IDs (`CC-TK-2026-XXXX`).
  - Live webcam / mobile camera scanner powered by `html5-qrcode` plus manual barcode gun input.
  - Real-time duplicate check-in prevention with synthesized audio feedback.
- **Digital Participation Certificates**:
  - HTML5 Canvas dynamic certificate generator with high-DPI export (PNG & Print PDF).
  - Automated certificate unlocking upon attendance check-in.
  - Public Verification Portal (`verify-certificate.html`) with cryptographic verification badge.

---

## 📁 Project Architecture & File Structure

```
event-management-system/
├── admin/                           # University Administrator Portal
│   ├── dashboard.html               # Executive KPIs, Chart.js graphs, Pending approvals queue
│   ├── manage-events.html           # Full event operations table with status toggles
│   ├── users.html                   # User directory & RBAC access governance
│   ├── attendance-reports.html      # University-wide attendance & certification analytics
│   ├── system-settings.html         # White-label branding, SMTP config, and backups
│   └── add-event.html               # Redirect to create-event.html
├── faculty/                         # Faculty & Event Organizer Portal
│   ├── dashboard.html               # Departmental event directory, rosters, and quick actions
│   └── attendance-scanner.html      # Live camera pass reader and manual check-in desk
├── company/                         # Corporate & Industry Partner Portal
│   ├── dashboard.html               # Corporate profile, hosted drives, and applicant lists
│   └── post-event.html              # Placement drive & seminar submission form
├── css/                             # Modular SaaS Stylesheets
│   ├── styles.css                   # Core design system, CSS variables, square category cards, chatbot UI
│   ├── dashboard.css                # Sidebar layouts, KPI cards, tables, scanner desk, charts
│   └── auth.css                     # Auth portal, split showcase panel, 6-digit OTP inputs
├── js/                              # Core Frontend Modules
│   ├── config.js                    # Configurable branding (EVENTS), 12 categories, departments, colors
│   ├── db.js                        # Data layer (events, registrations, certs, logs, CSV export)
│   ├── auth.js                      # Authentication, session manager, OTP dispatcher, route guards
│   ├── chatbot.js                   # EVENTS AI Assistant chatbot logic & database recommendation engine
│   ├── attendance.js                # QR code rendering, pass validation, camera scanner hooks
│   ├── certificate.js               # Canvas certificate rendering, PNG export, verification lookup
│   ├── events.js                    # Catalog filtering, search, and event helpers
│   └── script.js                    # Theme toggle, notification bell, user dropdown, toast alerts
├── index.html                       # Public SaaS Landing Page with 10 sections & square category grid
├── auth.html                        # Authentication Portal (Login, OTP Registration, Forgot Password)
├── events.html                      # Filterable Events Catalog (12 categories, wishlist toggle, search)
├── event-details.html               # Detailed Event Overview, conflict warning, 1-click register
├── calendar.html                    # Interactive Academic Event Calendar (Monthly/Weekly view)
├── register.html                    # Multi-Step Registration & Instant QR Ticket Pass Generator
├── profile.html                     # Student Profile Hub (Active passes, certificates, wishlist)
├── verify-certificate.html          # Official Certificate Authenticity Lookup Tool
├── create-event.html                # Unified Event Creation Form for faculty, students & partners
├── feedback.html                    # Event Review & Rating Portal with photo upload preview
├── notifications.html               # Multi-Channel Notification Center & Preference Settings
├── participants.html                # University-wide Participant Directory with CSV export
├── past-events.html                 # Completed Events Archive & Outcomes Gallery
├── server.js                        # Node.js & Express Backend API with Nodemailer SMTP & AI Chat API
├── package.json                     # Node.js dependencies (express, cors, dotenv, nodemailer, bcryptjs)
├── .env.example                     # Environment template for SMTP & Gemini AI configuration
└── README.md                        # Platform documentation & setup guide
```

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- Modern web browser (Chrome, Edge, Firefox, Safari)

### 2. Installation
Clone or navigate to the repository directory and install the required dependencies:

```bash
cd event-management-system
npm install
```

### 3. Environment & SMTP Configuration
Copy the provided `.env.example` file to create your local `.env`:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```ini
PORT=3000

# SMTP Configuration (e.g., Gmail, Outlook, AWS SES)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-university-notifications@gmail.com
SMTP_PASS=your-google-app-password
SMTP_FROM="EVENTS <no-reply@events.edu>"

# Optional AI Assistant API Key
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Development Mode (Zero Configuration Needed)
If you do not configure SMTP credentials, EVENTS **automatically operates in Development Mode**:
- OTPs are logged directly to the server terminal in an eye-catching box.
- OTPs are also pre-filled or surfaced directly in the development modal so you can test end-to-end user flows offline without needing an active mail server.
- The AI Assistant works out of the box with the built-in database query engine even without a Gemini API key.

### 5. Starting the Application
Start the Node.js server:

```bash
npm start
```

Or for development:

```bash
node server.js
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔑 Demo Accounts & Pre-configured Credentials

You can sign in immediately using any of the following pre-seeded test accounts:

| Role | Email Address | Password | Portal Entry |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@events.edu` *(or `admin@campusconnect.edu`)* | `Admin@123` | [`admin/dashboard.html`](admin/dashboard.html) |
| **Faculty / Organizer** | `faculty.narayanan@events.edu` *(or `ananya.sen@campusconnect.edu`)* | `Faculty@123` | [`faculty/dashboard.html`](faculty/dashboard.html) |
| **Industry Partner** | `recruiter@techcorp.com` | `Company@123` | [`company/dashboard.html`](company/dashboard.html) |
| **Student** | `aditya.v@student.events.edu` *(or `aditya.v@student.campusconnect.edu`)* | `Student@123` | [`profile.html`](profile.html) |

---

## 🔄 Core User Workflows & Testing Procedures

### Flow 1: Student Registration with Email OTP Verification
1. Open [`auth.html`](auth.html) and click the **Register** tab.
2. Select the **Student** pill.
3. Enter your Name, Email, Password, Department, and Register Number.
4. Click **Create Student Account**.
5. The 6-digit OTP modal will appear with a 5-minute countdown timer.
   - *In Dev Mode*: Check your terminal or click the auto-fill helper.
   - *With SMTP*: Check your inbox for the branded EVENTS OTP email.
6. Enter the 6 digits; the boxes auto-advance and submit.
7. Upon successful validation, your account is activated and you are redirected to [`profile.html`](profile.html).

### Flow 2: Event Discovery & Registration with AI Assistant
1. Browse 12 Square Category cards on [`index.html`](index.html) or open [`events.html`](events.html).
2. Or ask the floating **EVENTS AI Assistant**: *"Show me upcoming technical workshops"* or click any suggested prompt chip.
3. The AI assistant immediately pulls live records and renders an event card with an instant details link.
4. On [`event-details.html`](event-details.html), review the venue, schedule, and live capacity meter.
5. Click **Register for Event** to proceed to [`register.html`](register.html).
6. Review the auto-populated student details and schedule conflict checks.
7. Click **Confirm Registration & Generate Pass**.
8. A high-resolution **Event Pass** will render instantly with a cryptographically unique QR code and Ticket ID (e.g., `CC-TK-2026-1049`).
9. Click **Download Ticket Pass** to save a copy for check-in.

### Flow 3: Live Gate Attendance & Automated Certificate Unlocking
1. Log in as a Faculty organizer or Admin.
2. Open [`faculty/attendance-scanner.html`](faculty/attendance-scanner.html).
3. Select the event from the dropdown.
4. Scan a student's QR pass using your device camera, or type the Ticket ID (e.g. `CC-TK-2026-1049`) into the manual barcode entry box and press Enter.
5. A green verification badge will appear with student details, accompanied by an audible success chime.
6. The system automatically marks attendance and generates an authentic **Digital Certificate of Participation**.
7. If the same ticket is scanned again, a red duplicate warning prevents repeat check-ins.

### Flow 4: Official Digital Certificate Verification
1. Open [`verify-certificate.html`](verify-certificate.html).
2. Enter the issued Certificate ID (e.g., `CC-CERT-2026-1049` or `CC-CERT-2026-8821`), or click any of the sample ID chips.
3. Click **Verify Credential**.
4. The system inspects the registry and displays a verified badge showing student name, register number, event title, date of issue, and credential authenticity status.
5. Click **Download PNG Certificate** or **Print Official Copy** to export the high-resolution certificate rendered via HTML5 Canvas.

### Flow 5: Company Placement Drive & Administrative Approval
1. Log in as an Industry Partner (`recruiter@techcorp.com` / `Company@123`).
2. Navigate to [`company/post-event.html`](company/post-event.html).
3. Fill in the drive details: Title (*Cloud Architect Campus Drive*), Category (*Placement Activities*), Date, Venue, and Target Department.
4. Click **Submit for Approval**.
5. Sign in as Admin (`admin@events.edu` / `Admin@123`) and open [`admin/dashboard.html`](admin/dashboard.html).
6. Under the **Event Approval Queue**, view the pending company submission and click **Approve**.
7. The drive is instantly published to the public campus catalog and notifications are dispatched.

---

## 🛠️ API Documentation (Backend Endpoints)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning platform telemetry and uptime. |
| `POST` | `/api/auth/send-otp` | Generates and sends a 6-digit random OTP via SMTP (with 45s cooldown). |
| `POST` | `/api/auth/verify-otp` | Validates single-use OTP within the 5-minute TTL window. |
| `POST` | `/api/auth/register` | Registers verified student, faculty, or company user accounts with bcrypt hashing. |
| `POST` | `/api/auth/login` | Authenticates users via email or register number with password verification. |
| `POST` | `/api/auth/reset-password` | Resets account password following verified email OTP confirmation. |
| `POST` | `/api/attendance/scan` | Validates gate ticket ID and updates attendance records. |
| `GET` | `/api/certificates/verify/:certId`| Validates digital certificate authenticity for third-party verifiers. |
| `POST` | `/api/ai/chat` | AI Event Assistant endpoint powered by Gemini API or local event knowledge graph. |

---

## 🎨 Design System & Customization

The platform's look and feel can be customized via `js/config.js` or via [`admin/system-settings.html`](admin/system-settings.html):

```javascript
const CampusConfig = {
  appName: 'EVENTS',
  tagline: 'Discover. Participate. Connect.',
  institutionName: 'Metropolitan University of Technology',
  supportEmail: 'support@events.edu',
  colors: {
    primary: '#101B3F',    // Deep Navy
    secondary: '#4169E1',  // Electric Blue
    accent: '#7957D5',     // Violet
    background: '#F5F7FB'  // Light Grey
  }
};
```

---

## 📄 License & Credits

EVENTS is an open-source educational platform designed for colleges, universities, and polytechnics.  
Developed with standard web technologies (HTML5, CSS3, modern Vanilla JavaScript, Node.js, Express, Nodemailer, and HTML5-QRCode).
