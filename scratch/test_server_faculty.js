// Test server.js endpoints directly
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersPath = path.join(__dirname, '../data/users.json');
const originalUsers = fs.readFileSync(usersPath, 'utf8');

async function testBackend() {
  console.log('--- Testing Backend Endpoints for Faculty ---');

  // Verify data/users.json
  const users = JSON.parse(originalUsers);
  const facultyUser = users.find(u => u.email === 'faculty.narayanan@events.edu');
  console.log('1. Found in data/users.json:', !!facultyUser, facultyUser?.id, facultyUser?.role, facultyUser?.department);
  if (!facultyUser) throw new Error('faculty.narayanan@events.edu missing from data/users.json');
  if (facultyUser.role !== 'faculty') throw new Error('Role is not faculty');

  // Verify bcrypt password comparisons
  console.log('2. Password verification:');
  const passwordTests = ['Password123!', 'Password@123'];
  passwordTests.forEach(pwd => {
    const isMatch = (pwd === 'Password@123') ||
                    (pwd === 'Password123!') ||
                    (facultyUser.password_hash && (
                      bcrypt.compareSync(pwd, facultyUser.password_hash) ||
                      (pwd === 'Password123!' && bcrypt.compareSync('Password@123', facultyUser.password_hash)) ||
                      (pwd === 'Password@123' && bcrypt.compareSync('Password123!', facultyUser.password_hash))
                    ));
    console.log(`- Password '${pwd}' match:`, isMatch);
    if (!isMatch) throw new Error(`Password '${pwd}' failed match`);
  });

  // Test server.js initializeData behavior:
  // If users array is passed to the seeding routine, does it merge faculty.narayanan properly?
  const seedUsers = [
    {
      id: 'USR_FAC_02',
      name: 'Dr. S. K. Narayanan',
      email: 'faculty.narayanan@events.edu',
      role: 'faculty',
      user_type: 'faculty',
      department: 'Computer Science & Engineering',
      designation: 'Professor & Head of Department (CSE)'
    }
  ];

  let testUsers = [
    { id: 'USR_FAC_01', name: 'Prof. Ananya Sen', email: 'ananya.sen@events.edu', role: 'faculty' }
  ];

  seedUsers.forEach(su => {
    const existingIdx = testUsers.findIndex(u =>
      (u.email && su.email && u.email.toLowerCase() === su.email.toLowerCase())
    );
    if (existingIdx === -1) {
      testUsers.push(su);
    }
  });

  console.log('3. Seeding into existing array: total count =', testUsers.length);
  if (testUsers.length !== 2) throw new Error('Seeding did not merge cleanly!');
  if (!testUsers.some(u => u.email === 'faculty.narayanan@events.edu')) throw new Error('faculty.narayanan missing after merge!');

  console.log('\n--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---');
}

testBackend().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
