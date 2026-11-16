// Scratch test for Faculty, Company, and Admin profile updates
const fs = require('fs');
const path = require('path');
const http = require('http');

// Setup mock browser environment
const localStorageData = {};
global.localStorage = {
  getItem: (k) => localStorageData[k] || null,
  setItem: (k, v) => { localStorageData[k] = String(v); },
  removeItem: (k) => { delete localStorageData[k]; },
  clear: () => { Object.keys(localStorageData).forEach(k => delete localStorageData[k]); }
};
global.sessionStorage = {
  getItem: (k) => localStorageData[k] || null,
  setItem: (k, v) => { localStorageData[k] = String(v); },
  removeItem: (k) => { delete localStorageData[k]; },
  clear: () => {}
};
global.window = {
  location: { origin: 'http://localhost:3000', pathname: '/profile.html' },
  localStorage: global.localStorage,
  sessionStorage: global.sessionStorage
};
global.document = {
  addEventListener: () => {}
};
global.fetch = async (url, opts) => {
  return { ok: true, json: async () => ({ ok: true, session: {} }) };
};

// Require Auth
require('../js/auth.js');
const Auth = global.window.Auth;

async function runTests() {
  console.log('--- Starting Profile Update Tests ---');

  // Test 1: Faculty Profile Update
  console.log('\n[1] Testing Faculty Profile Update...');
  const facultyLogin = await Auth.loginUser('ananya.sen@events.edu', 'Password@123');
  console.log('Faculty login result:', facultyLogin.ok, facultyLogin.user?.role);
  if (!facultyLogin.ok) throw new Error('Faculty login failed: ' + facultyLogin.msg);

  const facultyUpdates = {
    name: 'Prof. Dr. Ananya Sen',
    designation: 'Senior Professor & Dean of Research',
    department: 'Artificial Intelligence & Data Science',
    phone: '+91 98765 99991',
    office: 'Tech Block C, Cabin 401',
    specialization: 'Generative AI & Autonomous Agents',
    bio: 'Leading university research into agentic systems.'
  };

  const facRes = await Auth.updateProfile(facultyUpdates);
  console.log('Faculty updateProfile result:', facRes.ok, facRes.session.designation);
  if (!facRes.ok) throw new Error('Faculty updateProfile failed');
  if (facRes.session.designation !== facultyUpdates.designation) throw new Error('Designation mismatch');
  if (facRes.session.office !== facultyUpdates.office) throw new Error('Office mismatch');
  if (facRes.session.specialization !== facultyUpdates.specialization) throw new Error('Specialization mismatch');

  // Test 2: Company Profile Update
  console.log('\n[2] Testing Company Profile Update...');
  const compLogin = await Auth.loginUser('connect@techcorp.io', 'Password@123');
  console.log('Company login result:', compLogin.ok, compLogin.user?.role);
  if (!compLogin.ok) throw new Error('Company login failed: ' + compLogin.msg);

  const companyUpdates = {
    name: 'TechCorp Global Solutions Inc.',
    company_name: 'TechCorp Global Solutions Inc.',
    contact_person: 'Vikram Aditya Sharma',
    phone: '+91 98765 88882',
    industry: 'Cloud Enterprise & Artificial Intelligence',
    website: 'https://global.techcorp.io',
    location: 'Bangalore & Hyderabad Campus Centers',
    bio: 'Strategic recruitment partner hiring top engineering graduates.'
  };

  const compRes = await Auth.updateProfile(companyUpdates);
  console.log('Company updateProfile result:', compRes.ok, compRes.session.company_name);
  if (!compRes.ok) throw new Error('Company updateProfile failed');
  if (compRes.session.company_name !== companyUpdates.company_name) throw new Error('Company name mismatch');
  if (compRes.session.contact_person !== companyUpdates.contact_person) throw new Error('Contact person mismatch');
  if (compRes.session.website !== companyUpdates.website) throw new Error('Website mismatch');
  if (compRes.session.location !== companyUpdates.location) throw new Error('Location mismatch');

  // Test 3: Admin Profile Update
  console.log('\n[3] Testing Admin Profile Update...');
  const adminLogin = await Auth.loginUser('admin@events.edu', 'Password@123');
  console.log('Admin login result:', adminLogin.ok, adminLogin.user?.role);
  if (!adminLogin.ok) throw new Error('Admin login failed: ' + adminLogin.msg);

  const adminUpdates = {
    name: 'Dr. S. K. Narayanan (Chancellor Nominee)',
    designation: 'Director of University Operations & Student Welfare',
    department: 'Central Administration Directorate',
    phone: '+91 98765 77773',
    office: 'Vice-Chancellor Secretariat, Wing A',
    bio: 'Overseeing all university event protocols and student activities.'
  };

  const adminRes = await Auth.updateProfile(adminUpdates);
  console.log('Admin updateProfile result:', adminRes.ok, adminRes.session.designation);
  if (!adminRes.ok) throw new Error('Admin updateProfile failed');
  if (adminRes.session.designation !== adminUpdates.designation) throw new Error('Admin designation mismatch');
  if (adminRes.session.office !== adminUpdates.office) throw new Error('Admin office mismatch');
  if (adminRes.session.department !== adminUpdates.department) throw new Error('Admin department mismatch');

  console.log('\n--- ALL CLIENT PROFILE UPDATE TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
