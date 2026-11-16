const express = require('express');
const cors = require('cors');

// Test CORS headers with the exact options in server.js
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
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie', 'Date'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Check origin matching
const testOrigins = [
  'https://events-nu-blond.vercel.app',
  'http://localhost:3000',
  'https://events-git-main-user.vercel.app',
  'http://127.0.0.1:5500'
];

testOrigins.forEach(orig => {
  corsOptions.origin(orig, (err, allow) => {
    console.log(`Origin '${orig}' allowed:`, allow);
    if (!allow) throw new Error(`Origin '${orig}' rejected!`);
  });
});

console.log('All CORS origin tests passed!');
