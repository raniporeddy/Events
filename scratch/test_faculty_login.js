// Comprehensive test for Faculty demo login, registration, and redirect
const fs = require('fs');
const path = require('path');

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
  location: { origin: 'http://localhost:3000', pathname: '/auth.html' },
  localStorage: global.localStorage,
  sessionStorage: global.sessionStorage
};
global.document = {
  addEventListener: () => {}
};
global.fetch = async (url, opts) => {
  // Mock backend response for register and login
  const body = opts && opts.body ? JSON.parse(opts.body) : {};
  if (url.includes('/auth/login') || url.includes('/api/login')) {
    if (body.identifier === 'faculty.narayanan@events.edu') {
      return {
        ok: true,
        json: async () => ({
          ok: true,
          msg: 'Login successful!',
          session: {
            userId: 'USR_FAC_02',
            id: 'USR_FAC_02',
            name: 'Dr. S. K. Narayanan',
            email: 'faculty.narayanan@events.edu',
            role: 'faculty',
            user_type: 'faculty',
            department: 'Computer Science & Engineering',
            designation: 'Professor & Head of Department (CSE)'
          }
        })
      };
    }
  }
  if (url.includes('/auth/register') || url.includes('/api/register')) {
    return {
      ok: true,
      json: async () => ({
        ok: true,
        msg: 'Registration successful!',
        user: { ...body, id: 'USR_NEW_FACULTY_99' }
      })
    };
  }
  return { ok: true, json: async () => ({ ok: true }) };
};

// Test with pre-existing dirty localStorage (which previously caused the collision bug!)
localStorageData['campusconnect_users'] = JSON.stringify([
  {
    id: 'USR_FAC_01',
    name: 'Prof. Ananya Sen',
    email: 'ananya.sen@events.edu',
    role: 'faculty'
  }
]);

// Require Auth
require('../js/auth.js');
const Auth = global.window.Auth;

async function runTests() {
  console.log('--- Starting Faculty Login & Account Synchronization Tests ---');

  // Test 1: Verify faculty.narayanan@events.edu is seeded in localStorage despite pre-existing USR_FAC_01
  console.log('\n[1] Checking seed initialization in localStorage with prior dirty data...');
  const users = Auth.getAllUsers();
  console.log('Total users in localStorage:', users.length);
  const narayanan = users.find(u => u.email === 'faculty.narayanan@events.edu');
  const ananya = users.find(u => u.email === 'ananya.sen@events.edu');

  console.log('Found faculty.narayanan in storage?', !!narayanan, narayanan?.id, narayanan?.department);
  console.log('Found ananya.sen in storage?', !!ananya, ananya?.id);

  if (!narayanan) throw new Error('faculty.narayanan@events.edu was not seeded into localStorage!');
  if (!ananya) throw new Error('ananya.sen@events.edu was deleted or missing!');
  if (narayanan.email === ananya.email) throw new Error('Collision! Email was overwritten.');

  // Test 2: Login with Password123!
  console.log('\n[2] Testing Auth.loginUser with Password123! ...');
  const res1 = await Auth.loginUser('faculty.narayanan@events.edu', 'Password123!');
  console.log('Result with Password123!:', res1.ok, res1.session?.role, res1.session?.name);
  if (!res1.ok) throw new Error('Failed to login with Password123!: ' + res1.msg);
  if (res1.session.role !== 'faculty') throw new Error('Session role is not faculty!');

  // Test 3: Check redirect
  console.log('\n[3] Checking Dashboard Redirect for Faculty role...');
  const redirect = Auth.getDashboardRedirect(res1.session.role);
  console.log('Redirect URL:', redirect);
  if (redirect !== 'faculty/dashboard.html') throw new Error('Incorrect redirect: ' + redirect);

  // Test 4: Login with Password@123
  console.log('\n[4] Testing Auth.loginUser with Password@123 ...');
  const res2 = await Auth.loginUser('faculty.narayanan@events.edu', 'Password@123');
  console.log('Result with Password@123:', res2.ok, res2.session?.role);
  if (!res2.ok) throw new Error('Failed to login with Password@123: ' + res2.msg);

  // Test 5: Register new Faculty account and login immediately
  console.log('\n[5] Testing new Faculty Registration and immediate Login...');
  const newFacultyData = {
    name: 'Prof. R. Vasudevan',
    email: 'vasudevan@events.edu',
    password: 'Password123!',
    role: 'faculty',
    department: 'Artificial Intelligence & Data Science',
    designation: 'Associate Professor',
    phone: '+91 98765 00099'
  };

  const regRes = await Auth.registerUser(newFacultyData);
  console.log('Registration result:', regRes.ok, regRes.session?.role, regRes.session?.email);
  if (!regRes.ok) throw new Error('Faculty registration failed: ' + regRes.msg);
  if (regRes.session.role !== 'faculty') throw new Error('Registered user role is not faculty');

  const regRedirect = Auth.getDashboardRedirect(regRes.session.role);
  console.log('New Faculty Redirect:', regRedirect);
  if (regRedirect !== 'faculty/dashboard.html') throw new Error('New faculty redirect incorrect');

  // Log in as new faculty
  const newLogin = await Auth.loginUser('vasudevan@events.edu', 'Password123!');
  console.log('New Faculty login result:', newLogin.ok, newLogin.session?.name);
  if (!newLogin.ok) throw new Error('New faculty login failed');

  console.log('\n--- ALL FACULTY LOGIN AND REGISTRATION TESTS PASSED! ---');
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
