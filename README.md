# 🐧 LFS101 Notes
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-ammdevl-181717?logo=github)](https://github.com/ammdevl)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/ammdevl/js-react-learning-journey.svg)](https://github.com/ammdevl/js-react-learning-journey/issues)

## Table of Contents
- [🐧 LFS101 Notes](#-lfs101-notes)
  - [Table of Contents](#table-of-contents)
  - [📖 About](#-about)
  - [🚀 Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Local Development](#local-development)
    - [Docker](#docker)
  - [📁 Project Structure](#-project-structure)
  - [🌟 Features](#-features)
    - [Course Content](#course-content)
    - [Progress Tracking](#progress-tracking)
    - [Dark Mode](#dark-mode)
    - [Keyboard Navigation](#keyboard-navigation)
  - [🛡️ Security](#️-security)
  - [🛠️ Customization](#️-customization)
    - [Adding Modules](#adding-modules)
    - [Modifying Styles](#modifying-styles)
  - [📘 Course Attribution](#-course-attribution)
  - [📄 License](#-license)
  - [🤝 Contact Me](#-contact-me)

## 📖 About

This is a self-hosted web application that provides a clean, readable interface for reviewing LFS101 course material. It includes:

- 📚 **17 course modules** covering Linux fundamentals
- 🌙 **Dark mode** support
- 📊 **Progress tracking** (saved locally in browser)
- 📱 **Responsive design** for desktop and mobile
- ⌨️ **Keyboard accessible** with proper focus states
- 🔒 **Secure** by default (CSP headers, no inline scripts)

> **Note**: This is a study aid, not a replacement for the official course. Enroll in the free [LFS101 course](https://training.linuxfoundation.org/training/introduction-to-linux/) to access the full learning experience.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ (for local development)
- [Docker](https://docs.docker.com/get-docker/) (optional, for containerized deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lfs-101-notes.git
cd lfs-101-notes

# Install backend dependencies
cd backend
npm install

# Start the server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

```bash
# Build and run with Docker Compose
docker compose up --build

# Or run with Docker directly
docker build -t lfs101-notes .
docker run -p 3000:3000 lfs101-notes
```

## 📁 Project Structure

```
lfs-101-notes/
├── backend/
│   ├── server.js          # Express server with security headers
│   └── package.json
├── frontend/
│   ├── modules/           # Course content (HTML fragments)
│   │   ├── linux-history.html
│   │   ├── linux-philosophy.html
│   │   └── ...
│   └── public/
│       ├── index.html     # Single page application
│       ├── assets/
│       │   ├── css/       # Stylesheets
│       │   └── js/        # Client-side JavaScript
│       └── src/           # Course images
├── src/                   # Additional course images
├── Dockerfile
├── docker-compose.yml
├── LICENSE
└── README.md
```

## 🌟 Features

### Course Content

All 17 LFS101 modules are included with proper formatting:

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

Toggle between light and dark themes using the sun/moon icon in the header. Your preference is saved in localStorage.

### Keyboard Navigation

- `Tab` through all interactive elements
- Visible focus rings for accessibility
- Skip-to-content link for keyboard users

## 🛡️ Security

- **Content Security Policy (CSP)** headers via Helmet
- **No inline scripts** — all JavaScript in external files
- **Input validation** on module navigation
- **Rate limiting** on API endpoints
- **Secure cookies** with SameSite=Lax

## 🛠️ Customization

### Adding Modules

1. Create a new HTML file in `frontend/modules/` (e.g., `new-module.html`)
2. Add the module entry to the `MODULES` array in `frontend/public/assets/js/app.js`
3. Add the module ID to `MAIN_HEADERS` for section header styling

### Modifying Styles

- `frontend/public/assets/css/variables.css` — Design tokens (colors, spacing, typography)
- `frontend/public/assets/css/main.css` — Layout, sidebar, header, global styles
- `frontend/public/assets/css/course.css` — Module content styles (code blocks, tables, images)

## 📘 Course Attribution

These notes are based on the original [**Introduction to Linux (LFS101)**](https://training.linuxfoundation.org/training/introduction-to-linux/) course by the [Linux Foundation](https://www.linuxfoundation.org/).

This is an unofficial study resource and is not affiliated with or endorsed by the Linux Foundation.


## 📄 License

This repository is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contact Me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ammdevl)
[![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/ammdevl)
[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/ammdevl)

---
<div align="center">
💬 Feel free to contact me if you have any questions or feedback.
</div>
