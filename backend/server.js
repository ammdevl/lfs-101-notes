/**
 * server.js
 *
 * Main entry point for the Linux LMS backend.
 *   – Express serves the static frontend from ../frontend/public
 *
 * Progress is stored client-side in cookies.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

// ---------------------------------------------------------------------------
// Express setup
// ---------------------------------------------------------------------------
const app = express();
const server = http.createServer(app);

// Security headers (CSP, X-Frame-Options, HSTS, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://d36ai2hkxl16us.cloudfront.net", "data:"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS — restrict to same origin
app.use(cors({ origin: false }));
app.use(express.json({ limit: '16kb' }));

// Serve the frontend
const publicDir = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(publicDir));

// Serve module HTML fragments
const modulesDir = path.join(__dirname, '..', 'frontend', 'modules');
app.use('/modules', express.static(modulesDir));

// Serve source images
const srcDir = path.join(__dirname, '..', 'src');
app.use('/src', express.static(srcDir));

// Fallback – serve index.html for SPA-style routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  🐧 Introduction to Linux - LFS101 Notes`);
  console.log(`  Running at http://localhost:${PORT}\n`);
});
