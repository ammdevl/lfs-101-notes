/**
 * app.js – LFS101 Notes
 * Client-side routing, module loader, progress tracking (cookie-based).
 */

// ---------------------------------------------------------------------------
// Module registry
// ---------------------------------------------------------------------------
const MODULES = [
  { id: 'linux-history',       title: 'Linux History Overview',                   icon: '📜',  desc: 'The origins of Linux, from Unix and Minix to Linus Torvalds\' kernel and the open-source movement.' },
  { id: 'linux-philosophy',    title: 'Linux Philosophy',                         icon: '💡',  desc: 'Core principles: everything is a file, small single-purpose programs, and the power of the command line.' },
  { id: 'linux-families',      title: 'Linux Families & Popular Distros',         icon: '🐧',  desc: 'Major distribution families — Red Hat, Debian, SUSE — and choosing the right one for your needs.' },
  { id: 'linux-basics',        title: 'Linux Basics & System Setup',              icon: '⚙️',  desc: 'Installation, boot process, filesystem hierarchy, and getting started with your first Linux system.' },
  { id: 'gui',                 title: 'Graphical User Interface',                 icon: '🖥️',  desc: 'Desktop environments like GNOME and KDE, window managers, and navigating the Linux GUI.' },
  { id: 'command-line',        title: 'Command Line Operations',                  icon: '⌨️',  desc: 'Essential shell commands, pipes, redirection, and working efficiently in the terminal.' },
  { id: 'documentation',       title: 'Finding Linux Documentation',              icon: '📖',  desc: 'Man pages, info pages, /usr/share/doc, and online resources for help and reference.' },
  { id: 'processes',           title: 'Processes',                                icon: '📊',  desc: 'Process lifecycle, ps, top, signals, background/foreground jobs, and process management.' },
  { id: 'file-operations',     title: 'File Operations',                          icon: '📁',  desc: 'File permissions, ownership, links, and advanced file manipulation with cp, mv, rm, and find.' },
  { id: 'text-editors',        title: 'Text Editors',                             icon: '✏️',  desc: 'Working with vim, nano, and emacs — editing configuration files and writing scripts.' },
  { id: 'user-environment',    title: 'User Environment',                         icon: '👤',  desc: 'Shell variables, environment configuration, aliases, and customizing your login experience.' },
  { id: 'manipulating-text',   title: 'Manipulating Text',                        icon: '🔤',  desc: 'grep, sed, awk, and other text processing tools for searching and transforming data.' },
  { id: 'network-operations',  title: 'Network Operations',                       icon: '🌐',  desc: 'Network configuration, ssh, scp, DNS, firewalls, and troubleshooting connectivity issues.' },
  { id: 'bash-scripting',      title: 'The bash Shell & Basic Scripting',         icon: '🐚',  desc: 'Writing your first scripts — variables, conditionals, loops, and making your work repeatable.' },
  { id: 'bash-advanced',       title: 'More On bash Shell Scripting',             icon: '🧩',  desc: 'Advanced scripting: functions, error handling, regular expressions, and real-world automation.' },
  { id: 'printing',            title: 'Printing',                                 icon: '🖨️',  desc: 'CUPS printing system, printer setup, managing print queues, and generating formatted output.' },
  { id: 'security',            title: 'Local Security Principles',                icon: '🔒',  desc: 'User management, sudo, SELinux, file permissions, and hardening your Linux system.' },
];

// SVG icon paths for modules (replacing emojis for better accessibility and theming)
const MODULE_ICONS = {
  'linux-history':      '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  'linux-philosophy':   '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
  'linux-families':     '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'linux-basics':       '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  'gui':                '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'command-line':       '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  'documentation':      '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  'processes':          '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  'file-operations':    '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  'text-editors':       '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  'user-environment':   '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'manipulating-text':  '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
  'network-operations': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  'bash-scripting':     '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  'bash-advanced':      '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  'printing':           '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  'security':           '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
};

// Home page feature icons (SVG)
const FEATURE_ICONS = {
  'command-line': '<svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="7 8 10 11 7 14"/><line x1="13" y1="14" x2="17" y2="14"/></svg>',
  'file-operations': '<svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
  'network-operations': '<svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  'linux-families': '<svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};

// Quick link icons (SVG)
const QUICK_LINK_ICONS = {
  'course': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  'foundation': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  'kernel': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>',
  'what-is': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  'distro': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>',
  'github': '<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let currentModuleId = 'home';
let progressData = {};

// ---------------------------------------------------------------------------
// Screen reader announcements
// ---------------------------------------------------------------------------
function announce(message) {
  const el = document.getElementById('sr-announcer');
  if (el) {
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = message; });
  }
}

// ---------------------------------------------------------------------------
// Valid module IDs — whitelist for navigate() to prevent XSS
// ---------------------------------------------------------------------------
const VALID_NAV_IDS = new Set(['home', 'modules', ...MODULES.map(m => m.id)]);

// ---------------------------------------------------------------------------
// HTML escaping helper
// ---------------------------------------------------------------------------
function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ---------------------------------------------------------------------------
// Cookie helpers for progress
// ---------------------------------------------------------------------------
const PROGRESS_COOKIE = 'lfs101_progress';
const COOKIE_DAYS = 365;

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax${secure}`;
}

function loadProgressFromCookie() {
  if (!cookiesAccepted()) { progressData = {}; return; }
  const raw = getCookie(PROGRESS_COOKIE);
  if (!raw) { progressData = {}; return; }
  try {
    const parsed = JSON.parse(raw);
    // Schema validation — only accept known module IDs with boolean completed
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      progressData = {};
      return;
    }
    const validIds = new Set(MODULES.map(m => m.id));
    const cleaned = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (validIds.has(key) && val && typeof val === 'object' && typeof val.completed === 'boolean') {
        cleaned[key] = { completed: val.completed, updatedAt: val.updatedAt || null };
      }
    }
    progressData = cleaned;
  } catch {
    progressData = {};
  }
}

function saveProgressToCookie() {
  if (!cookiesAccepted()) return;
  setCookie(PROGRESS_COOKIE, JSON.stringify(progressData), COOKIE_DAYS);
}

// ---------------------------------------------------------------------------
// Dark mode
// ---------------------------------------------------------------------------
function initDarkMode() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    // Default to light mode
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const btn = document.getElementById('btn-theme-toggle');
  if (btn) btn.setAttribute('aria-pressed', next === 'dark');
}

// ---------------------------------------------------------------------------
// Cookie consent
// ---------------------------------------------------------------------------
const COOKIE_CONSENT_KEY = 'lfs101_cookies_accepted';
const CONSENT_MAX_AGE_DAYS = 30;

function getConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
    if (age > CONSENT_MAX_AGE_DAYS) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }
    return data.value;
  } catch {
    // Legacy string value or corrupt data — treat as no consent
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    return null;
  }
}

function cookiesAccepted() {
  return getConsent() === 'accepted';
}

function showCookieBannerIfNeeded() {
  if (!getConsent()) {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('hidden');
  }
}

function setConsent(value) {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    value,
    timestamp: Date.now(),
  }));
}

function acceptCookies() {
  setConsent('accepted');
  loadProgressFromCookie();
  buildCourseSidebar();
  updateProgressUI();
  dismissBanner();
}

function declineCookies() {
  setConsent('declined');
  // Clear any existing progress cookie
  setCookie(PROGRESS_COOKIE, '', -1);
  progressData = {};
  buildCourseSidebar();
  updateProgressUI();
  dismissBanner();
}

function dismissBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) {
    banner.style.animation = 'slideDownBanner .25s ease forwards';
    setTimeout(() => banner.classList.add('hidden'), 250);
  }
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  loadProgressFromCookie();
  buildCourseSidebar();
  bindEvents();
  showCookieBannerIfNeeded();

  // Set initial ARIA state for dark mode toggle
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) themeBtn.setAttribute('aria-pressed', document.documentElement.getAttribute('data-theme') === 'dark');

  const hash = location.hash.slice(1) || 'home';
  navigate(hash);
});

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------
function navigate(moduleId) {
  // Whitelist validation — reject any non-known moduleId to prevent XSS
  if (!VALID_NAV_IDS.has(moduleId)) {
    moduleId = 'home';
  }

  const isHome = moduleId === 'home';
  const isModules = moduleId === 'modules';
  const isModulePage = !isHome && !isModules;

  currentModuleId = moduleId;
  location.hash = moduleId;

  const sidebar = document.getElementById('course-sidebar');
  const actions = document.getElementById('topbar-actions');
  const sidebarToggle = document.getElementById('btn-sidebar-toggle');

  // Show/hide course sidebar (default: open on module pages)
  if (sidebar) {
    if (isModulePage) {
      // On module pages, sidebar is available but off-screen until toggled open
      sidebar.classList.remove('hidden');
      sidebar.classList.remove('open');
    } else {
      sidebar.classList.add('hidden');
      sidebar.classList.remove('open');
      closeSidebar();
    }
  }

  // Show/hide sidebar toggle button (only on module pages)
  if (sidebarToggle) {
    sidebarToggle.style.display = isModulePage ? 'inline-flex' : 'none';
    const isMobile = window.innerWidth <= 768;
    const sidebarOpen = isMobile
      ? sidebar?.classList.contains('open')
      : isModulePage && !sidebar?.classList.contains('hidden');
    sidebarToggle.setAttribute('aria-expanded', sidebarOpen);
  }

  // Toggle topbar brand centering class (only on home/modules pages)
  const topbar = document.getElementById('topbar');
  if (topbar) topbar.classList.toggle('topbar--standalone', !isModulePage);

  // Show/hide topbar actions
  if (actions) actions.style.display = 'flex';

  if (isHome) {
    renderHome();
  } else if (isModules) {
    renderModules();
  } else {
    loadModule(moduleId);
  }

  // Update sidebar active state
  if (isModulePage) updateCourseSidebar(moduleId);

  // Focus management - move focus to content for screen readers
  const contentEl = document.getElementById('content');
  if (contentEl) contentEl.scrollTop = 0;

  // Announce page change for screen readers
  if (isHome) {
    announce('Home page loaded');
  } else if (isModules) {
    announce('Modules page loaded');
  } else {
    const mod = MODULES.find(m => m.id === moduleId);
    if (mod) announce(`${mod.title} loaded`);
  }
}

// ---------------------------------------------------------------------------
// Sidebar toggle
// ---------------------------------------------------------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('course-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const toggle = document.getElementById('btn-sidebar-toggle');
  if (!sidebar) return;

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    const opening = !sidebar.classList.contains('open');
    sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('active', opening);
    if (toggle) toggle.setAttribute('aria-expanded', opening);
  } else {
    sidebar.classList.toggle('hidden');
    if (toggle) toggle.setAttribute('aria-expanded', !sidebar.classList.contains('hidden'));
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('course-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const toggle = document.getElementById('btn-sidebar-toggle');
  if (!sidebar) return;

  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
}

// ---------------------------------------------------------------------------
// Home (landing page)
// ---------------------------------------------------------------------------
function renderHome() {
  const el = document.getElementById('content-inner');
  const completed = Object.values(progressData).filter((p) => p.completed).length;
  const pct = MODULES.length ? Math.round((completed / MODULES.length) * 100) : 0;

  el.innerHTML = `
    <div class="home-hero">
      <div class="home-hero__icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <h1 class="home-hero__title">Introduction to Linux</h1>
      <p class="home-hero__subtitle">LFS101 Notes</p>
      <p class="home-hero__desc">
        Personal study notes from the <strong>"Introduction to Linux" (LFS101)</strong> course by the Linux Foundation.
        Use these notes alongside the official course material to reinforce your learning.
      </p>
      <div class="home-hero__actions">
        <button class="btn btn--primary" data-navigate="modules">Browse Modules</button>
        <button class="btn btn--accent" data-navigate="${MODULES[0].id}">Start Learning
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>

    <div class="home-stats">
      <div class="home-stat">
        <span class="home-stat__value">${MODULES.length}</span>
        <span class="home-stat__label">Modules</span>
      </div>
      <div class="home-stat">
        <span class="home-stat__value">${completed}</span>
        <span class="home-stat__label">Completed</span>
      </div>
      <div class="home-stat home-stat--progress">
        <span class="home-stat__value">${pct}%</span>
        <span class="home-stat__label">Progress</span>
        <div class="progress-bar" style="width:100%;margin-top:var(--space-2);" role="progressbar" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${MODULES.length}" aria-label="Course progress">
          <div class="progress-bar__fill" style="width:${pct}%;"></div>
        </div>
      </div>
    </div>

    ${completed > 0 ? `
      <div class="home-recent-section">
        <h2 class="home-recent-title">Continue Where You Left Off</h2>
        <div class="home-recent">
          ${MODULES.filter(m => progressData[m.id]?.completed).slice(0, 3).map((m) => `
            <div class="card home-recent-card" data-navigate="${m.id}">
              <div class="home-recent-card-inner">
                <span class="home-recent-card-icon">${MODULE_ICONS[m.id] || ''}</span>
                <div>
                  <div class="card__title home-recent-card-title">${m.title}</div>
                  <span class="home-recent-card-status">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Completed
                  </span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- About the course -->
    <div class="home-section">
      <h2 class="home-section__title">About This Course</h2>
      <div class="home-about">
        <p>
          <strong>Introduction to Linux (LFS101)</strong> is a free, self-paced course offered by the
          <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">Linux Foundation</a>.
          It covers everything you need to get started with Linux — from its history and philosophy to
          practical command-line skills, file management, networking, scripting, and security.
        </p>
        <p>
          Whether you're a developer, system administrator, or simply curious about open-source operating
          systems, this course provides a solid foundation. These notes summarize the key concepts from
          each module to help you review and retain what you've learned.
        </p>
      </div>
    </div>

    <!-- What you'll learn -->
    <div class="home-section">
      <h2 class="home-section__title">What You'll Learn</h2>
      <div class="home-features">
        <div class="home-feature">
          <span class="home-feature__icon">${FEATURE_ICONS['command-line']}</span>
          <div>
            <strong>Command Line Mastery</strong>
            <p>Navigate the filesystem, manage processes, and use pipes, redirection, and shell scripting.</p>
          </div>
        </div>
        <div class="home-feature">
          <span class="home-feature__icon">${FEATURE_ICONS['file-operations']}</span>
          <div>
            <strong>File &amp; Process Management</strong>
            <p>Understand permissions, ownership, links, and how Linux manages processes and services.</p>
          </div>
        </div>
        <div class="home-feature">
          <span class="home-feature__icon">${FEATURE_ICONS['network-operations']}</span>
          <div>
            <strong>Networking &amp; Security</strong>
            <p>Configure networks, use SSH, manage firewalls, and apply local security principles.</p>
          </div>
        </div>
        <div class="home-feature">
          <span class="home-feature__icon">${FEATURE_ICONS['linux-families']}</span>
          <div>
            <strong>Linux Ecosystem</strong>
            <p>Explore distributions, desktop environments, package management, and the open-source community.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Who is this for -->
    <div class="home-section">
      <h2 class="home-section__title">Who Is This For?</h2>
      <div class="home-about">
        <ul class="home-list">
          <li><strong>Developers</strong> who want to understand the platform their code runs on.</li>
          <li><strong>System Administrators</strong> building foundational Linux skills.</li>
          <li><strong>Students</strong> studying computer science or IT.</li>
          <li><strong>Anyone</strong> curious about Linux and open-source software.</li>
        </ul>
      </div>
    </div>

    <!-- How to use -->
    <div class="home-section">
      <h2 class="home-section__title">How to Use These Notes</h2>
      <div class="home-about">
        <ol class="home-list home-list--ordered">
          <li>Enroll in the free <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">LFS101 course</a> on the Linux Foundation website.</li>
          <li>Study each module's official material, then review the corresponding notes here.</li>
          <li>Use your own terminal to practice commands as you learn.</li>
          <li>Mark modules as complete to track your progress — saved automatically in your browser.</li>
        </ol>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="home-section">
      <h2 class="home-section__title">Quick Links</h2>
      <div class="home-quick-links">
        <a class="home-quick-link" href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">${QUICK_LINK_ICONS['course']}</span>
          <span class="home-quick-link__text">Official LFS101 Course</span>
        </a>
        <a class="home-quick-link" href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">${QUICK_LINK_ICONS['foundation']}</span>
          <span class="home-quick-link__text">Linux Foundation</span>
        </a>
        <a class="home-quick-link" href="https://www.kernel.org/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">${QUICK_LINK_ICONS['kernel']}</span>
          <span class="home-quick-link__text">Linux Kernel</span>
        </a>
        <a class="home-quick-link" href="https://www.linux.com/what-is-linux/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">${QUICK_LINK_ICONS['what-is']}</span>
          <span class="home-quick-link__text">What is Linux?</span>
        </a>
        <a class="home-quick-link" href="https://distrowatch.com/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">${QUICK_LINK_ICONS['distro']}</span>
          <span class="home-quick-link__text">DistroWatch</span>
        </a>
        <a class="home-quick-link" href="https://github.com/torvalds/linux" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">${QUICK_LINK_ICONS['github']}</span>
          <span class="home-quick-link__text">Linux on GitHub</span>
        </a>
      </div>
    </div>

    <div class="attribution home-attribution">
      These notes are based on the original <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
        <strong>"Introduction to Linux" (LFS101)</strong></a> course by the Linux Foundation.
    </div>
  `;

  updateProgressUI();
}

// ---------------------------------------------------------------------------
// Modules page
// ---------------------------------------------------------------------------
function renderModules() {
  const el = document.getElementById('content-inner');
  const completed = Object.values(progressData).filter((p) => p.completed).length;
  const pct = MODULES.length ? Math.round((completed / MODULES.length) * 100) : 0;

  el.innerHTML = `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="#home" data-navigate="home">Home</a>
      <span class="breadcrumb__sep" aria-hidden="true">/</span>
      <span class="breadcrumb__current" aria-current="page">Modules</span>
    </nav>

    <h1>Introduction to Linux <span class="modules-subtitle">LFS101 Notes</span></h1>
    <p class="modules-desc">
      Personal study notes from the <strong>"Introduction to Linux" (LFS101)</strong> course by the Linux Foundation.
      Use these notes alongside the official course material.
    </p>

    <div class="modules-progress-card">
      <div class="modules-progress-header">
        <span class="modules-progress-label">Your Progress</span>
        <span class="modules-progress-value">${completed}/${MODULES.length} modules (${pct}%)</span>
      </div>
      <div class="progress-bar" style="width:100%;height:8px;" role="progressbar" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${MODULES.length}" aria-label="Course progress">
        <div class="progress-bar__fill" style="width:${pct}%;"></div>
      </div>
    </div>

    <div class="dashboard-grid">
      ${MODULES.map((m, i) => {
        const done = progressData[m.id]?.completed;
        return `
          <div class="card" data-navigate="${m.id}" role="link" tabindex="0" aria-label="${m.title}${done ? ' (completed)' : ''}">
            <div class="module-card-header">
              <span class="module-card-icon" aria-hidden="true">${MODULE_ICONS[m.id] || ''}</span>
              <span class="module-card-num">Module ${i + 1}</span>
              ${done ? '<span class="module-card-done"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Done</span>' : ''}
            </div>
            <div class="card__title">${m.title}</div>
            <div class="card__desc">${m.desc || ''}</div>
          </div>`;
      }).join('')}
    </div>

    <div class="attribution home-attribution">
      These notes are based on the original <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
        <strong>"Introduction to Linux" (LFS101)</strong></a> course by the Linux Foundation.
    </div>
  `;

  updateProgressUI();
}

// ---------------------------------------------------------------------------
// Module loader
// ---------------------------------------------------------------------------
async function loadModule(moduleId) {
  // Defense-in-depth: validate moduleId even though navigate() already does
  if (!VALID_NAV_IDS.has(moduleId) || moduleId === 'home' || moduleId === 'modules') {
    navigate('home');
    return;
  }

  const el = document.getElementById('content-inner');
  el.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Loading module…</span></div>';

  try {
    const resp = await fetch(`/modules/${moduleId}.html`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const rawHtml = await resp.text();
    const html = fixConsecutiveOl(rawHtml);

    const isComplete = progressData[moduleId]?.completed;
    const mod = MODULES.find(m => m.id === moduleId);

    el.innerHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="#home" data-navigate="home">Home</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <a href="#modules" data-navigate="modules">Modules</a>
        <span class="breadcrumb__sep" aria-hidden="true">/</span>
        <span class="breadcrumb__current" aria-current="page">${mod ? mod.title : moduleId}</span>
      </nav>

      <div class="module-content">${html}</div>

      <div class="module-nav">
        <button class="btn btn--ghost" data-navigate-prev="${moduleId}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Previous
        </button>
        <button class="btn ${isComplete ? 'btn--ghost' : 'btn--accent'}" data-toggle-complete="${moduleId}" id="btn-complete" aria-pressed="${isComplete}">
          ${isComplete ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Completed' : 'Mark as Complete'}
        </button>
        <button class="btn btn--ghost" data-navigate-next="${moduleId}">
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <div class="attribution" style="margin-top:var(--space-8);">
        These notes are based on the original <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
          <strong>"Introduction to Linux" (LFS101)</strong></a> course by the Linux Foundation.
      </div>
    `;

    enhanceCodeBlocks();
    enhanceImages();
    enhanceSummarySections();
    enhanceSectionHeaders();
  } catch (err) {
    el.innerHTML = `
      <h2>Module not found</h2>
      <p>Could not load <code>${escHtml(moduleId)}.html</code>.</p>
      <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">
        <button class="btn btn--primary" data-navigate="home">Back to Home</button>
        <button class="btn btn--ghost" data-retry="${escHtml(moduleId)}">Retry</button>
      </div>
    `;
  }
}

// ---------------------------------------------------------------------------
// Toggle complete
// ---------------------------------------------------------------------------
function toggleComplete(moduleId) {
  const btn = document.getElementById('btn-complete');
  if (!btn) return;

  const newState = !progressData[moduleId]?.completed;
  progressData[moduleId] = { completed: newState, updatedAt: new Date().toISOString() };
  saveProgressToCookie();

  btn.className = `btn ${newState ? 'btn--ghost' : 'btn--accent'}`;
  btn.innerHTML = newState
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Completed'
    : 'Mark as Complete';
  btn.setAttribute('aria-pressed', newState);
  // Update only the specific sidebar link instead of rebuilding all 17
  updateSidebarLink(moduleId);
  updateCourseSidebar(moduleId);
  updateProgressUI();
  announce(newState ? 'Module marked as complete' : 'Module marked as incomplete');
}

// ---------------------------------------------------------------------------
// Code block enhancement
// ---------------------------------------------------------------------------
function enhanceCodeBlocks() {
  document.querySelectorAll('.module-content pre').forEach((pre) => {
    if (pre.closest('.code-block')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';

    // Copy button – absolutely positioned top-right corner
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-block__copy';
    copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy';
    copyBtn.title = 'Copy code to clipboard';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
    copyBtn.addEventListener('click', () => copyCode(pre, copyBtn));

    wrapper.appendChild(copyBtn);
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
  });
}

async function copyCode(preOrBtn, maybeBtn) {
  // Support both: copyCode(pre, btn) and copyCode(btn) from onclick
  let btn, pre;
  if (maybeBtn) {
    pre = preOrBtn;
    btn = maybeBtn;
  } else {
    btn = preOrBtn;
    pre = btn.closest('.code-block')?.querySelector('pre') || btn.closest('.code-block')?.querySelector('code');
  }
  if (!pre || !btn) return;

  const raw = pre.textContent;
  const cleaned = raw
    .split('\n')
    .map(line => line.replace(/^\$\s/, ''))
    .join('\n')
    .trim();

  try {
    await navigator.clipboard.writeText(cleaned);
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    btn.classList.add('copied');
    announce('Code copied to clipboard');
    setTimeout(() => { btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy'; btn.classList.remove('copied'); }, 2000);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = cleaned;
    textarea.style.cssText = 'position:fixed;left:-9999px;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    btn.classList.add('copied');
    announce('Code copied to clipboard');
    setTimeout(() => { btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy'; btn.classList.remove('copied'); }, 2000);
  }
}

// ---------------------------------------------------------------------------
// Fix consecutive <ol> tags (normalize list items into single <ol>)
// ---------------------------------------------------------------------------
function fixConsecutiveOl(html) {
  // Replace consecutive <ol><li>...</li></ol> with a single <ol>
  return html.replace(/((?:<ol><li>[\s\S]*?<\/li><\/ol>\s*)+)/g, (match) => {
    const items = [];
    const itemRegex = /<ol><li>([\s\S]*?)<\/li><\/ol>/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(match)) !== null) {
      items.push(`<li>${itemMatch[1]}</li>`);
    }
    return `<ol>${items.join('')}</ol>`;
  });
}

// ---------------------------------------------------------------------------
// Section header classification (main-header vs sub-header)
// ---------------------------------------------------------------------------
const MAIN_HEADERS = {
  'linux-history':      ['What Linux Is', 'The Creator of Linux', 'How It Comes to Become Today Linux'],
  'linux-philosophy':   ['Linux Philosophy Overview', 'Summary'],
  'linux-families':     ['Linux Distribution Overview', 'The Three Major Linux Distribution Families', 'The Red Hat Family', 'The SUSE Family', 'The Debian Family', 'Summary'],
  'linux-basics':       ['The Boot Process', 'Kernel, init and Services', 'Linux Filesystem Basics', 'Linux Installation', 'Summary'],
  'gui':                ['GUI Overview', 'GNOME Desktop Environment', 'Summary'],
  'command-line':       ['Launching Terminal Window', 'sudo', 'Turning Off the Graphical Desktop', 'Basic Operations', 'Working With Files', 'Searching for Files', 'Installing Software', 'Summary'],
  'documentation':      ['Linux Documentation Sources', 'GNU Info', 'The --help Option and help Command', 'Other Documentation Sources', 'Summary'],
  'processes':          ['Introduction to Processes and Process Attributes', 'Process Metrics and Process Control', 'Listing Processes: ps and top', 'Starting Processes in The Future', 'Summary'],
  'file-operations':    ['File System', 'File System Layout', 'Comparing Files and File Types', 'Backing Up and Compressing Data', 'Summary'],
  'text-editors':       ['Basic Editors: nano and gedit', 'More Advanced Editors: vi and emacs', 'Summary'],
  'user-environment':   ['Accounts, Users and Accounts', 'Environmental Variable', 'Recalling Previous Commands', 'File Permissions', 'Summary'],
  'manipulating-text':  ['cat and echo', 'Working with Large and Compressed Files', 'sed and awk', 'File Manipulation Utilities', 'grep and strings', 'Miscellaneous Text Utilities', 'Summary'],
  'network-operations': ['Network Addresses and DNS', 'Network Configuration Tools', 'Browsers, wget and curl', 'Transferring Files', 'Summary'],
  'bash-scripting':     ['Features and Capabilities', 'Syntax', 'Constructs', 'Summary'],
  'bash-advanced':      ['String Manipulation', 'The case Statement', 'Looping Constructs', 'Script Debugging', 'Some Additional Useful Techniques', 'Summary'],
  'printing':           ['Configuration', 'Printing Operations', 'Manipulating Postscript and PDF Files', 'Summary'],
  'security':           ['Understanding Linux Security', 'When Are root Privileges Required?', 'sudo, Process Isolation, Limiting Hardware Access and Keeping Systems Current', 'Working with Passwords', 'Securing the Boot Process and Hardware Resources', 'Summary'],
};

function enhanceSectionHeaders() {
  const headers = MAIN_HEADERS[currentModuleId];
  if (!headers) return;

  const headerSet = new Set(headers.map(h => h.toLowerCase()));

  document.querySelectorAll('.module-content h3').forEach((h3) => {
    if (h3.closest('.summary-section')) return;
    const text = h3.textContent.trim();
    if (headerSet.has(text.toLowerCase())) {
      h3.classList.add('main-header');
    } else {
      h3.classList.add('sub-header');
    }
  });
}

// ---------------------------------------------------------------------------
// Summary section enhancement
// ---------------------------------------------------------------------------
function enhanceSummarySections() {
  document.querySelectorAll('.module-content h3').forEach((h3) => {
    if (h3.textContent.trim() !== 'Summary') return;
    if (h3.closest('.summary-section')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'summary-section';

    h3.parentNode.insertBefore(wrapper, h3);
    wrapper.appendChild(h3);

    // Collect all sibling elements until end of content or next major section break
    let sibling = wrapper.nextSibling;
    while (sibling) {
      const next = sibling.nextSibling;
      wrapper.appendChild(sibling);
      sibling = next;
    }
  });
}

// ---------------------------------------------------------------------------
// Image path fixup
// ---------------------------------------------------------------------------
function enhanceImages() {
  document.querySelectorAll('.module-content img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (src.startsWith('src/') || src.startsWith('./src/') || /^image\s*\d+\.png$/i.test(src)) {
      const filename = src.replace(/^\.?\/?src\//, '');
      img.src = `/src/${encodeURIComponent(filename)}`;
    }
    // Add lazy loading for below-the-fold images
    img.loading = 'lazy';
  });
}

// ---------------------------------------------------------------------------
// Progress UI
// ---------------------------------------------------------------------------
function updateProgressUI() {
  const completed = Object.values(progressData).filter((p) => p.completed).length;
  const pct = MODULES.length ? Math.round((completed / MODULES.length) * 100) : 0;

  // Topbar progress
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (fill) fill.style.width = `${pct}%`;
  if (label) label.textContent = `${pct}%`;
  // Update all progress bars' ARIA attributes
  document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.setAttribute('aria-valuenow', completed);
    bar.setAttribute('aria-valuemax', MODULES.length);
  });
}

// ---------------------------------------------------------------------------
// Course sidebar
// ---------------------------------------------------------------------------
function buildCourseSidebar() {
  const nav = document.getElementById('course-sidebar-nav');
  if (!nav) return;

  nav.innerHTML = MODULES.map((m, i) => `
    <a class="course-sidebar__link" data-module="${m.id}" data-navigate="${m.id}" aria-label="Module ${i + 1}: ${m.title}${progressData[m.id]?.completed ? ' (completed)' : ''}">
      <span class="course-sidebar__link-num">${i + 1}</span>
      <span>${m.title}</span>
      ${progressData[m.id]?.completed ? '<span class="course-sidebar__link-check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>' : ''}
    </a>
  `).join('');
}

// Update a single sidebar link's checkmark and aria-label without rebuilding all links
function updateSidebarLink(moduleId) {
  const link = document.querySelector(`.course-sidebar__link[data-module="${moduleId}"]`);
  if (!link) return;

  const mod = MODULES.find(m => m.id === moduleId);
  const done = progressData[moduleId]?.completed;
  const i = MODULES.findIndex(m => m.id === moduleId);

  // Update aria-label
  link.setAttribute('aria-label', `Module ${i + 1}: ${mod.title}${done ? ' (completed)' : ''}`);

  // Update or create/remove the checkmark
  let check = link.querySelector('.course-sidebar__link-check');
  if (done && !check) {
    const span = document.createElement('span');
    span.className = 'course-sidebar__link-check';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    link.appendChild(span);
  } else if (!done && check) {
    check.remove();
  }
}

function updateCourseSidebar(activeId) {
  const sidebar = document.getElementById('course-sidebar');
  if (!sidebar) return;

  // Update active link
  sidebar.querySelectorAll('.course-sidebar__link').forEach((el) => {
    el.classList.toggle('active', el.dataset.module === activeId);
  });

  // Update progress text
  const completed = Object.values(progressData).filter((p) => p.completed).length;
  const progressText = document.getElementById('sidebar-progress-text');
  if (progressText) progressText.textContent = `${completed}/${MODULES.length} complete`;

  // Scroll active link into view
  const activeLink = sidebar.querySelector('.course-sidebar__link.active');
  if (activeLink) activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------------
function navigateNext(currentId) {
  const idx = MODULES.findIndex((m) => m.id === currentId);
  if (idx < MODULES.length - 1) navigate(MODULES[idx + 1].id);
  else navigate('modules');
}

function navigatePrev(currentId) {
  const idx = MODULES.findIndex((m) => m.id === currentId);
  if (idx > 0) navigate(MODULES[idx - 1].id);
  else navigate('home');
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
function bindEvents() {
  // Hash-based routing
  window.addEventListener('hashchange', () => {
    const hash = location.hash.slice(1) || 'home';
    if (hash !== currentModuleId) navigate(hash);
  });

  // Static element handlers
  document.getElementById('btn-sidebar-toggle')?.addEventListener('click', toggleSidebar);
  document.getElementById('btn-sidebar-close')?.addEventListener('click', closeSidebar);
  document.getElementById('sidebar-backdrop')?.addEventListener('click', closeSidebar);
  document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleDarkMode);
  document.getElementById('btn-cookies-accept')?.addEventListener('click', acceptCookies);
  document.getElementById('btn-cookies-decline')?.addEventListener('click', declineCookies);
  document.getElementById('footer-scroll-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('content').scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Event delegation for data-navigate on static elements
  document.addEventListener('click', (e) => {
    const navEl = e.target.closest('[data-navigate]');
    if (navEl) {
      e.preventDefault();
      // Guard against double-fire from keyboard handler
      if (navEl.getAttribute('data-navigating') === 'true') return;
      navigate(navEl.dataset.navigate);
      return;
    }

    const prevEl = e.target.closest('[data-navigate-prev]');
    if (prevEl) {
      navigatePrev(prevEl.dataset.navigatePrev);
      return;
    }

    const nextEl = e.target.closest('[data-navigate-next]');
    if (nextEl) {
      navigateNext(nextEl.dataset.navigateNext);
      return;
    }

    const completeEl = e.target.closest('[data-toggle-complete]');
    if (completeEl) {
      toggleComplete(completeEl.dataset.toggleComplete);
      return;
    }

    const retryEl = e.target.closest('[data-retry]');
    if (retryEl) {
      loadModule(retryEl.dataset.retry);
      return;
    }
  });

  // Keyboard navigation for cards
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.card[role="link"]');
      if (card && card.dataset.navigate) {
        e.preventDefault();
        // Guard against double-fire: some screen readers synthesize a click
        // after processing Enter on role='link', which would re-trigger navigate()
        card.setAttribute('data-navigating', 'true');
        navigate(card.dataset.navigate);
        setTimeout(() => card.removeAttribute('data-navigating'), 100);
      }
    }
  });
}
