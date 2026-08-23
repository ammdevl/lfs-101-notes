# LFS101 Notes

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-ammdevl-181717?logo=github)](https://github.com/ammdevl)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## About

A static site built with **Next.js** (Pages Router), **Tailwind CSS 3**, and **Lenis smooth scroll** that provides a clean, readable interface for reviewing LFS101 course material.

- **17 course modules** covering Linux fundamentals
- **Dark mode** support (via `next-themes`)
- **Progress tracking** (saved in browser cookies)
- **Responsive design** for desktop and mobile
- **Keyboard accessible** with proper focus states
- **Smooth scrolling** via Lenis

> **Note**: This is a study aid, not a replacement for the official course. Enroll in the free [LFS101 course](https://training.linuxfoundation.org/training/introduction-to-linux/) to access the full learning experience.

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
│   └── ProgressContext.js  # Cookie-based progress tracking
├── config/
│   └── theme.json          # Design tokens
├── data/
│   └── modules.js          # Module metadata
├── layouts/
│   ├── Base.js             # Base layout wrapper
│   └── components/
│       ├── Header.js       # Top navigation bar
│       ├── Sidebar.js      # Course navigation sidebar
│       ├── Footer.js
│       ├── LenisProvider.js
│       └── ThemeSwitcher.js
├── pages/
│   ├── _app.js             # App wrapper (theme, progress, lenis)
│   ├── index.js            # Home page
│   └── modules/
│       ├── index.js        # Module listing
│       └── [id].js         # Dynamic module page
├── public/
│   └── src/                # Course images
├── styles/
│   ├── style.scss          # Tailwind entry point
│   ├── base.scss           # Reset, typography, focus states
│   ├── layout.scss         # Topbar, sidebar, footer styles
│   ├── components.scss     # Buttons, cards, code blocks
│   └── utilities.scss      # Animations and helper classes
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

- Click "Mark as Complete" on any module
- Progress is saved in a browser cookie
- Visual progress bar in the top bar
- Sidebar shows completion status

### Dark Mode

Toggle between light and dark themes using the sun/moon icon in the header. Your preference is saved via `next-themes`.

### Keyboard Navigation

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

## Contact Me

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ammdevl)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/ammdevl)
[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/ammdevl)

---
<div align="center">
💬 Feel free to contact me if you have any questions or feedback.
</div>
