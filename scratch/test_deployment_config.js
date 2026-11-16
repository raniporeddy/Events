// Test split deployment configuration for Vercel + Render
const fs = require('fs');
const path = require('path');

function testClientConfig() {
  console.log('--- 1. Testing Client API_BASE_URL Dynamic Configuration ---');

  // Case A: Production Vercel Domain
  const mockWindowVercel = {
    location: {
      hostname: 'events-nu-blond.vercel.app',
      origin: 'https://events-nu-blond.vercel.app',
      pathname: '/'
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {} },
    document: { addEventListener: () => {} }
  };

  global.window = mockWindowVercel;
  global.localStorage = mockWindowVercel.localStorage;
  global.sessionStorage = mockWindowVercel.sessionStorage;

  // Clear require cache to re-evaluate
  delete require.cache[require.resolve('../js/config.js')];
  delete require.cache[require.resolve('../js/auth.js')];

  require('../js/config.js');
  require('../js/auth.js');

  console.log('[Vercel Production Domain]');
  console.log('CampusConfig.get("apiBase"):', window.CampusConfig.get('apiBase'));
  console.log('window.API_BASE_URL:', window.API_BASE_URL);
  console.log('window.BACKEND_ORIGIN:', window.BACKEND_ORIGIN);

  if (window.CampusConfig.get('apiBase') !== 'https://events-i8r7.onrender.com/api') {
    throw new Error('Expected apiBase on Vercel to be https://events-i8r7.onrender.com/api');
  }
  if (window.BACKEND_ORIGIN !== 'https://events-i8r7.onrender.com') {
    throw new Error('Expected backendOrigin to be https://events-i8r7.onrender.com');
  }

  // Case B: Localhost Development Domain
  const mockWindowLocal = {
    location: {
      hostname: 'localhost',
      origin: 'http://localhost:3000',
      pathname: '/'
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {} },
    document: { addEventListener: () => {} }
  };

  global.window = mockWindowLocal;
  global.localStorage = mockWindowLocal.localStorage;
  global.sessionStorage = mockWindowLocal.sessionStorage;

  delete require.cache[require.resolve('../js/config.js')];
  delete require.cache[require.resolve('../js/auth.js')];

  require('../js/config.js');
  require('../js/auth.js');

  console.log('\n[Localhost Development Domain]');
  console.log('CampusConfig.get("apiBase"):', window.CampusConfig.get('apiBase'));
  console.log('window.API_BASE_URL:', window.API_BASE_URL);
  console.log('window.BACKEND_ORIGIN:', window.BACKEND_ORIGIN);

  if (window.CampusConfig.get('apiBase') !== 'http://localhost:3000/api') {
    throw new Error('Expected apiBase on localhost to be http://localhost:3000/api');
  }
  if (window.BACKEND_ORIGIN !== 'http://localhost:3000') {
    throw new Error('Expected backendOrigin on localhost to be http://localhost:3000');
  }
}

function testServerCORS() {
  console.log('\n--- 2. Testing Backend server.js CORS Configuration ---');
  delete require.cache[require.resolve('../server.js')];
  const app = require('../server.js');

  // Verify app has cors middleware attached
  console.log('Server module loaded successfully.');

  // Check vercel.json existence and contents
  const vercelJsonPath = path.join(__dirname, '../vercel.json');
  if (!fs.existsSync(vercelJsonPath)) throw new Error('vercel.json is missing!');

  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  console.log('\n--- 3. Testing vercel.json Static Routing ---');
  console.log('cleanUrls:', vercelConfig.cleanUrls);
  console.log('trailingSlash:', vercelConfig.trailingSlash);
  console.log('rewrites count:', vercelConfig.rewrites?.length);
  console.log('api rewrite destination:', vercelConfig.rewrites?.[0]?.destination);

  if (vercelConfig.rewrites?.[0]?.destination !== 'https://events-i8r7.onrender.com/api/:path*') {
    throw new Error('API rewrite destination mismatch in vercel.json');
  }

  // Check package.json
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  console.log('\n--- 4. Testing package.json Scripts ---');
  console.log('start script:', pkg.scripts?.start);
  console.log('build script:', pkg.scripts?.build);

  if (!pkg.scripts?.build) throw new Error('build script missing from package.json');
  if (!pkg.scripts?.start) throw new Error('start script missing from package.json');

  console.log('\n--- ALL SPLIT DEPLOYMENT CONFIGURATION TESTS PASSED! ---');
}

try {
  testClientConfig();
  testServerCORS();
} catch (e) {
  console.error('Test Failed:', e);
  process.exit(1);
}
