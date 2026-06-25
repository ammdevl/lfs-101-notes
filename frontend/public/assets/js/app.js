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

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let currentModuleId = 'home';
let progressData = {};

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
}

// ---------------------------------------------------------------------------
// Cookie consent
// ---------------------------------------------------------------------------
const COOKIE_CONSENT_KEY = 'lfs101_cookies_accepted';

function cookiesAccepted() {
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
}

function showCookieBannerIfNeeded() {
  if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
    const banner = document.getElementById('cookie-banner');
    if (banner) banner.classList.remove('hidden');
  }
}

function acceptCookies() {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
  dismissBanner();
}

function declineCookies() {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
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
      sidebar.classList.remove('hidden');
    } else {
      sidebar.classList.add('hidden');
    }
  }

  // Show/hide sidebar toggle button (only on module pages)
  if (sidebarToggle) sidebarToggle.style.display = isModulePage ? 'inline-flex' : 'none';

  // Toggle topbar brand centering class (only on home/modules pages)
  const topbar = document.getElementById('topbar');
  if (topbar) topbar.classList.toggle('topbar--standalone', !isModulePage);

  // Show/hide topbar actions (progress + terminal toggle, only on module pages)
  if (actions) actions.style.display = isModulePage ? 'flex' : 'none';

  if (isHome) {
    renderHome();
  } else if (isModules) {
    renderModules();
  } else {
    loadModule(moduleId);
  }

  // Update sidebar active state
  if (isModulePage) updateCourseSidebar(moduleId);

  document.getElementById('content').scrollTop = 0;
}

// ---------------------------------------------------------------------------
// Sidebar toggle
// ---------------------------------------------------------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('course-sidebar');
  if (!sidebar) return;
  sidebar.classList.toggle('hidden');
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
      <span class="home-hero__icon">🐧</span>
      <h1 class="home-hero__title">Introduction to Linux</h1>
      <p class="home-hero__subtitle">LFS101 Notes</p>
      <p class="home-hero__desc">
        Personal study notes from the <strong>"Introduction to Linux" (LFS101)</strong> course by the Linux Foundation.
        Use these notes alongside the official course material to reinforce your learning.
      </p>
      <div class="home-hero__actions">
        <button class="btn btn--primary" data-navigate="modules">Browse Modules</button>
        <button class="btn btn--accent" data-navigate="${MODULES[0].id}">Start Learning →</button>
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
      <div class="home-stat">
        <span class="home-stat__value">${pct}%</span>
        <span class="home-stat__label">Progress</span>
      </div>
    </div>

    ${completed > 0 ? `
      <div style="margin-top:var(--space-10);">
        <h2 style="font-size:var(--font-size-xl);margin-bottom:var(--space-6);">Continue Where You Left Off</h2>
        <div class="home-recent">
          ${MODULES.filter(m => progressData[m.id]?.completed).slice(0, 3).map((m, i) => `
            <div class="card" data-navigate="${m.id}" style="margin-bottom:0;">
              <div style="display:flex;align-items:center;gap:var(--space-3);">
                <span style="font-size:1.2em;">${m.icon}</span>
                <div>
                  <div class="card__title" style="font-size:var(--font-size-sm);margin-bottom:0;">${m.title}</div>
                  <span style="font-size:var(--font-size-xs);color:var(--color-accent);">✓ Completed</span>
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
          <span class="home-feature__icon">🖥️</span>
          <div>
            <strong>Command Line Mastery</strong>
            <p>Navigate the filesystem, manage processes, and use pipes, redirection, and shell scripting.</p>
          </div>
        </div>
        <div class="home-feature">
          <span class="home-feature__icon">📁</span>
          <div>
            <strong>File &amp; Process Management</strong>
            <p>Understand permissions, ownership, links, and how Linux manages processes and services.</p>
          </div>
        </div>
        <div class="home-feature">
          <span class="home-feature__icon">🌐</span>
          <div>
            <strong>Networking &amp; Security</strong>
            <p>Configure networks, use SSH, manage firewalls, and apply local security principles.</p>
          </div>
        </div>
        <div class="home-feature">
          <span class="home-feature__icon">🐧</span>
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
          <span class="home-quick-link__icon">🎓</span>
          <span class="home-quick-link__text">Official LFS101 Course</span>
        </a>
        <a class="home-quick-link" href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">🏢</span>
          <span class="home-quick-link__text">Linux Foundation</span>
        </a>
        <a class="home-quick-link" href="https://www.kernel.org/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">⚙️</span>
          <span class="home-quick-link__text">Linux Kernel</span>
        </a>
        <a class="home-quick-link" href="https://www.linux.com/what-is-linux/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">📖</span>
          <span class="home-quick-link__text">What is Linux?</span>
        </a>
        <a class="home-quick-link" href="https://distrowatch.com/" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">📀</span>
          <span class="home-quick-link__text">DistroWatch</span>
        </a>
        <a class="home-quick-link" href="https://github.com/torvalds/linux" target="_blank" rel="noopener">
          <span class="home-quick-link__icon">🐙</span>
          <span class="home-quick-link__text">Linux on GitHub</span>
        </a>
      </div>
    </div>

    <div class="attribution" style="margin-top:var(--space-12);">
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
    <nav class="breadcrumb">
      <a href="#home" data-navigate="home">Home</a>
      <span class="breadcrumb__sep">/</span>
      <span class="breadcrumb__current">Modules</span>
    </nav>

    <h1>🐧 Introduction to Linux <span style="color:var(--text-muted);font-weight:400;font-size:0.5em;display:block;margin-top:4px;">LFS101 Notes</span></h1>
    <p style="font-size:var(--font-size-lg);color:var(--text-secondary);max-width:640px;margin-bottom:var(--space-8);">
      Personal study notes from the <strong>"Introduction to Linux" (LFS101)</strong> course by the Linux Foundation.
      Use these notes alongside the official course material.
    </p>

    <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-lg);padding:var(--space-6);margin-bottom:var(--space-8);box-shadow:var(--shadow-xs);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-3);">
        <span style="font-size:var(--font-size-sm);font-weight:500;color:var(--text-heading);">Your Progress</span>
        <span style="font-size:var(--font-size-sm);font-weight:700;color:var(--color-primary);">${completed}/${MODULES.length} modules (${pct}%)</span>
      </div>
      <div class="progress-bar" style="width:100%;height:8px;">
        <div class="progress-bar__fill" style="width:${pct}%;"></div>
      </div>
    </div>

    <div class="dashboard-grid">
      ${MODULES.map((m, i) => {
        const done = progressData[m.id]?.completed;
        return `
          <div class="card" data-navigate="${m.id}">
            <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
              <span style="font-size:1.4em;line-height:1;">${m.icon}</span>
              <span style="font-size:var(--font-size-xs);color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Module ${i + 1}</span>
              ${done ? '<span style="margin-left:auto;background:rgba(5,150,105,.1);color:var(--color-accent);font-size:var(--font-size-xs);padding:2px 8px;border-radius:999px;font-weight:500;">✓ Done</span>' : ''}
            </div>
            <div class="card__title">${m.title}</div>
            <div class="card__desc">${m.desc || ''}</div>
          </div>`;
      }).join('')}
    </div>

    <div class="attribution" style="margin-top:var(--space-12);">
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
  el.innerHTML = '<p style="color:var(--text-muted);">Loading…</p>';

  try {
    const resp = await fetch(`/modules/${moduleId}.html`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const html = await resp.text();

    const isComplete = progressData[moduleId]?.completed;
    const mod = MODULES.find(m => m.id === moduleId);

    el.innerHTML = `
      <nav class="breadcrumb">
        <a href="#home" data-navigate="home">Home</a>
        <span class="breadcrumb__sep">/</span>
        <a href="#modules" data-navigate="modules">Modules</a>
        <span class="breadcrumb__sep">/</span>
        <span class="breadcrumb__current">${mod ? mod.title : moduleId}</span>
      </nav>

      <div class="module-content">${html}</div>

      <div class="module-nav">
        <button class="btn btn--ghost" data-navigate-prev="${moduleId}">← Previous</button>
        <button class="btn ${isComplete ? 'btn--ghost' : 'btn--accent'}" data-toggle-complete="${moduleId}" id="btn-complete">
          ${isComplete ? '✓ Completed' : 'Mark as Complete'}
        </button>
        <button class="btn btn--ghost" data-navigate-next="${moduleId}">Next →</button>
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
      <button class="btn btn--primary" data-navigate="home">Back to Home</button>
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
  btn.textContent = newState ? '✓ Completed' : 'Mark as Complete';
  buildCourseSidebar();
  updateCourseSidebar(moduleId);
  updateProgressUI();
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
    copyBtn.innerHTML = '📋 Copy';
    copyBtn.title = 'Copy to clipboard';
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
    btn.innerHTML = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = '📋 Copy'; btn.classList.remove('copied'); }, 2000);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = cleaned;
    textarea.style.cssText = 'position:fixed;left:-9999px;';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    btn.innerHTML = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => { btn.innerHTML = '📋 Copy'; btn.classList.remove('copied'); }, 2000);
  }
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
}

// ---------------------------------------------------------------------------
// Course sidebar
// ---------------------------------------------------------------------------
function buildCourseSidebar() {
  const nav = document.getElementById('course-sidebar-nav');
  if (!nav) return;

  nav.innerHTML = MODULES.map((m, i) => `
    <a class="course-sidebar__link" data-module="${m.id}" data-navigate="${m.id}">
      <span class="course-sidebar__link-num">${i + 1}</span>
      <span>${m.title}</span>
      ${progressData[m.id]?.completed ? '<span class="course-sidebar__link-check">✓</span>' : ''}
    </a>
  `).join('');
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
  });
}
