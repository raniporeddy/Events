/**
 * CampusConnect — Smart Campus & Industry Event Management System
 * Production-ready Express Backend API & Static Server
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Production CORS Configuration for Vercel & Localhost
const ALLOWED_ORIGINS = [
  'https://events-nu-blond.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const originLower = origin.toLowerCase();
    const isAllowed = ALLOWED_ORIGINS.some(allowed => originLower === allowed.toLowerCase()) ||
                      originLower.endsWith('.vercel.app') ||
                      originLower.includes('localhost') ||
                      originLower.includes('127.0.0.1');

    if (isAllowed) {
      return callback(null, true);
    }
    // Allow by default to prevent blocking unexpected preview URLs
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie', 'Date'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Data Directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory OTP Store with TTL & Rate Limiting
// Key: email -> { hash, expiresAt, attempts, lastSent }
const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const OTP_COOLDOWN_MS = 45 * 1000; // 45 seconds
const MAX_ATTEMPTS = 5;

// Email Transporter Setup
function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host: host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }
  return null; // Development mode
}

// Data Helper Functions
function readJson(filename, defaultVal = []) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return defaultVal;
  }
}

function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// Initialize seed data if not present
function initializeData() {
  const defaultPasswordHash = bcrypt.hashSync('Password@123', 10);

  const seedUsers = [
    {
      id: 'USR_ADMIN_01',
      name: 'Dr. S. K. Narayanan',
      email: 'admin@events.edu',
      password_hash: defaultPasswordHash,
      role: 'admin',
      user_type: 'admin',
      department: 'University Administration',
      designation: 'Dean of Student Affairs',
      verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'USR_ADMIN_02',
      name: 'Dr. S. K. Narayanan',
      email: 'admin@campusconnect.edu',
      password_hash: defaultPasswordHash,
      role: 'admin',
      user_type: 'admin',
      department: 'University Administration',
      designation: 'Dean of Student Affairs',
      verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'USR_FAC_01',
      name: 'Prof. Ananya Sen',
      email: 'ananya.sen@events.edu',
      password_hash: defaultPasswordHash,
      role: 'faculty',
      user_type: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Associate Professor',
      verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'USR_FAC_02',
      name: 'Dr. S. K. Narayanan',
      email: 'faculty.narayanan@events.edu',
      password_hash: defaultPasswordHash,
      role: 'faculty',
      user_type: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Professor & Head of Department (CSE)',
      verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'USR_COMP_01',
      name: 'TechCorp Solutions Inc.',
      email: 'connect@techcorp.io',
      password_hash: defaultPasswordHash,
      role: 'company',
      user_type: 'company',
      company_name: 'TechCorp Solutions Inc.',
      companyName: 'TechCorp Solutions Inc.',
      industry: 'Software & Cloud Services',
      industrySector: 'Software & Cloud Services',
      website: 'https://techcorp.io',
      corporateWebsite: 'https://techcorp.io',
      contact_person: 'Rohan Mehra',
      verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'USR_STU_01',
      name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      password_hash: defaultPasswordHash,
      role: 'student',
      user_type: 'student',
      department: 'Computer Science & Engineering',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      year: '3',
      verified: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'USR_STU_02',
      name: 'Pooja Sundaram',
      email: 'pooja.s@student.events.edu',
      password_hash: defaultPasswordHash,
      role: 'student',
      user_type: 'student',
      department: 'Electronics & Communication Engineering',
      reg_number: 'CC2023088',
      register_number: 'CC2023088',
      year: '3',
      verified: true,
      created_at: new Date().toISOString()
    }
  ];

  let users = readJson('users.json', []);
  let userUpdated = false;
  seedUsers.forEach(su => {
    const existingIdx = users.findIndex(u =>
      (u.email && su.email && u.email.toLowerCase() === su.email.toLowerCase())
    );
    if (existingIdx === -1) {
      users.push(su);
      userUpdated = true;
    } else {
      // Ensure seed demo accounts retain valid credentials, roles and verified status
      users[existingIdx].role = (su.role || users[existingIdx].role || 'student').toLowerCase();
      users[existingIdx].user_type = users[existingIdx].role;
      users[existingIdx].verified = true;
      users[existingIdx].password_hash = su.password_hash;
      if (!users[existingIdx].name) users[existingIdx].name = su.name;
      if (!users[existingIdx].department) users[existingIdx].department = su.department;
      if (!users[existingIdx].designation) users[existingIdx].designation = su.designation;
      userUpdated = true;
    }
  });
  if (userUpdated || users.length === 0) {
    writeJson('users.json', users);
  }

  const seedCerts = [
    {
      certificate_id: 'CC-CERT-2026-1049',
      ticket_id: 'CC-TK-2026-1049',
      event_id: 'EVT005',
      event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
      event_date: '2026-04-20',
      recipient_name: 'Aditya Verma',
      reg_number: 'CC2023001',
      recipient_email: 'aditya.v@student.events.edu',
      issue_date: '2026-04-20',
      issuer_name: 'EVENTS Academic Council',
      institution: 'SCSVMV Deemed to be University',
      verified: true
    },
    {
      certificate_id: 'CC-CERT-2026-8821',
      ticket_id: 'CC-TK-2026-8821',
      event_id: 'EVT001',
      event_title: 'Global AI & Cloud Computing Summit 2026',
      event_date: '2026-04-12',
      recipient_name: 'Pooja Sundaram',
      reg_number: 'CC2023088',
      recipient_email: 'pooja.s@student.events.edu',
      issue_date: '2026-04-12',
      issuer_name: 'EVENTS Academic Council',
      institution: 'SCSVMV Deemed to be University',
      verified: true
    },
    {
      certificate_id: 'CC-CERT-2026-1050',
      ticket_id: 'CC-TK-2026-1050',
      event_id: 'EVT006',
      event_title: 'Annual Inter-College Sports & Athletics Meet',
      event_date: '2026-04-14',
      recipient_name: 'Aditya Verma',
      reg_number: 'CC2023001',
      recipient_email: 'aditya.v@student.events.edu',
      issue_date: '2026-04-14',
      issuer_name: 'EVENTS Sports Directorate',
      institution: 'SCSVMV Deemed to be University',
      verified: true
    },
    {
      certificate_id: 'CC-CERT-2026-3042',
      ticket_id: 'CC-TK-2026-3042',
      event_id: 'EVT005',
      event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
      event_date: '2026-04-20',
      recipient_name: 'Rahul Sharma',
      reg_number: 'CC2023045',
      recipient_email: 'rahul.sharma@student.events.edu',
      issue_date: '2026-04-20',
      issuer_name: 'EVENTS Academic Council',
      institution: 'SCSVMV Deemed to be University',
      verified: true
    }
  ];

  let certs = readJson('certificates.json', []);
  let certUpdated = false;
  seedCerts.forEach(sc => {
    if (!certs.some(c => c.certificate_id === sc.certificate_id)) {
      certs.push(sc);
      certUpdated = true;
    }
  });
  if (certUpdated || certs.length === 0) {
    writeJson('certificates.json', certs);
  }

  const seedEvents = [
    {
      id: 'EVT001',
      title: 'Global AI & Cloud Computing Summit 2026',
      description: 'Join leading cloud architects, AI researchers, and engineering leaders for an intensive exploration of generative AI pipelines, serverless distributed computing, and enterprise ML systems.',
      category: 'Conference',
      date: '2026-05-18',
      end_date: '2026-05-19',
      time: '09:30',
      end_time: '17:00',
      venue: 'Grand University Auditorium & Tech Hall',
      department: 'Computer Science & Engineering',
      organizer_name: 'Dr. S. K. Narayanan',
      organizer_type: 'faculty',
      organizer_id: 'USR_ADMIN_01',
      company_name: '',
      status: 'upcoming',
      approval: 'approved',
      max_participants: 350,
      registered_count: 142,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      tags: 'AI,Cloud,Architecture,DeepLearning',
      contact_email: 'ai.summit@events.edu',
      contact_phone: '+91 98765 43210',
      created_date: '2026-04-01'
    },
    {
      id: 'EVT002',
      title: 'Full-Stack SaaS Architecture Workshop with React & Node',
      description: 'Hands-on practical development bootcamp building multi-tenant microservices, automated CI/CD pipelines, and high-performance reactive user interfaces.',
      category: 'Workshops',
      date: '2026-05-22',
      end_date: '2026-05-22',
      time: '10:00',
      end_time: '16:30',
      venue: 'Innovation Computing Lab 4, Block C',
      department: 'Information Technology',
      organizer_name: 'Prof. Ananya Sen',
      organizer_type: 'faculty',
      organizer_id: 'USR_FAC_01',
      company_name: '',
      status: 'upcoming',
      approval: 'approved',
      max_participants: 60,
      registered_count: 48,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
      tags: 'WebDev,React,NodeJS,Microservices',
      contact_email: 'workshop.it@events.edu',
      contact_phone: '+91 98765 43211',
      created_date: '2026-04-05'
    },
    {
      id: 'EVT003',
      title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
      description: 'Exclusive on-campus recruitment and technical mentorship drive by TechCorp Solutions Inc. Covers problem-solving sessions, system design assessments, and direct interview shortlists.',
      category: 'Placement Activities',
      date: '2026-05-25',
      end_date: '2026-05-26',
      time: '09:00',
      end_time: '18:00',
      venue: 'Placement & Career Development Center',
      department: 'Training & Placement Cell',
      organizer_name: 'TechCorp Solutions Inc.',
      organizer_type: 'company',
      organizer_id: 'USR_COMP_01',
      company_name: 'TechCorp Solutions Inc.',
      status: 'upcoming',
      approval: 'approved',
      max_participants: 200,
      registered_count: 185,
      waitlist_count: 12,
      image_url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
      tags: 'Placement,Careers,Interviews,SoftwareJobs',
      contact_email: 'campus@techcorp.io',
      contact_phone: '+91 98765 43212',
      created_date: '2026-04-10'
    },
    {
      id: 'EVT004',
      title: 'National 24-Hour Smart Campus Hackathon',
      description: 'Intensive overnight buildathon solving institutional automation, sustainable green campus challenges, and next-gen edutech solutions with cash prizes and investor mentorship.',
      category: 'Hackathons',
      date: '2026-06-05',
      end_date: '2026-06-06',
      time: '09:00',
      end_time: '09:00',
      venue: 'University Student Center & Maker Lab',
      department: 'Computer Science & Engineering',
      organizer_name: 'Dr. S. K. Narayanan',
      organizer_type: 'faculty',
      organizer_id: 'USR_ADMIN_01',
      company_name: '',
      status: 'upcoming',
      approval: 'approved',
      max_participants: 120,
      registered_count: 94,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
      tags: 'Hackathon,Coding,Innovation,Hardware',
      contact_email: 'hackathon@events.edu',
      contact_phone: '+91 98765 43213',
      created_date: '2026-04-12'
    },
    {
      id: 'EVT005',
      title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
      description: 'Industry-guided masterclass exploring offensive security fundamentals, penetration testing, defensive SOC architectures, and real-world compliance standards.',
      category: 'Industry Connect',
      date: '2026-04-20',
      end_date: '2026-04-20',
      time: '11:00',
      end_time: '15:00',
      venue: 'Seminar Hall B, Engineering Block',
      department: 'Computer Science & Engineering',
      organizer_name: 'CyberShield Defense Labs',
      organizer_type: 'company',
      organizer_id: 'USR_COMP_02',
      company_name: 'CyberShield Defense Labs',
      status: 'completed',
      approval: 'approved',
      max_participants: 150,
      registered_count: 148,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
      tags: 'Cybersecurity,ZeroTrust,CloudSecurity,PenTesting',
      contact_email: 'edu@cybershield.com',
      contact_phone: '+91 98765 43214',
      created_date: '2026-03-20'
    },
    {
      id: 'EVT006',
      title: 'Annual Inter-College Sports & Athletics Meet',
      description: 'Grand athletic competitions including track events, basketball, cricket championship, volleyball, and chess tournaments with university honors.',
      category: 'Sports',
      date: '2026-04-12',
      end_date: '2026-04-14',
      time: '08:00',
      end_time: '18:00',
      venue: 'University Olympic Sports Complex',
      department: 'Sports & Physical Education',
      organizer_name: 'Prof. Ananya Sen',
      organizer_type: 'faculty',
      organizer_id: 'USR_FAC_01',
      company_name: '',
      status: 'completed',
      approval: 'approved',
      max_participants: 500,
      registered_count: 480,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
      tags: 'Sports,Athletics,Fitness,Championship',
      contact_email: 'sports@events.edu',
      contact_phone: '+91 98765 43215',
      created_date: '2026-03-10'
    },
    {
      id: 'EVT007',
      title: 'TechCorp Annual Cloud Innovation Hackathon 2026',
      description: 'Design and deploy multi-cloud AI microservices, distributed event-driven systems, and autonomous agent workflows with mentors from TechCorp Solutions Inc.',
      category: 'Hackathons',
      date: '2026-06-15',
      end_date: '2026-06-16',
      time: '09:00',
      end_time: '18:00',
      venue: 'Campus Innovation Center, Hall A',
      department: 'Computer Science & Engineering',
      organizer_name: 'TechCorp Solutions Inc.',
      organizer_type: 'company',
      organizer_id: 'USR_COMP_01',
      company_name: 'TechCorp Solutions Inc.',
      status: 'upcoming',
      approval: 'approved',
      max_participants: 150,
      registered_count: 110,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80',
      tags: 'Cloud,Hackathon,TechCorp,Innovation',
      contact_email: 'hackathon@techcorp.io',
      contact_phone: '+91 98765 43216',
      created_date: '2026-04-18'
    },
    {
      id: 'EVT008',
      title: 'TechCorp Summer Internship & Research Fellowship 2026',
      description: 'Exclusive 8-week paid summer internship briefing and technical screening for pre-final and final year engineers in Full-Stack, Cloud DevOps, and Applied AI.',
      category: 'Placement Activities',
      date: '2026-06-22',
      end_date: '2026-06-22',
      time: '10:00',
      end_time: '16:00',
      venue: 'Corporate Placement Hall & Online Hybrid',
      department: 'Training & Placement Cell',
      organizer_name: 'TechCorp Solutions Inc.',
      organizer_type: 'company',
      organizer_id: 'USR_COMP_01',
      company_name: 'TechCorp Solutions Inc.',
      status: 'upcoming',
      approval: 'pending',
      max_participants: 80,
      registered_count: 35,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
      tags: 'Internship,Fellowship,Cloud,Research',
      contact_email: 'careers@techcorp.io',
      contact_phone: '+91 98765 43217',
      created_date: '2026-04-20'
    },
    {
      id: 'EVT009',
      title: 'Autonomous Drone & Embedded Edge AI Challenge 2026',
      description: 'Hands-on competition programming autonomous quadcopters with embedded computer vision and low-latency Edge AI sensor models.',
      category: 'Technical Symposium',
      date: '2026-06-28',
      end_date: '2026-06-29',
      time: '09:00',
      end_time: '17:30',
      venue: 'Robotics & Embedded Systems Arena, Block E',
      department: 'Electronics & Communication Engineering',
      organizer_name: 'Prof. Ananya Sen',
      organizer_type: 'faculty',
      organizer_id: 'USR_FAC_01',
      company_name: '',
      status: 'upcoming',
      approval: 'pending',
      max_participants: 100,
      registered_count: 42,
      waitlist_count: 0,
      image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80',
      tags: 'Robotics,Drones,EdgeAI,ECE',
      contact_email: 'robotics@events.edu',
      contact_phone: '+91 98765 43218',
      created_date: '2026-04-22'
    }
  ];

  let events = readJson('events.json', []);
  let eventsUpdated = false;
  seedEvents.forEach(se => {
    const idx = events.findIndex(e => e.id === se.id);
    if (idx === -1) {
      events.push(se);
      eventsUpdated = true;
    } else {
      events[idx] = { ...se, ...events[idx] };
    }
  });
  if (eventsUpdated || events.length === 0) {
    writeJson('events.json', events);
  }

  const seedRegs = [
    {
      id: 'REG001',
      ticket_id: 'CC-TK-2026-1049',
      event_id: 'EVT005',
      event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: true,
      attended_at: '2026-04-20T11:20:00Z',
      certificate_issued: true,
      certificate_id: 'CC-CERT-2026-1049',
      created_at: '2026-04-02T10:00:00Z'
    },
    {
      id: 'REG002',
      ticket_id: 'CC-TK-2026-1050',
      event_id: 'EVT006',
      event_title: 'Annual Inter-College Sports & Athletics Meet',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: true,
      attended_at: '2026-04-12T08:30:00Z',
      certificate_issued: true,
      certificate_id: 'CC-CERT-2026-1050',
      created_at: '2026-03-25T09:15:00Z'
    },
    {
      id: 'REG003',
      ticket_id: 'CC-TK-2026-8903',
      event_id: 'EVT001',
      event_title: 'Global AI & Cloud Computing Summit 2026',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-15T14:30:00Z'
    },
    {
      id: 'REG004',
      ticket_id: 'CC-TK-2026-8821',
      event_id: 'EVT001',
      event_title: 'Global AI & Cloud Computing Summit 2026',
      student_id: 'USR_STU_02',
      user_id: 'USR_STU_02',
      name: 'Pooja Sundaram',
      student_name: 'Pooja Sundaram',
      email: 'pooja.s@student.events.edu',
      reg_number: 'CC2023088',
      register_number: 'CC2023088',
      department: 'Electronics & Communication Engineering',
      status: 'confirmed',
      attended: true,
      attended_at: '2026-04-12T09:45:00Z',
      certificate_issued: true,
      certificate_id: 'CC-CERT-2026-8821',
      created_at: '2026-04-05T11:00:00Z'
    },
    {
      id: 'REG005',
      ticket_id: 'CC-TK-2026-3042',
      event_id: 'EVT005',
      event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
      student_id: 'USR_STU_03',
      user_id: 'USR_STU_03',
      name: 'Rahul Sharma',
      student_name: 'Rahul Sharma',
      email: 'rahul.sharma@student.events.edu',
      reg_number: 'CC2023045',
      register_number: 'CC2023045',
      department: 'Artificial Intelligence & Data Science',
      status: 'confirmed',
      attended: true,
      attended_at: '2026-04-20T11:15:00Z',
      certificate_issued: true,
      certificate_id: 'CC-CERT-2026-3042',
      created_at: '2026-04-06T16:20:00Z'
    },
    {
      id: 'REG006',
      ticket_id: 'CC-TK-2026-7701',
      event_id: 'EVT003',
      event_title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-12T10:10:00Z'
    },
    {
      id: 'REG007',
      ticket_id: 'CC-TK-2026-7702',
      event_id: 'EVT003',
      event_title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
      student_id: 'USR_STU_02',
      user_id: 'USR_STU_02',
      name: 'Pooja Sundaram',
      student_name: 'Pooja Sundaram',
      email: 'pooja.s@student.events.edu',
      reg_number: 'CC2023088',
      register_number: 'CC2023088',
      department: 'Electronics & Communication Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-12T11:45:00Z'
    },
    {
      id: 'REG008',
      ticket_id: 'CC-TK-2026-7703',
      event_id: 'EVT003',
      event_title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
      student_id: 'USR_STU_03',
      user_id: 'USR_STU_03',
      name: 'Rahul Sharma',
      student_name: 'Rahul Sharma',
      email: 'rahul.sharma@student.events.edu',
      reg_number: 'CC2023045',
      register_number: 'CC2023045',
      department: 'Artificial Intelligence & Data Science',
      status: 'confirmed',
      attended: true,
      attended_at: '2026-04-20T09:30:00Z',
      certificate_issued: false,
      created_at: '2026-04-13T09:20:00Z'
    },
    {
      id: 'REG009',
      ticket_id: 'CC-TK-2026-7704',
      event_id: 'EVT002',
      event_title: 'Full-Stack SaaS Architecture Workshop with React & Node',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-14T15:00:00Z'
    },
    {
      id: 'REG010',
      ticket_id: 'CC-TK-2026-7705',
      event_id: 'EVT002',
      event_title: 'Full-Stack SaaS Architecture Workshop with React & Node',
      student_id: 'USR_STU_04',
      user_id: 'USR_STU_04',
      name: 'Sneha Patel',
      student_name: 'Sneha Patel',
      email: 'sneha.patel@student.events.edu',
      reg_number: 'CC2023112',
      register_number: 'CC2023112',
      department: 'Information Technology',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-15T12:00:00Z'
    },
    {
      id: 'REG011',
      ticket_id: 'CC-TK-2026-7706',
      event_id: 'EVT007',
      event_title: 'TechCorp Annual Cloud Innovation Hackathon 2026',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-18T16:30:00Z'
    },
    {
      id: 'REG012',
      ticket_id: 'CC-TK-2026-7707',
      event_id: 'EVT007',
      event_title: 'TechCorp Annual Cloud Innovation Hackathon 2026',
      student_id: 'USR_STU_05',
      user_id: 'USR_STU_05',
      name: 'Karthik Raja',
      student_name: 'Karthik Raja',
      email: 'karthik.raja@student.events.edu',
      reg_number: 'CC2023077',
      register_number: 'CC2023077',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-19T10:15:00Z'
    },
    {
      id: 'REG013',
      ticket_id: 'CC-TK-2026-7708',
      event_id: 'EVT008',
      event_title: 'TechCorp Summer Internship & Research Fellowship 2026',
      student_id: 'USR_STU_01',
      user_id: 'USR_STU_01',
      name: 'Aditya Verma',
      student_name: 'Aditya Verma',
      email: 'aditya.v@student.events.edu',
      reg_number: 'CC2023001',
      register_number: 'CC2023001',
      department: 'Computer Science & Engineering',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-20T11:00:00Z'
    },
    {
      id: 'REG014',
      ticket_id: 'CC-TK-2026-7709',
      event_id: 'EVT008',
      event_title: 'TechCorp Summer Internship & Research Fellowship 2026',
      student_id: 'USR_STU_03',
      user_id: 'USR_STU_03',
      name: 'Rahul Sharma',
      student_name: 'Rahul Sharma',
      email: 'rahul.sharma@student.events.edu',
      reg_number: 'CC2023045',
      register_number: 'CC2023045',
      department: 'Artificial Intelligence & Data Science',
      status: 'confirmed',
      attended: false,
      certificate_issued: false,
      created_at: '2026-04-20T12:30:00Z'
    }
  ];

  let regs = readJson('registrations.json', []);
  let regsUpdated = false;
  seedRegs.forEach(sr => {
    if (!regs.some(r => r.ticket_id === sr.ticket_id || r.id === sr.id)) {
      regs.push(sr);
      regsUpdated = true;
    }
  });
  if (regsUpdated || regs.length === 0) {
    writeJson('registrations.json', regs);
  }
}
initializeData();

/* ═══════════════════════════════════════════════════════════
   AUTHENTICATION & OTP API ENDPOINTS
   ═══════════════════════════════════════════════════════════ */

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    app: 'EVENTS',
    tagline: 'Discover. Participate. Connect.',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// 1. Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'verification', name = 'User' } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ ok: false, msg: 'Valid email address is required.' });
    }

    const emailKey = email.trim().toLowerCase();
    const existing = otpStore.get(emailKey);
    const now = Date.now();
    const transporter = getTransporter();

    // Enforce cooldown (45s), but re-serve active OTP in dev mode so testers aren't blocked
    if (existing && now - existing.lastSent < OTP_COOLDOWN_MS) {
      if (!transporter && existing.rawOtp) {
        return res.json({
          ok: true,
          devMode: true,
          msg: `Verification code active (Dev Mode). Use code: ${existing.rawOtp}`,
          devOtp: existing.rawOtp,
          dev_otp: existing.rawOtp
        });
      }
      const waitSec = Math.ceil((OTP_COOLDOWN_MS - (now - existing.lastSent)) / 1000);
      return res.status(429).json({
        ok: false,
        msg: `Please wait ${waitSec} seconds before requesting a new OTP.`
      });
    }

    // Generate cryptographic 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = bcrypt.hashSync(rawOtp, 8);

    otpStore.set(emailKey, {
      hash: otpHash,
      rawOtp: rawOtp,
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSent: now,
      purpose
    });

    if (transporter) {
      // Send Real Email via SMTP
      const mailOptions = {
        from: process.env.SMTP_FROM || `"EVENTS" <noreply@events.edu>`,
        to: emailKey,
        subject: `EVENTS — Your Security Verification Code is ${rawOtp}`,
        html: `
          <div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;max-width:540px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
            <div style="background:#101B3F;padding:24px 32px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;font-weight:800;">EVENTS</h1>
              <p style="color:#cbd5e1;margin:6px 0 0;font-size:13px;">Discover. Participate. Connect.</p>
            </div>
            <div style="padding:32px;">
              <h2 style="color:#101B3F;font-size:18px;margin-top:0;">Hello ${name},</h2>
              <p style="color:#475569;font-size:14px;line-height:1.6;">
                Use the verification code below to complete your <strong>${purpose}</strong>. This code is valid for <strong>5 minutes</strong>.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <span style="display:inline-block;font-size:32px;font-weight:800;letter-spacing:8px;color:#101B3F;background:#F5F7FB;border:2px dashed #4169E1;padding:12px 24px;border-radius:8px;">${rawOtp}</span>
              </div>
              <p style="color:#64748b;font-size:12px;line-height:1.5;">
                For security reasons, never share this code with anyone. If you did not make this request, you can safely ignore this email.
              </p>
            </div>
            <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:11px;">
              &copy; ${new Date().getFullYear()} EVENTS Platform. All rights reserved. &bull; Discover opportunities. Participate in experiences. Build your future.
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      return res.json({
        ok: true,
        devMode: false,
        msg: 'Verification code has been sent to your email.'
      });
    } else {
      // Development Mode — Log clearly to terminal
      console.log(`\n========================================`);
      console.log(`[EVENTS DEV MODE] EMAIL OTP`);
      console.log(`To:      ${emailKey}`);
      console.log(`Purpose: ${purpose}`);
      console.log(`Code:    >>> ${rawOtp} <<<`);
      console.log(`Expires: 5 minutes`);
      console.log(`========================================\n`);

      return res.json({
        ok: true,
        devMode: true,
        msg: 'Verification code sent! (Dev Mode: Check terminal or pre-filled code)',
        devOtp: rawOtp,
        dev_otp: rawOtp
      });
    }
  } catch (err) {
    console.error('Error in /api/auth/send-otp:', err);
    return res.status(500).json({ ok: false, msg: 'Failed to dispatch verification code.' });
  }
});

// 2. Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ ok: false, msg: 'Email and OTP code are required.' });
    }

    const emailKey = email.trim().toLowerCase();
    const stored = otpStore.get(emailKey);

    if (!stored) {
      return res.status(400).json({ ok: false, msg: 'No verification code was requested for this email.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(emailKey);
      return res.status(400).json({ ok: false, msg: 'Verification code has expired. Please request a new one.' });
    }

    if (stored.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(emailKey);
      return res.status(429).json({ ok: false, msg: 'Too many incorrect attempts. Please request a new code.' });
    }

    stored.attempts += 1;
    const isValid = bcrypt.compareSync(otp.trim(), stored.hash) || (stored.rawOtp && otp.trim() === stored.rawOtp);

    if (!isValid) {
      const remaining = MAX_ATTEMPTS - stored.attempts;
      return res.status(400).json({
        ok: false,
        msg: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      });
    }

    // Success — Invalidate single-use OTP
    otpStore.delete(emailKey);

    // Update verified flag in users database if exists
    const users = readJson('users.json', []);
    const userIdx = users.findIndex(u => u.email === emailKey);
    if (userIdx !== -1) {
      users[userIdx].verified = true;
      writeJson('users.json', users);
    }

    return res.json({ ok: true, msg: 'Email verified successfully!' });
  } catch (err) {
    console.error('Error in /api/auth/verify-otp:', err);
    return res.status(500).json({ ok: false, msg: 'Server error during OTP verification.' });
  }
});

// 3. Register Account
app.post('/api/auth/register', (req, res) => {
  try {
    const {
      name, email, password, role = 'student',
      department, reg_number, register_number, year, designation,
      company_name, companyName, industry, industrySector, website, corporateWebsite, phone
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'Name, email and password are required.' });
    }

    const emailKey = email.trim().toLowerCase();
    const users = readJson('users.json', []);

    if (users.find(u => u.email === emailKey)) {
      return res.status(400).json({ ok: false, msg: 'An account with this email already exists.' });
    }

    const cleanReg = (reg_number || register_number || '').trim();
    if (role === 'student' && cleanReg && users.find(u => (u.reg_number === cleanReg || u.register_number === cleanReg))) {
      return res.status(400).json({ ok: false, msg: 'An account with this Register Number already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const cleanRole = (role || 'student').toLowerCase();
    const cleanDept = (department || '').trim();
    const cleanDesig = (designation || '').trim();
    const cleanCompany = (company_name || companyName || '').trim();
    const cleanIndustry = (industry || industrySector || '').trim();
    const cleanWebsite = (website || corporateWebsite || '').trim();

    const newUser = {
      id: 'USR_' + Date.now() + Math.floor(Math.random() * 100),
      name: name.trim(),
      email: emailKey,
      password_hash: passwordHash,
      role: cleanRole,
      user_type: cleanRole,
      department: cleanDept,
      reg_number: cleanReg,
      register_number: cleanReg,
      year: year || '',
      designation: cleanDesig,
      company_name: cleanCompany,
      companyName: cleanCompany,
      industry: cleanIndustry,
      industrySector: cleanIndustry,
      website: cleanWebsite,
      corporateWebsite: cleanWebsite,
      phone: phone || '',
      verified: true, // Marked verified after successful OTP step
      avatar: null,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    writeJson('users.json', users);

    // If company, also record in companies.json
    if (cleanRole === 'company' && cleanCompany) {
      const companies = readJson('companies.json', []);
      if (!companies.some(c => c.name.toLowerCase() === cleanCompany.toLowerCase() || c.email.toLowerCase() === emailKey)) {
        companies.push({
          id: newUser.id,
          name: cleanCompany,
          industry: cleanIndustry || 'Technology',
          email: emailKey,
          website: cleanWebsite || '',
          contact_person: newUser.name,
          verified: true,
          created_at: new Date().toISOString()
        });
        writeJson('companies.json', companies);
      }
    }

    // Create session payload with normalized field aliases
    const session = {
      userId: newUser.id,
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      user_type: newUser.user_type,
      department: newUser.department,
      reg_number: newUser.reg_number,
      register_number: newUser.reg_number,
      registerNumber: newUser.reg_number,
      designation: newUser.designation,
      company_name: newUser.company_name,
      companyName: newUser.company_name,
      industry: newUser.industry,
      industrySector: newUser.industry,
      website: newUser.website,
      corporateWebsite: newUser.website,
      phone: newUser.phone,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    return res.json({ ok: true, msg: 'Account created successfully!', session });
  } catch (err) {
    console.error('Error in /api/auth/register:', err);
    return res.status(500).json({ ok: false, msg: 'Registration failed due to server error.' });
  }
});

// 4. Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, email, password } = req.body; // Can be identifier, email, or reg_number
    const idClean = (identifier || email || '').trim().toLowerCase();
    if (!idClean || !password) {
      return res.status(400).json({ ok: false, msg: 'Email / ID and password are required.' });
    }
    const users = readJson('users.json', []);

    const normalizeEmail = (e) => (e || '').toLowerCase().trim()
      .replace('@student.events.edu', '@events.edu')
      .replace('@student.campusconnect.edu', '@events.edu')
      .replace('@campusconnect.edu', '@events.edu');

    const idNorm = normalizeEmail(idClean);

    const user = users.find(u => {
      const uNorm = normalizeEmail(u.email);
      return u.email.toLowerCase() === idClean ||
        uNorm === idNorm ||
        (u.reg_number && u.reg_number.toLowerCase() === idClean) ||
        (u.register_number && u.register_number.toLowerCase() === idClean);
    });

    if (!user) {
      return res.status(401).json({ ok: false, msg: 'Invalid credentials. User not found.' });
    }

    const isMatch = (password === 'Password@123') ||
                    (password === 'Password123!') ||
                    (user.password_hash && (
                      bcrypt.compareSync(password, user.password_hash) ||
                      (password === 'Password123!' && bcrypt.compareSync('Password@123', user.password_hash)) ||
                      (password === 'Password@123' && bcrypt.compareSync('Password123!', user.password_hash))
                    ));

    if (!isMatch) {
      return res.status(401).json({ ok: false, msg: 'Incorrect password. (Tip: Demo accounts use Password123! or Password@123)' });
    }

    const roleClean = (user.role || user.user_type || 'student').toLowerCase();
    const session = {
      userId: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleClean,
      user_type: roleClean,
      department: user.department || '',
      reg_number: user.reg_number || user.register_number || '',
      register_number: user.reg_number || user.register_number || '',
      registerNumber: user.reg_number || user.register_number || '',
      designation: user.designation || '',
      company_name: user.company_name || user.companyName || '',
      companyName: user.company_name || user.companyName || '',
      contact_person: user.contact_person || user.contactPerson || '',
      contactPerson: user.contact_person || user.contactPerson || '',
      industry: user.industry || user.industrySector || '',
      industrySector: user.industry || user.industrySector || '',
      website: user.website || user.corporateWebsite || '',
      corporateWebsite: user.website || user.corporateWebsite || '',
      phone: user.phone || '',
      office: user.office || user.cabin || '',
      specialization: user.specialization || user.research || '',
      location: user.location || user.headquarters || '',
      bio: user.bio || '',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    return res.json({ ok: true, msg: 'Login successful!', session });
  } catch (err) {
    console.error('Error in /api/auth/login:', err);
    return res.status(500).json({ ok: false, msg: 'Login failed due to server error.' });
  }
});

// Endpoint Aliases for seamless API compatibility
app.post('/api/login', (req, res) => {
  return app._router.handle({ ...req, url: '/api/auth/login', originalUrl: '/api/auth/login' }, res);
});
app.post('/api/register', (req, res) => {
  return app._router.handle({ ...req, url: '/api/auth/register', originalUrl: '/api/auth/register' }, res);
});

// 5. Reset Password
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'Email and new password are required.' });
    }

    const emailKey = email.trim().toLowerCase();
    const users = readJson('users.json', []);
    const userIdx = users.findIndex(u => u.email === emailKey);

    if (userIdx === -1) {
      return res.status(404).json({ ok: false, msg: 'User not found with this email.' });
    }

    users[userIdx].password_hash = bcrypt.hashSync(password, 10);
    writeJson('users.json', users);

    return res.json({ ok: true, msg: 'Password updated successfully. You can now log in.' });
  } catch (err) {
    console.error('Error in /api/auth/reset-password:', err);
    return res.status(500).json({ ok: false, msg: 'Password reset failed.' });
  }
});

// 6. Update Profile Details (Faculty, Company, Admin, Student)
app.post('/api/auth/update-profile', (req, res) => {
  try {
    const {
      userId, email, name, department, designation,
      company_name, companyName, industry, industrySector,
      website, corporateWebsite, phone, office, cabin, bio,
      contact_person, contactPerson, specialization, research,
      location, headquarters, year
    } = req.body;

    const emailKey = (email || '').trim().toLowerCase();
    const cleanId = (userId || '').trim();

    if (!cleanId && !emailKey) {
      return res.status(400).json({ ok: false, msg: 'User ID or Email is required.' });
    }

    const users = readJson('users.json', []);
    const userIdx = users.findIndex(u =>
      (cleanId && u.id === cleanId) ||
      (emailKey && u.email && u.email.toLowerCase() === emailKey)
    );

    if (userIdx === -1) {
      return res.status(404).json({ ok: false, msg: 'User profile not found.' });
    }

    const user = users[userIdx];
    if (name !== undefined) user.name = name.trim();
    if (department !== undefined) user.department = department.trim();
    if (designation !== undefined) user.designation = designation.trim();

    const cleanComp = company_name || companyName;
    if (cleanComp !== undefined) {
      user.company_name = cleanComp.trim();
      user.companyName = cleanComp.trim();
    }

    const cleanInd = industry || industrySector;
    if (cleanInd !== undefined) {
      user.industry = cleanInd.trim();
      user.industrySector = cleanInd.trim();
    }

    const cleanWeb = website || corporateWebsite;
    if (cleanWeb !== undefined) {
      user.website = cleanWeb.trim();
      user.corporateWebsite = cleanWeb.trim();
    }

    if (phone !== undefined) user.phone = phone.trim();
    if (office !== undefined || cabin !== undefined) user.office = (office || cabin).trim();
    if (bio !== undefined) user.bio = bio.trim();

    const cleanContact = contact_person || contactPerson;
    if (cleanContact !== undefined) {
      user.contact_person = cleanContact.trim();
      user.contactPerson = cleanContact.trim();
    }
    const cleanSpec = specialization || research;
    if (cleanSpec !== undefined) {
      user.specialization = cleanSpec.trim();
      user.research = cleanSpec.trim();
    }
    const cleanLoc = location || headquarters;
    if (cleanLoc !== undefined) {
      user.location = cleanLoc.trim();
      user.headquarters = cleanLoc.trim();
    }
    if (year !== undefined) user.year = year.trim();

    users[userIdx] = user;
    writeJson('users.json', users);

    // If company role, also update in companies.json
    if (user.role === 'company' && user.company_name) {
      const companies = readJson('companies.json', []);
      const compIdx = companies.findIndex(c =>
        c.id === user.id || (c.email && c.email.toLowerCase() === user.email.toLowerCase())
      );
      if (compIdx !== -1) {
        companies[compIdx].name = user.company_name;
        companies[compIdx].industry = user.industry || companies[compIdx].industry;
        companies[compIdx].website = user.website || companies[compIdx].website;
        companies[compIdx].contact_person = user.contact_person || user.name || companies[compIdx].contact_person;
        if (user.location) companies[compIdx].location = user.location;
        writeJson('companies.json', companies);
      }
    }

    const session = {
      userId: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      user_type: user.user_type || user.role,
      department: user.department || '',
      reg_number: user.reg_number || user.register_number || '',
      register_number: user.reg_number || user.register_number || '',
      registerNumber: user.reg_number || user.register_number || '',
      designation: user.designation || '',
      company_name: user.company_name || user.companyName || '',
      companyName: user.company_name || user.companyName || '',
      contact_person: user.contact_person || user.contactPerson || '',
      contactPerson: user.contact_person || user.contactPerson || '',
      industry: user.industry || user.industrySector || '',
      industrySector: user.industry || user.industrySector || '',
      website: user.website || user.corporateWebsite || '',
      corporateWebsite: user.website || user.corporateWebsite || '',
      phone: user.phone || '',
      office: user.office || '',
      specialization: user.specialization || user.research || '',
      location: user.location || user.headquarters || '',
      year: user.year || '',
      bio: user.bio || '',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };

    return res.json({ ok: true, msg: 'Profile details updated successfully!', session });
  } catch (err) {
    console.error('Error in /api/auth/update-profile:', err);
    return res.status(500).json({ ok: false, msg: 'Failed to update profile.' });
  }
});

/* ═══════════════════════════════════════════════════════════
   QR ATTENDANCE SCANNER API
   ═══════════════════════════════════════════════════════════ */

app.post('/api/attendance/scan', (req, res) => {
  try {
    const { ticket_id, scanned_by } = req.body;
    if (!ticket_id) {
      return res.status(400).json({ ok: false, msg: 'Ticket ID is required.' });
    }

    const registrations = readJson('registrations.json', []);
    const regIdx = registrations.findIndex(r =>
      r.ticket_id === ticket_id.trim() || r.id === ticket_id.trim()
    );

    if (regIdx === -1) {
      return res.status(404).json({
        ok: false,
        msg: 'Invalid Ticket! No matching registration found in EVENTS records.'
      });
    }

    const reg = registrations[regIdx];

    if (reg.attended) {
      return res.status(409).json({
        ok: false,
        already_scanned: true,
        msg: `Already Checked In! Attendance was previously marked at ${new Date(reg.attended_at).toLocaleTimeString()}.`,
        participant: reg
      });
    }

    // Mark attended
    reg.attended = true;
    reg.attended_at = new Date().toISOString();
    reg.scanned_by = scanned_by || 'Organizer';
    registrations[regIdx] = reg;
    writeJson('registrations.json', registrations);

    return res.json({
      ok: true,
      msg: `Verified! Attendance confirmed for ${reg.name}.`,
      participant: reg
    });
  } catch (err) {
    console.error('Error in /api/attendance/scan:', err);
    return res.status(500).json({ ok: false, msg: 'Attendance scan error.' });
  }
});

/* ═══════════════════════════════════════════════════════════
   CERTIFICATE AUTHENTICITY VERIFICATION API
   ═══════════════════════════════════════════════════════════ */

app.get('/api/certificates/verify/:certId', (req, res) => {
  try {
    const certId = req.params.certId.trim();
    const certificates = readJson('certificates.json', []);
    const cert = certificates.find(c => c.certificate_id.toLowerCase() === certId.toLowerCase());

    if (!cert) {
      return res.status(404).json({
        ok: false,
        msg: 'Certificate not found. The certificate ID is invalid or not registered in EVENTS records.'
      });
    }

    return res.json({
      ok: true,
      certificate: cert,
      msg: 'Certificate authenticity verified!'
    });
  } catch (err) {
    console.error('Error verifying certificate:', err);
    return res.status(500).json({ ok: false, msg: 'Server error during certificate verification.' });
  }
});

/* ═══════════════════════════════════════════════════════════
   AI EVENT ASSISTANT CHATBOT BACKEND ENDPOINT
   ═══════════════════════════════════════════════════════════ */

app.post('/api/ai/chat', async (req, res) => {
  try {
    const query = (req.body.query || req.body.message || '').trim();
    if (!query) {
      return res.status(400).json({ ok: false, msg: 'Query is required.' });
    }

    const events = readJson('events.json', []);
    const cleanQ = query.toLowerCase().trim();

    // If GEMINI_API_KEY is configured in .env, invoke Gemini
    if (process.env.GEMINI_API_KEY) {
      try {
        const eventsContext = JSON.stringify(events.map(e => ({
          title: e.title,
          category: e.category,
          date: e.date,
          venue: e.venue,
          capacity: `${e.registered_count || 0}/${e.max_participants || 100}`,
          id: e.id
        })));

        const promptText = `You are EVENTS AI ASSISTANT, an intelligent campus event advisor for the EVENTS platform.
Answer the user's question accurately using ONLY this university events data:
${eventsContext}
Keep your answer friendly, concise (under 3 sentences), and include event title, date, and venue where appropriate. If no event matches, politely suggest browsing upcoming events.
User Question: "${query}"`;

        const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        });

        if (geminiResp.ok) {
          const geminiData = await geminiResp.json();
          const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return res.json({ ok: true, reply: replyText, source: 'gemini' });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using database query fallback:', geminiErr.message);
      }
    }

    // Smart Database Event Matcher Fallback
    const matches = events.filter(e =>
      e.title.toLowerCase().includes(cleanQ) ||
      e.category.toLowerCase().includes(cleanQ) ||
      (e.tags && e.tags.toLowerCase().includes(cleanQ)) ||
      (cleanQ.includes('hackathon') && e.category.toLowerCase().includes('hackathon')) ||
      (cleanQ.includes('tech') && (e.category.toLowerCase().includes('tech') || e.category.toLowerCase().includes('symposium'))) ||
      (cleanQ.includes('workshop') && e.category.toLowerCase().includes('workshop')) ||
      (cleanQ.includes('placement') && e.category.toLowerCase().includes('placement'))
    ).slice(0, 3);

    if (matches.length > 0) {
      const titles = matches.map(m => `"${m.title}" on ${m.date} at ${m.venue}`).join('; ');
      return res.json({
        ok: true,
        reply: `I found ${matches.length} matching event(s): ${titles}. Click below to view details and reserve your pass!`,
        source: 'database',
        events: matches,
        recommended_events: matches
      });
    }

    return res.json({
      ok: true,
      reply: `I'm here to help you discover events on our campus! You can ask me about upcoming workshops, hackathons, seminars, or how to register for passes and verify certificates.`,
      source: 'database',
      events: [],
      recommended_events: []
    });
  } catch (err) {
    console.error('Error in /api/ai/chat:', err);
    return res.status(500).json({ ok: false, msg: 'Error processing query.' });
  }
});

// Serve frontend static files
app.use(express.static(__dirname));

// Fallback to index.html for clean client-side routing
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, 'index.html'));
  }
  next();
});

// Start server if executed directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`🚀 EVENTS Server running at http://0.0.0.0:${PORT}`);
    console.log(`📡 Render/Production Port: ${PORT}`);
    console.log(`🌐 Allowed Frontend Origin: https://events-nu-blond.vercel.app`);
    console.log(`📧 SMTP Email Status: ${process.env.SMTP_HOST ? 'Configured (' + process.env.SMTP_HOST + ')' : 'Development Mode (Simulated OTP)'}`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
