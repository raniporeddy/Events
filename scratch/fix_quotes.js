const fs = require('fs');
const files = [
  'admin/attendance-reports.html',
  'admin/dashboard.html',
  'admin/manage-events.html',
  'admin/system-settings.html',
  'admin/users.html',
  'auth.html',
  'company/dashboard.html',
  'company/post-event.html',
  'create-event.html',
  'event-details.html',
  'faculty/attendance-scanner.html',
  'faculty/dashboard.html',
  'feedback.html',
  'notifications.html',
  'participants.html',
  'past-events.html',
  'profile.html',
  'register.html'
];
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('crossorigin="anonymous""')) {
    // Note: the line usually is: crossorigin="anonymous"">
    const fixed = content.replace(/crossorigin="anonymous"">/g, 'crossorigin="anonymous">')
                         .replace(/crossorigin="anonymous""/g, 'crossorigin="anonymous">');
    fs.writeFileSync(f, fixed, 'utf8');
    console.log('Fixed', f);
  }
});
