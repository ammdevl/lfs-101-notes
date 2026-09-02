# Development Guide

Everything needed to run, work on, and contribute to the project locally.

## Prerequisites

- **Node.js ≥ 20.9** (22 recommended — see `.node-version`; required by Next.js 16)
- npm (bundled with Node)

## Getting Started

```bash
git clone https://github.com/ammdevl/lfs-101-notes.git
cd lfs-101-notes
npm install
npm run dev        # http://localhost:3000
```

## Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production static export → `out/`, then copies export to repo root |
| `npm run start` | Serves the `out/` folder (`npx serve out`) — preview what gets deployed |
| `npm run lint` | ESLint over the project |
| `npm run render:build` | Explicit CI-style build + copy to root |

> The root-copy side effect of `build` is intentional (deployment safety net); generated root artifacts (`index.html`, `_next/`, `modules/`, `src/`, `404*`) are gitignored.

## Project Layout

Quick orientation — full details in [Architecture](architecture.md):

```
pages/            routes (_app providers · index home · modules/[id] SSG pages)
layouts/          Base shell + Header (⌘K palette), Sidebar, Footer, ThemeSwitcher…
components/       ProgressContext (cookie store) + modules/*.js content files
data/modules.js   module registry (ids/order/titles) — source of truth
config/theme.json design tokens → tailwind.config.js
styles/           SCSS partials wrapped in Tailwind @layer blocks
public/src/       course images (served at /src/…)
docs/             human-facing documentation (this folder)
AGENTS.md         conventions for AI coding agents
```

## Workflow & Conventions

1. **Never push to `main` directly** — branch → pull request → merge.
2. Conventional commit messages: `fix:`, `feat:`, `docs:`, `chore:` …
3. Run `npm run lint` and a successful `npm run build` before opening a PR; sanity-check that `out/index.html` contains your change.
4. Headless environments: commits may require GPG signing — use `git -c commit.gpgsign=false commit …` instead of disabling signing globally.

## Common Tasks

| Task | Where to look |
|------|---------------|
| Add / edit a course module | [Content Guide](content-guide.md) |
| Change colors or fonts | [Styling & Theming](styling-and-theming.md) |
| Debug deployment | [Deployment](deployment.md) |
| Understand how data moves | [Data Flow](data-flow.md) |

## Docs Maintenance

This `docs/` folder is for humans; `AGENTS.md` is for coding agents. When behavior changes, update both:
- user-visible behavior → relevant page here
- conventions/gotchas an agent must not regress → `AGENTS.md`
