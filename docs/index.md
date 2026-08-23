# LFS101 Notes — Documentation

User-facing documentation for this project: what it is, how it works, how to run it, and how to extend it.

> Looking for AI-agent conventions? See [`AGENTS.md`](../AGENTS.md). For a quick overview, see the [README](../README.md).

## What Is This?

A fully static study-notes site for the Linux Foundation's **Introduction to Linux (LFS101)** course — built with Next.js (Pages Router), Tailwind CSS + SCSS, and deployed on Render as a Static Site. No server: every page prerenders to HTML; interactivity (theme switching, progress tracking, smooth scroll) is client-side React.

## Reading Order

| # | Page | Read it to… |
|---|------|-------------|
| 1 | [Architecture](architecture.md) | Understand the big picture: build pipeline and runtime shell |
| 2 | [Data Flow](data-flow.md) | Follow how tokens, module metadata, progress cookies, and themes move |
| 3 | [Content Guide](content-guide.md) | Add or edit course modules, images, code blocks |
| 4 | [Styling & Theming](styling-and-theming.md) | Work with the SCSS layers, design tokens, dark mode |
| 5 | [Deployment](deployment.md) | Understand the Render pipeline and troubleshoot deploys |
| 6 | [Accessibility](accessibility.md) | See implemented a11y features and the standards to keep |
| 7 | [Development Guide](development.md) | Set up locally, commands, workflow conventions |

## Feature Overview

- **17 course modules** as statically generated pages with per-page code splitting
- **Dark mode** with no flash-of-wrong-theme
- **Progress tracking** stored in browser cookies — no accounts, no server
- **Course sidebar** that persists across module navigation on desktop
- **Keyboard support** (`Alt+←/→` between modules, skip link, full focus management)
- **Accessible** markup: live regions, ARIA states, reduced-motion support

## Quick Links

- Local setup → [Development Guide](development.md)
- Deploying or debugging Render → [Deployment](deployment.md)
- Attribution & license → [README](../README.md)
