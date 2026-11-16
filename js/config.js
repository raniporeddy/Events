/**
 * EVENTS — Global Configuration Module
 * Provides configurable branding, roles, event categories with square imagery, and API endpoints.
 */

const CampusConfig = (() => {
  const CONFIG = {
    // Brand Identity
    appName: 'EVENTS',
    shortName: 'EVENTS',
    tagline: 'Discover. Participate. Connect.',
    institutionName: 'SCSVMV University',
    institutionFullName: 'Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya (SCSVMV)',
    portalSubtext: 'Smart Campus & Industry Event Management Platform',
    supportEmail: 'events@kanchiuniv.ac.in',
    supportPhone: '+91 (044) 2726-4300',
    address: 'Enathur, Kanchipuram, Tamil Nadu 631561',
    logoUrl: 'assets/images/logo.png',

    // API Base URL
    apiBase: window.location.origin.includes('http') ? window.location.origin + '/api' : 'http://localhost:3000/api',

    // User Roles
    roles: {
      STUDENT: 'student',
      FACULTY: 'faculty',
      COMPANY: 'company',
      ADMIN: 'admin',
    },

    // 12 Standard Categories with Dedicated Professional Square Images & Descriptions
    categories: [
      {
        id: 'technical-symposium',
        name: 'Technical Symposium',
        icon: 'fa-microchip',
        color: '#4169E1',
        description: 'Cutting-edge technical papers, coding symposiums, and engineering design contests.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'workshops',
        name: 'Workshops',
        icon: 'fa-laptop-code',
        color: '#7957D5',
        description: 'Hands-on practical development bootcamps, hardware prototyping, and software labs.',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'hackathons',
        name: 'Hackathons',
        icon: 'fa-code-branch',
        color: '#F59E0B',
        description: 'Intense 24-48hr developer hackathons building real-world AI, Web, and Cloud solutions.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'conferences',
        name: 'Conferences',
        icon: 'fa-users',
        color: '#101B3F',
        description: 'National and international research summits with keynote industry pioneers.',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'cultural-events',
        name: 'Cultural Events',
        icon: 'fa-masks-theater',
        color: '#8B5CF6',
        description: 'Vibrant university festivals, music performances, theater, fine arts, and dance.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'sports-events',
        name: 'Sports Events',
        icon: 'fa-trophy',
        color: '#EF4444',
        description: 'Inter-collegiate athletic tournaments, track and field, football, cricket, and esports.',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'industry-connect',
        name: 'Industry Connect',
        icon: 'fa-building',
        color: '#6366F1',
        description: 'Direct networking forums between corporate leaders, recruiters, and university students.',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'placement-activities',
        name: 'Placement Activities',
        icon: 'fa-briefcase',
        color: '#10B981',
        description: 'On-campus recruitment drives, technical assessments, mock interviews, and GD prep.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'internship-programs',
        name: 'Internship Programs',
        icon: 'fa-user-graduate',
        color: '#EC4899',
        description: 'Summer and semester internship awareness, project fellowships, and corporate mentorship.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'guest-lectures',
        name: 'Guest Lectures',
        icon: 'fa-microphone-alt',
        color: '#14B8A6',
        description: 'Inspiring talks by distinguished scientists, tech founders, and visiting professors.',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'seminars',
        name: 'Seminars',
        icon: 'fa-chalkboard-teacher',
        color: '#0EA5E9',
        description: 'In-depth academic sessions, domain research discussions, and technology reviews.',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80'
      },
      {
        id: 'innovation-entrepreneurship',
        name: 'Innovation and Entrepreneurship',
        icon: 'fa-lightbulb',
        color: '#D97706',
        description: 'Startup pitch battles, incubator showcases, patent workshops, and venture bootcamps.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80'
      }
    ],

    // Academic & Training Departments
    departments: [
      'Computer Science & Engineering',
      'Artificial Intelligence & Data Science',
      'Electronics & Communication Engineering',
      'Electrical & Electronics Engineering',
      'Mechanical Engineering',
      'Information Technology',
      'Management & Business Administration',
      'Science & Humanities',
      'Training & Placement Cell',
      'University Cultural Council',
      'Sports & Physical Education'
    ],

    // SaaS Color Palette
    theme: {
      primary: '#101B3F',      // Deep Navy
      secondary: '#4169E1',    // Electric Blue
      accent: '#7957D5',       // Violet Accent
      background: '#F5F7FB',   // Light Grey
      cardBg: '#FFFFFF',
      textMain: '#101B3F',
      textMuted: '#64748B',
      border: '#E2E8F0',
    }
  };

  return {
    get: (key) => CONFIG[key],
    getAll: () => ({ ...CONFIG }),
    getCategory: (nameOrId) =>
      CONFIG.categories.find(c =>
        c.id.toLowerCase() === (nameOrId || '').toLowerCase() ||
        c.name.toLowerCase() === (nameOrId || '').toLowerCase() ||
        (nameOrId && nameOrId.toLowerCase().includes(c.id.toLowerCase()))
      ) || CONFIG.categories[0],
    BRANDING: {
      appName: CONFIG.appName,
      tagline: CONFIG.tagline,
      institutionName: CONFIG.institutionName,
      supportEmail: CONFIG.supportEmail
    },
    EVENT_CATEGORIES: CONFIG.categories.map(c => c.name),
    DEPARTMENTS: CONFIG.departments
  };
})();

// Attach to global window
window.CampusConfig = CampusConfig;
window.CONFIG = {
  BRANDING: CampusConfig.BRANDING,
  EVENT_CATEGORIES: CampusConfig.EVENT_CATEGORIES,
  DEPARTMENTS: CampusConfig.DEPARTMENTS,
  THEME: CampusConfig.get('theme')
};
