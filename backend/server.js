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

// Force production mode to suppress Express verbose errors
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';

// Security headers (CSP, X-Frame-Options, HSTS, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://d36ai2hkxl16us.cloudfront.net"],
      connectSrc: ["'self'"],
    },
  },
}));

// CORS — restrict to same origin
app.use(cors({ origin: false }));
app.use(express.json({ limit: '16kb' }));

// Static file options — hardened
const staticOpts = { dotfiles: 'deny', index: false };

// Serve the frontend
const publicDir = path.join(__dirname, '..', 'frontend', 'public');
app.use(express.static(publicDir, staticOpts));

// Serve module HTML fragments
const modulesDir = path.join(__dirname, '..', 'frontend', 'modules');
app.use('/modules', express.static(modulesDir, staticOpts));

// Serve source images
const srcDir = path.join(__dirname, '..', 'src');
app.use('/src', express.static(srcDir, { ...staticOpts, maxAge: '1d' }));

// Fallback – serve index.html for SPA-style routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handler — prevents stack trace leakage
app.use((err, _req, res, _next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  🐧 Introduction to Linux - LFS101 Notes`);
  console.log(`  Running at http://localhost:${PORT}\n`);
});
