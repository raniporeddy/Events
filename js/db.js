/**
 * CampusConnect — Unified Data Management Layer
 * Handles Events, Registrations, Companies, Attendance, Certificates, and Activity Logs.
 * Offline-first with localStorage and server synchronization.
 */

const DB = (() => {
  const PREFIX = 'campusconnect_db_';
  const key = table => `${PREFIX}${table}`;

  /* ───────── SEED DATA ───────── */
  const SEED = {
    events: [
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
        contact_email: 'ai.summit@campusconnect.edu',
        contact_phone: '+91 98765 43210',
        created_date: '2026-04-01'
      },
      {
        id: 'EVT002',
        title: 'Full-Stack SaaS Architecture Workshop with React & Node',
        description: 'Hands-on practical development bootcamp building multi-tenant microservices, automated CI/CD pipelines, and high-performance reactive user interfaces.',
        category: 'Workshop',
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
        contact_email: 'workshop.it@campusconnect.edu',
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
        contact_email: 'hackathon@campusconnect.edu',
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
    ],

    registrations: [
      {
        id: 'REG001',
        ticket_id: 'CC-TK-2026-1049',
        event_id: 'EVT005',
        event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-02',
        status: 'confirmed',
        attended: true,
        attended_at: '2026-04-20T11:20:00Z',
        certificate_issued: true,
        certificate_id: 'CC-CERT-2026-1049'
      },
      {
        id: 'REG002',
        ticket_id: 'CC-TK-2026-1050',
        event_id: 'EVT006',
        event_title: 'Annual Inter-College Sports & Athletics Meet',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-03-25',
        status: 'confirmed',
        attended: true,
        attended_at: '2026-04-12T08:30:00Z',
        certificate_issued: true,
        certificate_id: 'CC-CERT-2026-1050'
      },
      {
        id: 'REG003',
        ticket_id: 'CC-TK-2026-8903',
        event_id: 'EVT001',
        event_title: 'Global AI & Cloud Computing Summit 2026',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-15',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false,
        certificate_id: null
      },
      {
        id: 'REG004',
        ticket_id: 'CC-TK-2026-8821',
        event_id: 'EVT001',
        event_title: 'Global AI & Cloud Computing Summit 2026',
        user_id: 'USR_STU_02',
        name: 'Pooja Sundaram',
        student_name: 'Pooja Sundaram',
        email: 'pooja.s@student.events.edu',
        reg_number: 'CC2023088',
        register_number: 'CC2023088',
        user_type: 'student',
        department: 'Electronics & Communication Engineering',
        registration_date: '2026-04-05',
        status: 'confirmed',
        attended: true,
        attended_at: '2026-04-12T09:45:00Z',
        certificate_issued: true,
        certificate_id: 'CC-CERT-2026-8821'
      },
      {
        id: 'REG005',
        ticket_id: 'CC-TK-2026-3042',
        event_id: 'EVT005',
        event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
        user_id: 'USR_STU_03',
        name: 'Rahul Sharma',
        student_name: 'Rahul Sharma',
        email: 'rahul.sharma@student.events.edu',
        reg_number: 'CC2023045',
        register_number: 'CC2023045',
        user_type: 'student',
        department: 'Artificial Intelligence & Data Science',
        registration_date: '2026-04-06',
        status: 'confirmed',
        attended: true,
        attended_at: '2026-04-20T11:15:00Z',
        certificate_issued: true,
        certificate_id: 'CC-CERT-2026-3042'
      },
      {
        id: 'REG006',
        ticket_id: 'CC-TK-2026-7701',
        event_id: 'EVT003',
        event_title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-12',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG007',
        ticket_id: 'CC-TK-2026-7702',
        event_id: 'EVT003',
        event_title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
        user_id: 'USR_STU_02',
        name: 'Pooja Sundaram',
        student_name: 'Pooja Sundaram',
        email: 'pooja.s@student.events.edu',
        reg_number: 'CC2023088',
        register_number: 'CC2023088',
        user_type: 'student',
        department: 'Electronics & Communication Engineering',
        registration_date: '2026-04-12',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG008',
        ticket_id: 'CC-TK-2026-7703',
        event_id: 'EVT003',
        event_title: 'TechCorp Campus Placement Drive & Technical Interview Prep',
        user_id: 'USR_STU_03',
        name: 'Rahul Sharma',
        student_name: 'Rahul Sharma',
        email: 'rahul.sharma@student.events.edu',
        reg_number: 'CC2023045',
        register_number: 'CC2023045',
        user_type: 'student',
        department: 'Artificial Intelligence & Data Science',
        registration_date: '2026-04-13',
        status: 'confirmed',
        attended: true,
        attended_at: '2026-04-20T09:30:00Z',
        certificate_issued: false
      },
      {
        id: 'REG009',
        ticket_id: 'CC-TK-2026-7704',
        event_id: 'EVT002',
        event_title: 'Full-Stack SaaS Architecture Workshop with React & Node',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-14',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG010',
        ticket_id: 'CC-TK-2026-7705',
        event_id: 'EVT002',
        event_title: 'Full-Stack SaaS Architecture Workshop with React & Node',
        user_id: 'USR_STU_04',
        name: 'Sneha Patel',
        student_name: 'Sneha Patel',
        email: 'sneha.patel@student.events.edu',
        reg_number: 'CC2023112',
        register_number: 'CC2023112',
        user_type: 'student',
        department: 'Information Technology',
        registration_date: '2026-04-15',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG011',
        ticket_id: 'CC-TK-2026-7706',
        event_id: 'EVT007',
        event_title: 'TechCorp Annual Cloud Innovation Hackathon 2026',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-18',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG012',
        ticket_id: 'CC-TK-2026-7707',
        event_id: 'EVT007',
        event_title: 'TechCorp Annual Cloud Innovation Hackathon 2026',
        user_id: 'USR_STU_05',
        name: 'Karthik Raja',
        student_name: 'Karthik Raja',
        email: 'karthik.raja@student.events.edu',
        reg_number: 'CC2023077',
        register_number: 'CC2023077',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-19',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG013',
        ticket_id: 'CC-TK-2026-7708',
        event_id: 'EVT008',
        event_title: 'TechCorp Summer Internship & Research Fellowship 2026',
        user_id: 'USR_STU_01',
        name: 'Aditya Verma',
        student_name: 'Aditya Verma',
        email: 'aditya.v@student.events.edu',
        reg_number: 'CC2023001',
        register_number: 'CC2023001',
        user_type: 'student',
        department: 'Computer Science & Engineering',
        registration_date: '2026-04-20',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      },
      {
        id: 'REG014',
        ticket_id: 'CC-TK-2026-7709',
        event_id: 'EVT008',
        event_title: 'TechCorp Summer Internship & Research Fellowship 2026',
        user_id: 'USR_STU_03',
        name: 'Rahul Sharma',
        student_name: 'Rahul Sharma',
        email: 'rahul.sharma@student.events.edu',
        reg_number: 'CC2023045',
        register_number: 'CC2023045',
        user_type: 'student',
        department: 'Artificial Intelligence & Data Science',
        registration_date: '2026-04-20',
        status: 'confirmed',
        attended: false,
        attended_at: null,
        certificate_issued: false
      }
    ],

    certificates: [
      {
        certificate_id: 'CC-CERT-2026-1049',
        ticket_id: 'CC-TK-2026-1049',
        event_id: 'EVT005',
        event_title: 'CyberShield Zero-Trust Security & Cloud Defense Masterclass',
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
        recipient_name: 'Rahul Sharma',
        reg_number: 'CC2023045',
        recipient_email: 'rahul.sharma@student.events.edu',
        issue_date: '2026-04-20',
        issuer_name: 'EVENTS Academic Council',
        institution: 'SCSVMV Deemed to be University',
        verified: true
      }
    ],

    feedback: [
      {
        id: 'FBK001',
        event_id: 'EVT005',
        participant_name: 'Aditya Verma',
        rating: 5,
        title: 'Incredible Industry Insights on Zero Trust!',
        review: 'The live red team vs blue team demonstrations gave practical clarity that textbooks simply cannot match. Excellent organization by CampusConnect.',
        date: '2026-04-21',
        photos: [
          'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80'
        ]
      },
      {
        id: 'FBK002',
        event_id: 'EVT006',
        participant_name: 'Aditya Verma',
        rating: 5,
        title: 'Outstanding Sports Facilities & Team Spirit',
        review: 'The track events were well managed with digital timing. Looking forward to next year championship!',
        date: '2026-04-15',
        photos: []
      }
    ],

    companies: [
      {
        id: 'USR_COMP_01',
        name: 'TechCorp Solutions Inc.',
        industry: 'Software & Cloud Services',
        email: 'connect@techcorp.io',
        website: 'https://techcorp.io',
        contact_person: 'Rohan Mehra',
        verified: true,
        logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80',
        description: 'Global enterprise software leader specializing in high-throughput cloud infrastructure and automated AI developer tools.'
      },
      {
        id: 'USR_COMP_02',
        name: 'CyberShield Defense Labs',
        industry: 'Information Security',
        email: 'edu@cybershield.com',
        website: 'https://cybershield.com',
        contact_person: 'Elena Vance',
        verified: true,
        logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=80',
        description: 'Next-generation cybersecurity consultancy providing threat intelligence and hands-on workforce skill transformation.'
      }
    ],

    activity_logs: [
      {
        id: 'ACT001',
        user: 'Dr. S. K. Narayanan',
        role: 'Admin',
        action: 'Event Approved',
        detail: 'Approved "Global AI & Cloud Computing Summit 2026"',
        timestamp: '2026-04-01T10:15:00Z'
      },
      {
        id: 'ACT002',
        user: 'TechCorp Solutions Inc.',
        role: 'Company',
        action: 'Event Submitted',
        detail: 'Submitted "TechCorp Campus Placement Drive & Technical Interview Prep"',
        timestamp: '2026-04-10T14:30:00Z'
      },
      {
        id: 'ACT003',
        user: 'Prof. Ananya Sen',
        role: 'Faculty',
        action: 'Attendance Verified',
        detail: 'Verified 148 attendees for CyberShield Zero-Trust Security Masterclass',
        timestamp: '2026-04-20T17:00:00Z'
      }
    ],

    notifications: [
      {
        id: 'NTF001',
        user_id: 'all',
        title: 'Upcoming Tech Summit',
        message: 'Registrations are filling fast for the Global AI & Cloud Computing Summit on May 18.',
        type: 'event',
        link: 'event-details.html?id=EVT001',
        timestamp: '2026-04-15T09:00:00Z',
        read: false
      },
      {
        id: 'NTF002',
        user_id: 'all',
        title: 'Placement Drive Alert',
        message: 'TechCorp Solutions Inc. has opened registrations for eligible B.Tech / M.Tech batches.',
        type: 'placement',
        link: 'event-details.html?id=EVT003',
        timestamp: '2026-04-12T11:30:00Z',
        read: false
      }
    ],

    favorites: [
      { user_id: 'USR_STU_01', event_id: 'EVT004' }
    ]
  };

  /* ───────── INITIALIZATION ───────── */
  function init() {
    Object.keys(SEED).forEach(table => {
      const stored = localStorage.getItem(key(table));
      if (!stored) {
        localStorage.setItem(key(table), JSON.stringify(SEED[table]));
      } else {
        try {
          const currentData = JSON.parse(stored);
          if (Array.isArray(currentData) && Array.isArray(SEED[table])) {
            const pkField = table === 'certificates' ? 'certificate_id' : 'id';
            let updated = false;
            SEED[table].forEach(seedItem => {
              const pk = seedItem[pkField];
              if (pk && !currentData.some(item => item[pkField] === pk)) {
                currentData.push(seedItem);
                updated = true;
              }
            });
            if (updated) {
              localStorage.setItem(key(table), JSON.stringify(currentData));
            }
          }
        } catch (e) {
          localStorage.setItem(key(table), JSON.stringify(SEED[table]));
        }
      }
    });
  }
  init();

  /* ───────── CORE CRUD OPERATIONS ───────── */
  function getAll(table) {
    try {
      const data = localStorage.getItem(key(table));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  function getById(table, fieldOrId, maybeVal) {
    if (maybeVal === undefined) {
      const id = String(fieldOrId);
      const pkField = table === 'certificates' ? 'certificate_id' : 'id';
      return getAll(table).find(r =>
        String(r[pkField]) === id ||
        String(r.id) === id ||
        String(r.ticket_id) === id ||
        String(r.certificate_id) === id
      ) || null;
    }
    return getAll(table).find(r => r[fieldOrId] === maybeVal) || null;
  }

  function getWhere(table, filterObj) {
    return getAll(table).filter(r =>
      Object.entries(filterObj).every(([k, v]) => r[k] === v)
    );
  }

  function insert(table, record) {
    const data = getAll(table);
    data.unshift(record);
    localStorage.setItem(key(table), JSON.stringify(data));
    logActivity(record.organizer_name || record.name || 'System', 'Created Record', `Added record in ${table}`);
    return record;
  }

  function update(table, field, val, updates) {
    const data = getAll(table);
    const idx = data.findIndex(r => r[field] === val);
    if (idx !== -1) {
      data[idx] = { ...data[idx], ...updates };
      localStorage.setItem(key(table), JSON.stringify(data));
      return data[idx];
    }
    return null;
  }

  function remove(table, field, val) {
    const data = getAll(table).filter(r => r[field] !== val);
    localStorage.setItem(key(table), JSON.stringify(data));
  }

  /* ───────── AUDIT LOGGING ───────── */
  function logActivity(user, action, detail) {
    const logs = getAll('activity_logs');
    logs.unshift({
      id: 'ACT_' + Date.now(),
      user: user || 'System',
      role: (Auth && Auth.getSession && Auth.getSession() ? Auth.getSession().role : 'Guest'),
      action,
      detail,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(key('activity_logs'), JSON.stringify(logs.slice(0, 100)));
  }

  /* ───────── ADVANCED EVENT REGISTRATION ENGINE ───────── */
  function registerForEvent(eventId, userData, preferences = {}) {
    const event = getById('events', 'id', eventId);
    if (!event) return { ok: false, msg: 'Event not found.' };

    const registrations = getAll('registrations');
    const existing = registrations.find(r =>
      r.event_id === eventId && (r.user_id === userData.userId || r.email.toLowerCase() === userData.email.toLowerCase())
    );

    if (existing && existing.status !== 'cancelled') {
      return { ok: false, msg: 'You are already registered for this event.', ticket: existing };
    }

    // Schedule Conflict Detection
    const userOtherRegs = registrations.filter(r =>
      (r.user_id === userData.userId || r.email.toLowerCase() === userData.email.toLowerCase()) &&
      r.status === 'confirmed' && r.event_id !== eventId
    );

    for (const otherReg of userOtherRegs) {
      const otherEvt = getById('events', 'id', otherReg.event_id);
      if (otherEvt && otherEvt.date === event.date && otherEvt.time === event.time) {
        return {
          ok: false,
          conflict: true,
          msg: `Schedule Conflict: You are already confirmed for "${otherEvt.title}" at the same date and time (${event.date} at ${event.time}).`
        };
      }
    }

    // Capacity Check
    const currentCount = Number(event.registered_count || 0);
    const maxCapacity = Number(event.max_participants || 100);
    const isFull = currentCount >= maxCapacity;

    const ticketId = 'CC-TKT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const newReg = {
      id: 'REG_' + Date.now(),
      ticket_id: ticketId,
      event_id: eventId,
      event_title: event.title,
      event_date: event.date,
      event_time: event.time,
      event_venue: event.venue,
      user_id: userData.userId || 'USR_' + Date.now(),
      name: userData.name,
      email: userData.email,
      reg_number: userData.reg_number || '',
      department: userData.department || '',
      user_type: userData.user_type || userData.role || 'student',
      phone: userData.phone || '',
      status: isFull ? 'waitlist' : 'confirmed',
      waitlist_position: isFull ? (Number(event.waitlist_count || 0) + 1) : 0,
      attended: false,
      attended_at: null,
      certificate_issued: false,
      certificate_id: null,
      preferences: {
        email: preferences.email !== false,
        whatsapp: !!preferences.whatsapp,
        sms: !!preferences.sms
      },
      registration_date: new Date().toISOString()
    };

    if (isFull) {
      update('events', 'id', eventId, { waitlist_count: Number(event.waitlist_count || 0) + 1 });
    } else {
      update('events', 'id', eventId, { registered_count: currentCount + 1 });
    }

    insert('registrations', newReg);

    // Create Notification
    insertNotification({
      user_id: userData.userId || userData.email,
      title: isFull ? 'Added to Event Waitlist' : 'Event Registration Confirmed!',
      message: isFull
        ? `You are on the waitlist (Position #${newReg.waitlist_position}) for "${event.title}".`
        : `Ticket confirmed for "${event.title}" on ${event.date}. Ticket ID: ${ticketId}.`,
      type: 'registration',
      link: `profile.html`
    });

    return {
      ok: true,
      waitlist: isFull,
      ticket: newReg,
      msg: isFull
        ? `Event is at full capacity! You have been placed on the waitlist at position #${newReg.waitlist_position}.`
        : `Registration successful! Your pass is ready.`
    };
  }

  /* ───────── QR CODE ATTENDANCE CHECK-IN ENGINE ───────── */
  function markAttendanceByTicket(ticketOrRegId, scannedBy = 'Organizer') {
    const cleanId = (ticketOrRegId || '').trim();
    const registrations = getAll('registrations');
    const idx = registrations.findIndex(r =>
      r.ticket_id === cleanId || r.id === cleanId || (r.reg_number && r.reg_number.toLowerCase() === cleanId.toLowerCase())
    );

    if (idx === -1) {
      return { ok: false, msg: `Ticket ID "${cleanId}" not found in EVENTS records.` };
    }

    const reg = registrations[idx];
    if (reg.attended) {
      return {
        ok: false,
        alreadyAttended: true,
        participant: reg,
        msg: `Already Checked-In! Attendance was recorded at ${new Date(reg.attended_at).toLocaleTimeString()}.`
      };
    }

    // Auto-generate certificate for attended participant
    const certId = 'CC-CERT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const certRecord = {
      certificate_id: certId,
      ticket_id: reg.ticket_id,
      event_id: reg.event_id,
      event_title: reg.event_title,
      recipient_name: reg.name,
      reg_number: reg.reg_number,
      recipient_email: reg.email,
      issue_date: new Date().toISOString().slice(0, 10),
      issuer_name: 'EVENTS Academic Council',
      institution: CampusConfig.get('institutionName'),
      verified: true
    };
    insert('certificates', certRecord);

    reg.attended = true;
    reg.attended_at = new Date().toISOString();
    reg.scanned_by = scannedBy;
    reg.certificate_issued = true;
    reg.certificate_id = certId;
    registrations[idx] = reg;
    localStorage.setItem(key('registrations'), JSON.stringify(registrations));

    logActivity(scannedBy, 'QR Attendance Marked', `Checked-in ${reg.name} for ${reg.event_title}`);

    // Notify user
    insertNotification({
      user_id: reg.user_id,
      title: 'Attendance Confirmed & Certificate Ready!',
      message: `Your attendance for "${reg.event_title}" is confirmed. Your certificate is available in your profile.`,
      type: 'certificate',
      link: 'profile.html#certificates'
    });

    return {
      ok: true,
      participant: reg,
      certificate: certRecord,
      msg: `Verified! Attendance confirmed for ${reg.name}.`
    };
  }

  /* ───────── FAVORITES / WISHLIST ───────── */
  function toggleFavorite(userId, eventId) {
    let favs = getAll('favorites');
    const existingIdx = favs.findIndex(f => f.user_id === userId && f.event_id === eventId);
    if (existingIdx !== -1) {
      favs.splice(existingIdx, 1);
      localStorage.setItem(key('favorites'), JSON.stringify(favs));
      return false; // Removed
    } else {
      favs.push({ user_id: userId, event_id: eventId });
      localStorage.setItem(key('favorites'), JSON.stringify(favs));
      return true; // Added
    }
  }

  function isFavorite(userId, eventId) {
    return getAll('favorites').some(f => f.user_id === userId && f.event_id === eventId);
  }

  /* ───────── NOTIFICATIONS ───────── */
  function insertNotification(notif) {
    const list = getAll('notifications');
    list.unshift({
      id: 'NTF_' + Date.now() + Math.floor(Math.random() * 100),
      user_id: notif.user_id || 'all',
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      link: notif.link || 'events.html',
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem(key('notifications'), JSON.stringify(list.slice(0, 50)));
  }

  function markNotificationsRead(userId) {
    const list = getAll('notifications');
    list.forEach(n => {
      if (n.user_id === 'all' || n.user_id === userId) {
        n.read = true;
      }
    });
    localStorage.setItem(key('notifications'), JSON.stringify(list));
  }

  /* ───────── CSV EXPORT HELPER ───────── */
  function toCSV(dataArray) {
    if (!dataArray || !dataArray.length) return '';
    const headers = Object.keys(dataArray[0]);
    const rows = dataArray.map(row =>
      headers.map(h => {
        const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',')
    );
    return [headers.join(','), ...rows].join('\r\n');
  }

  function downloadCSV(filename, dataArray) {
    const csvStr = toCSV(dataArray);
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /* ───────── REAL ANALYTICS CALCULATOR ───────── */
  function getAnalytics() {
    const events = getAll('events');
    const registrations = getAll('registrations');
    const users = (Auth && Auth.getAllUsers ? Auth.getAllUsers() : getAll('users'));

    const totalEvents = events.length;
    const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
    const completedEvents = events.filter(e => e.status === 'completed').length;
    const pendingApprovals = events.filter(e => e.approval === 'pending').length;

    const totalRegistrations = registrations.length;
    const attendedCount = registrations.filter(r => r.attended).length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((attendedCount / totalRegistrations) * 100) : 0;

    const studentsCount = users.filter(u => u.role === 'student' || u.user_type === 'student').length;
    const facultyCount = users.filter(u => u.role === 'faculty' || u.user_type === 'faculty').length;
    const companiesCount = users.filter(u => u.role === 'company' || u.user_type === 'company').length;

    // Category Distribution
    const catCounts = {};
    events.forEach(e => {
      catCounts[e.category] = (catCounts[e.category] || 0) + 1;
    });

    // Department Distribution
    const deptCounts = {};
    registrations.forEach(r => {
      if (r.department) {
        deptCounts[r.department] = (deptCounts[r.department] || 0) + 1;
      }
    });

    return {
      totalEvents,
      upcomingEvents,
      completedEvents,
      pendingApprovals,
      totalRegistrations,
      attendedCount,
      attendanceRate,
      studentsCount,
      facultyCount,
      companiesCount,
      catCounts,
      deptCounts
    };
  }

  return {
    init,
    getAll,
    getById,
    getWhere,
    insert,
    update,
    remove,
    registerForEvent,
    markAttendanceByTicket,
    toggleFavorite,
    isFavorite,
    insertNotification,
    markNotificationsRead,
    toCSV,
    downloadCSV,
    getAnalytics,
    logActivity
  };
})();

window.DB = DB;
