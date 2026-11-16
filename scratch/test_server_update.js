// Test server backend /api/auth/update-profile endpoint directly
const fs = require('fs');
const path = require('path');

// Backup users.json and companies.json
const usersPath = path.join(__dirname, '../data/users.json');
const companiesPath = path.join(__dirname, '../data/companies.json');

const originalUsers = fs.readFileSync(usersPath, 'utf8');
const originalCompanies = fs.readFileSync(companiesPath, 'utf8');

async function testServerEndpoint() {
  try {
    // Start server or import server
    // To test cleanly without port conflicts, test the handler logic or spin up the app on an ephemeral port
    const express = require('express');
    const app = express();
    app.use(express.json());

    // We can test by calling server's route handler directly or testing via http
    // Let's test the endpoint logic with a mock request and response
    const users = JSON.parse(originalUsers);
    const facultyUser = users.find(u => u.role === 'faculty');
    const compUser = users.find(u => u.role === 'company');
    const adminUser = users.find(u => u.role === 'admin');

    console.log('Testing with real user IDs:');
    console.log('Faculty:', facultyUser.id, facultyUser.email);
    console.log('Company:', compUser.id, compUser.email);
    console.log('Admin:', adminUser.id, adminUser.email);

    // Require server without starting app.listen if we can, or start server on unused port
    process.env.PORT = '3999';
    const serverModule = require('../server.js');

    // Give it 500ms to start on 3999
    await new Promise(r => setTimeout(r, 600));

    const http = require('http');

    function makePost(endpoint, data) {
      return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const req = http.request({
          hostname: '127.0.0.1',
          port: 3999,
          path: endpoint,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, data: JSON.parse(body) });
            } catch (e) {
              resolve({ statusCode: res.statusCode, body });
            }
          });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
      });
    }

    console.log('\n[1] Testing POST /api/auth/update-profile for Faculty...');
    const facRes = await makePost('/api/auth/update-profile', {
      userId: facultyUser.id,
      email: facultyUser.email,
      name: 'Prof. Ananya Sen, Ph.D.',
      designation: 'Distinguished Professor',
      department: 'Computer Science & Engineering',
      phone: '+91 98765 11111',
      office: 'Room 305, Tech Complex',
      specialization: 'Quantum Computing & Distributed Systems'
    });
    console.log('Faculty response:', facRes.statusCode, facRes.data?.ok, facRes.data?.session?.designation);
    if (!facRes.data?.ok) throw new Error('Faculty backend update failed');

    console.log('\n[2] Testing POST /api/auth/update-profile for Company...');
    const compRes = await makePost('/api/auth/update-profile', {
      userId: compUser.id,
      email: compUser.email,
      company_name: 'TechCorp Solutions Worldwide',
      contact_person: 'Priya Sharma',
      phone: '+91 98765 22222',
      industry: 'Software & Enterprise Cloud',
      website: 'https://worldwide.techcorp.io',
      location: 'Bangalore, India'
    });
    console.log('Company response:', compRes.statusCode, compRes.data?.ok, compRes.data?.session?.company_name);
    if (!compRes.data?.ok) throw new Error('Company backend update failed');

    // Check companies.json synchronization
    const updatedCompanies = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));
    const matchedComp = updatedCompanies.find(c => c.id === compUser.id || c.email === compUser.email);
    console.log('Companies.json synchronized name:', matchedComp?.name, 'contact:', matchedComp?.contact_person);
    if (matchedComp?.name !== 'TechCorp Solutions Worldwide') throw new Error('companies.json was not updated');

    console.log('\n[3] Testing POST /api/auth/update-profile for Admin...');
    const adminRes = await makePost('/api/auth/update-profile', {
      userId: adminUser.id,
      email: adminUser.email,
      name: 'Dr. S. K. Narayanan',
      designation: 'Dean of Academic Affairs & Registrar',
      department: 'Directorate of Student Affairs',
      phone: '+91 98765 33333',
      office: 'Main Administrative Complex 101'
    });
    console.log('Admin response:', adminRes.statusCode, adminRes.data?.ok, adminRes.data?.session?.designation);
    if (!adminRes.data?.ok) throw new Error('Admin backend update failed');

    console.log('\n--- ALL BACKEND PROFILE UPDATE ENDPOINTS VERIFIED SUCCESSFULLY! ---');
  } finally {
    // Restore original JSON data
    fs.writeFileSync(usersPath, originalUsers);
    fs.writeFileSync(companiesPath, originalCompanies);
    console.log('Restored original data files.');
    process.exit(0);
  }
}

testServerEndpoint().catch(err => {
  console.error('Server test error:', err);
  fs.writeFileSync(usersPath, originalUsers);
  fs.writeFileSync(companiesPath, originalCompanies);
  process.exit(1);
});
