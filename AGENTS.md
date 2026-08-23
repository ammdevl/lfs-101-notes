# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository.
Read this before making changes; follow the conventions so fixes don't regress.

## Project Overview

Static study-notes site for the Linux Foundation's **Introduction to Linux (LFS101)** course.

| Layer      | Technology                                        |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (Pages Router), React 19               |
| Styling    | Tailwind CSS 3 + SCSS partials (`@layer`-wrapped) |
| Theming    | next-themes (`class` strategy on `<html>`)        |
| Scroll     | Lenis smooth scrolling                            |
| Output     | Fully static export (`output: "export"` → `out/`) |
| Hosting    | Render Static Site (`render.yaml`)                |
| Node       | >= 20.9 required (`.node-version` pins 22)        |

There is **no server**. Everything prerenders to HTML at build time; interactivity is client-side React.

## System Architecture

```
┌──────────────────────────── Build time ────────────────────────────┐
│                                                                    │
│  config/theme.json ──► tailwind.config.js ──► design tokens        │
│         │                                   (colors/fonts/sizes)   │
│  data/modules.js ──► SSG metadata (ids, titles, icons, order)      │
│                                                                    │
│  pages/_app.js                                                     │
│    └─ ThemeProvider (next-themes, attribute="class")               │
│       └─ ProgressProvider (cookie-backed context)                  │
│          └─ LenisProvider (smooth scroll)                          │
│             └─ page component                                      │
│                                                                    │
│  pages/modules/[id].js                                             │
│    ├─ getStaticPaths  ◄── data/modules.js                          │
│    ├─ getStaticProps                                              │
│    └─ dynamic import ◄── components/modules/<Module>.js (17 files) │
│                                                                    │
│  next build ──► out/  (index.html, modules/<id>/index.html, …)     │
│  postbuild hook ──► cp -r out/. .  (Render publish-dir safety net) │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── Runtime (browser) ─────────────────────┐
│                                                                    │
│  layouts/Base.js — page shell                                      │
│    ├─ Skip link → <main id="content">                              │
│    ├─ Header (topbar): brand · progress bar · ThemeSwitcher        │
│    ├─ Sidebar (module pages only): fixed left drawer, 280px,       │
│    │   full viewport height, header aligned to 56px topbar         │
│    ├─ Content (.content > .module-content)                         │
│    ├─ Footer                                                       │
│    ├─ CookieBanner (first visit consent)                           │
│    ├─ Scroll-to-top FAB                                            │
│    └─ #sr-announcer (aria-live region for async feedback)          │
└────────────────────────────────────────────────────────────────────┘
```

### Key flows

**Theme switching**
`next-themes` toggles `dark` class on `<html>` (blocking inline script prevents FOUC).
All dark styling is authored as explicit `.dark <selector>` overrides in SCSS — Tailwind's
`dark:` variant is available but rarely used. The ThemeSwitcher renders both sun/moon icons
statically; CSS shows/hides them via `html.dark`, so the correct icon paints on first frame
(no mount flicker).

**Progress tracking**
`components/ProgressContext.js` stores completed module ids in a cookie.
Consumers: topbar ProgressTracker, Sidebar checks, home-page stats, "Mark as Complete" button.

**Module pages**
`getStaticPaths` enumerates `data/modules.js`; each module body is code-split via a
dynamic-import map in `pages/modules/[id].js`. After mount, a DOM pass wraps every
`h3` titled "Summary" into a `.summary-section` container for styling.

**Sidebar behavior**
Open/close state lives in the module page. Desktop: stays open while navigating between
modules. Mobile (≤768px): overlay drawer, closes after navigation/backdrop tap/Escape.
Closed drawer is removed from tab order only *after* its slide-out animation
(`visibility` transition delay).

## Directory Map

```
components/
  ProgressContext.js     # cookie-based progress store (Context API)
  modules/*.js           # course content, one JSX file per module
config/theme.json        # design tokens consumed by tailwind.config.js
data/modules.js          # single source of truth for module ids/order
layouts/
  Base.js                # shell: Head/meta/fonts/Header/Footer/FAB/banner
  components/            # Header, Sidebar, Footer, ThemeSwitcher,
                         # CodeBlock, CookieBanner, LenisProvider, ProgressTracker
pages/
  _app.js _document.js   # providers + suppressHydrationWarning on <html>
  index.js               # home (topbarInset)
  modules/index.js       # all-modules grid
  modules/[id].js        # module page + SSG + keyboard nav (Alt+←/→)
public/src/*.png         # course images, referenced as /src/image N.png
styles/
  style.scss             # @tailwind entry; imports below inside @layer blocks
  base.scss              # reset, typography, link rules, focus rings, color-scheme
  layout.scss            # topbar, sidebar, footer, breadcrumb, FAB, banner
  components.scss        # buttons, cards, code blocks, module-content typography
  utilities.scss         # fade-in, line-clamp, copy flash
render.yaml              # Render blueprint (buildCommand uses npm run render:build)
```

## Commands

| Command             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server                                         |
| `npm run build`     | Production build → `out/` (postbuild copies to root too) |
| `npm run start`     | Serve `out/` locally (`npx serve`)                 |
| `npm run lint`      | ESLint                                             |
| `npm run render:build` | Explicit CI-style build (export + copy to root) |

**Verification before opening a PR:** `npm run build` must succeed, then sanity-check
`out/index.html` contains your change.

## Conventions & Rules

### Styling
- Author component styles in the SCSS partials with `@apply` + BEM-ish class names;
  keep Tailwind utility classes in JSX for one-off layout only.
- **Dark mode:** every new visible surface/button/text needs an explicit `.dark` override.
  Dark-mode buttons use a deep-blue/green base with white/dark text meeting WCAG AA
  (~4.5:1 minimum; primary buttons are ~8:1) and **brighten** on hover (dark-UI convention).
- Design tokens come from `config/theme.json` → reference with `theme("colors…")`.
  Don't hardcode colors in JSX except emerald status accents (and pair them with a
  dark-mode-safe variant).
- Images are `display: block` (Tailwind preflight) — centering requires
  `margin-inline: auto`, **not** `text-align: center`.
- Global anchor hover underline exists in `base.scss`; composite link-components
  (`.btn`, `.card`, `.home-quick-link`, `.topbar__brand`, sidebar links, skip-link)
  are excluded there. If you add a new interactive card/link component, extend that
  exclusion list instead of sprinkling `!important`.

### Accessibility
- Interactive toggles need `aria-label`, `aria-expanded`, `aria-controls` where applicable.
- Nav links: `aria-current="page"` when active; overlays close on Escape; decorative
  SVGs get `aria-hidden="true"`.
- Announce async results through the existing `#sr-announcer` live region
  (see `CodeBlock` copy button).
- Respect `prefers-reduced-motion` (global rule already in `base.scss`).

### Content modules
To add/edit a module: edit `components/modules/<Name>.js`, keep registration in sync in
BOTH `data/modules.js` (metadata) and the `moduleComponents` map in `pages/modules/[id].js`.
Images live in `public/src/` and are addressed as `/src/…` (URL-encoded spaces).
Figures should wrap images: `<figure><a …><img src alt /></a><figcaption>…</figcaption></figure>`.

### Deployment invariants (do not break)
- `next.config.js`: `output: "export"` **always**, `trailingSlash: true`, images unoptimized.
- `package.json` keeps the `postbuild` / `postbuild:render` hooks that copy `out/.` to the
  repo root — Render's publish directory may be `out` or `.`, both must work.
- Node engines `>=20.9` + `.node-version` = 22 must stay in sync with Next's requirements.

### Workflow
- Never push straight to `main`; branch → pull request → merge.
- Commit messages: conventional style (`fix:`, `feat:`, `chore:` …).
- Note: committing may require GPG signing; in headless sessions use
  `git -c commit.gpgsign=false commit …` rather than disabling signing globally.

## Known Gotchas (regression history)

| Symptom                                   | Cause / Fix location                                    |
| ----------------------------------------- | ------------------------------------------------------- |
| Text underlines appear inside buttons/cards | Global `a:hover` rule — see exclusion list in `base.scss` |
| Icon flashes/pops on load                 | ThemeSwitcher must stay CSS-driven (no mounted gate)     |
| Images not centered                       | Preflight block display — auto margins in `components.scss` |
| Hydration warnings on load                | `<Html suppressHydrationWarning>` in `_document.js`      |
| Site 404s at domain root                  | Publish-dir/build-command mismatch — postbuild copy hooks |
| Invisible controls in dark mode           | Missing `.dark` override or insufficient contrast        |
