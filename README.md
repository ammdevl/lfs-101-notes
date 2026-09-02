# LFS101 Notes

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## About

A static site built with **Next.js** (Pages Router), **Tailwind CSS 3 + SCSS**, and **Lenis smooth scroll** that provides a clean, readable interface for reviewing LFS101 course material.

- **17 course modules** covering Linux fundamentals, with reading-time estimates
- **⌘K command palette** — search modules and jump straight to any section
- **Dark mode** support (via `next-themes`), WCAG-AA checked
- **Progress tracking** (saved locally in your browser) with sidebar progress ring
- **Copy buttons on every terminal block**, reading progress bar, completion confetti
- **Responsive design** for desktop and mobile
- **Keyboard accessible** with proper focus states, live-region announcements, and reduced-motion support
- **Smooth scrolling** via Lenis

> **Note**: This is a study aid, not a replacement for the official course. Enroll in the free [LFS101 course](https://training.linuxfoundation.org/training/introduction-to-linux/) to access the full learning experience.

## Documentation

| Audience | Resource |
|----------|----------|
| Users & contributors | [`docs/`](docs/index.md) — architecture, data flow, content guide, styling, deployment, accessibility, development |
| AI coding agents | [`AGENTS.md`](AGENTS.md) — conventions, guardrails, regression history |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) **20.9+** (22 recommended, see `.node-version`)

### Local Development

```bash
# Clone the repository
git clone https://github.com/ammdevl/lfs-101-notes.git
cd lfs-101-notes

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build the fully static export into ./out
npm run build

# Preview the static output
npx serve out
```

The build also copies `out/` to the repository root (`postbuild` hook) so that Render's Static Site serves correctly whether its publish directory is `out` or `.`. For an explicit CI-style run use `npm run render:build`.

> For architecture, data flow, and agent-facing conventions see [AGENTS.md](AGENTS.md).

## Project Structure

> Full architecture, data flow, and conventions: **[AGENTS.md](AGENTS.md)**

```
lfs-101-notes/
├── components/
│   ├── modules/            # JSX module content (17 files)
│   ├── ProgressContext.js  # Cookie-based progress tracking
│   ├── SearchContext.js    # ⌘K search-index registry
│   ├── ScrollReveal.js     # Scroll-reveal wrapper
│   ├── CountUp.js          # Animated stat numbers
│   └── TuxMark.js          # Tux brand logo
├── config/
│   └── theme.json          # Design tokens
├── data/
│   └── modules.js          # Module metadata
├── lib/
│   ├── content-meta.js     # Build-time read time + heading extraction
│   ├── slugify.js          # Shared heading-slug logic
│   └── scroll.js           # Lenis-aware scroll helpers
├── layouts/
│   ├── Base.js             # Base layout wrapper (topbar, FAB, progress)
│   └── components/
│       ├── Header.js       # Glass topbar (⌘K palette, GitHub, theme)
│       ├── CommandPalette.js
│       ├── Sidebar.js      # Course navigation sidebar
│       ├── Footer.js
│       ├── LenisProvider.js
│       └── ThemeSwitcher.js
├── pages/
│   ├── _app.js             # App wrapper (theme, progress, search, lenis)
│   ├── index.js            # Home page
│   ├── 404.js              # Branded not-found page
│   └── modules/
│       ├── index.js        # Module listing (search + filters)
│       └── [id].js         # Dynamic module page (TOC pass, copy buttons)
├── public/
│   ├── favicon.svg         # Tux favicon
│   └── src/                # Course images
├── docs/                   # User-facing documentation
├── styles/
│   ├── style.scss          # Tailwind entry point
│   ├── base.scss           # Reset, typography, focus states, reveal
│   ├── layout.scss         # Topbar, sidebar, footer, FAB styles
│   ├── components.scss     # Buttons, cards, terminal blocks, palette
│   └── utilities.scss      # Keyframes and helper classes
├── next.config.js
├── tailwind.config.js
├── jsconfig.json           # Path aliases
└── render.yaml             # Render Static Site config
```

## Features

### Course Content

All 17 LFS101 modules are included as JSX components with proper formatting:

- Linux History & Philosophy
- Distribution Families (Red Hat, SUSE, Debian)
- System Basics & Boot Process
- Command Line Operations
- File Operations & Permissions
- Text Editors (vim, nano, emacs)
- Networking & Security
- Bash Scripting
- And more...

### Progress Tracking

- Click "Mark as Complete" on any module (with a confetti celebration)
- Progress is saved locally in your browser — no accounts, no server
- Progress ring in the course sidebar
- Sidebar shows completion checkmarks per module

### Search (⌘K)

- Press `Ctrl/⌘ + K` (or the Search button in the top bar) anywhere
- Searches module titles, descriptions, and every section heading
- Jump straight to a module — or deep-link to an exact section
- Full keyboard navigation: `↑`/`↓` to move, `Enter` to open, `Esc` to close

### Reading Aids

- Reading progress bar at the top of every module page
- "On this page" links from the ⌘K palette to any section
- Estimated reading time on module cards and module pages
- Copy button on all 173 terminal blocks (strips `$` prompts)

### Dark Mode

Toggle between light and dark themes using the sun/moon icon in the header. Your preference is saved via `next-themes`.

### Keyboard Navigation

- `Ctrl/⌘ + K` — Open the search palette
- `Alt + ←/→` — Navigate between modules
- `Tab` through all interactive elements
- Visible focus rings for accessibility
- Skip-to-content link for keyboard users

## Customization

### Adding Modules

1. Create a new JSX component in `components/modules/` (e.g., `NewModule.js`)
2. Add the module entry to the `MODULES` array in `data/modules.js`
3. Add the dynamic import in `pages/modules/[id].js`

### Modifying Styles

- `styles/base.scss` — Reset, typography, focus states
- `styles/layout.scss` — Topbar, sidebar, footer
- `styles/components.scss` — Buttons, cards, code blocks, module content
- `config/theme.json` — Design tokens (colors, fonts)
- `tailwind.config.js` — Tailwind configuration

## Course Attribution

These notes are based on the original [**Introduction to Linux (LFS101)**](https://training.linuxfoundation.org/training/introduction-to-linux/) course by the [Linux Foundation](https://www.linuxfoundation.org/).

This is an unofficial study resource and is not affiliated with or endorsed by the Linux Foundation.

## License

This repository is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

