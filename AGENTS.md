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
| Scroll     | Lenis smooth scrolling (window mode)              |
| Search     | ⌘K command palette (build-time index, no server)  |
| Motion     | ScrollReveal + CountUp (IO-based), canvas-confetti|
| Output     | Fully static export (`output: "export"` → `out/`) |
| Hosting    | Render Static Site (`render.yaml`)                |
| Node       | >= 20.9 required (`.node-version` pins 22)        |

There is **no server**. Everything prerenders to HTML at build time; interactivity is client-side React.

## System Architecture

```
┌──────────────────────────── Build time ────────────────────────────┐
│                                                                    │
│  config/theme.json ──► tailwind.config.js ──► design tokens        │
│         │               (colors incl. accent/success, fonts,       │
│  data/modules.js │          keyframes, shadows)                    │
│         ▼          │                                               │
│  lib/content-meta.js (fs, getStaticProps only)                     │
│    └─► per-module read time + headings (lib/slugify.js ids)        │
│        └─► search index prop on every page                         │
│                                                                    │
│  pages/_app.js                                                     │
│    └─ ThemeProvider (next-themes, attribute="class")               │
│       └─ ProgressProvider (cookie-backed progress, local-only)       │
│          └─ SearchProvider (⌘K index registry)                     │
│             └─ LenisProvider (window smooth scroll)                │
│                └─ page component                                   │
│                                                                    │
│  pages/modules/[id].js                                             │
│    ├─ getStaticProps: id · readMinutes · headings · searchIndex    │
│    ├─ getStaticPaths  ◄── data/modules.js                          │
│    └─ dynamic import ◄── components/modules/<Module>.js (17 files) │
│                                                                    │
│  next build ──► out/  (index.html, modules/<id>/index.html, …)     │
│  postbuild hook ──► cp -r out/. .  (Render publish-dir safety net) │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── Runtime (browser) ─────────────────────┐
│                                                                    │
│  layouts/Base.js — page shell                                      │
│    ├─ Skip link → <main id="content">                              │
│    ├─ Header (glass topbar): Tux brand · ⌘K search · GitHub ·      │
│    │    ThemeSwitcher                                              │
│    │    └─ CommandPalette (Cmd/Ctrl+K, registered search index)    │
│    ├─ Sidebar (module pages only): fixed 280px drawer,             │
│    │   progress ring + module list, data-lenis-prevent             │
│    ├─ Reading progress bar (module pages)                          │
│    ├─ Footer (multi-column)                                        │
│    ├─ Scroll-to-top FAB with SVG progress ring                     │
│    └─ #sr-announcer (aria-live region for async feedback)          │
│                                                                    │
│  Window is the scroll container. Anchor jumps run through          │
│  lib/scroll.js → lenis.scrollTo(); fixed scrollers carry           │
│  data-lenis-prevent.                                               │
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
`components/ProgressContext.js` stores completed module ids in a cookie — purely local,
functional storage (no consent gate). Consumers: Sidebar progress ring + checks,
home-page stats, "Mark as Complete" button (fires canvas-confetti).

**Search (⌘K)**
`lib/content-meta.js` (fs — import only from `getStaticProps`) extracts each module's
read time and headings; heading ids come from `lib/slugify.js`. Every page returns the
search index via `getStaticProps` and registers it through `useRegisterSearchIndex`;
`layouts/components/CommandPalette.js` reads it from `SearchContext`. Section results
deep-link to `/modules/<id>/#<slug>` — the runtime pass assigns matching ids.

**Module pages**
`getStaticPaths` enumerates `data/modules.js`; each module body is code-split via a
dynamic-import map in `pages/modules/[id].js`. After mount, one idempotent DOM pass:
assigns heading anchor ids, wraps tables in `.table-wrap`, wraps the "Summary" `h3`
into `.summary-section`, rebuilds the terminal dots (source `<span/>`s nest under HTML
parsing), and injects a copy button into every `.code-block__header`. It verifies its own
work with bounded retries in case the DOM is re-created.

**Scrolling model**
The window is the scroll container (sticky topbar; `#content` does not scroll). All
anchor jumps go through `lib/scroll.js` → `lenis.scrollTo()` (raw `window.scrollTo` is
overridden by Lenis). Fixed inner scrollers (sidebar nav, palette results) carry
`data-lenis-prevent` so wheel scrolling inside them doesn't move the page.

**Navbar width rule**
Topbar contents live in `.topbar__inner`. They are **inset only on wide pages**
(home, modules index: `topbar__inner--wide`, aligned with the 80rem content
container). On module pages they are **never inset** — full width of the main
area with edge padding. The sidebar toggle sits to the left of the Tux brand.

**Sidebar behavior**
Open/close state lives in the module page. Desktop: stays open while navigating between
modules. Mobile (≤768px): overlay drawer, closes after navigation/backdrop tap/Escape.
Closed drawer is removed from tab order only *after* its slide-out animation
(`visibility` transition delay).

## Directory Map

```
components/
  ProgressContext.js     # cookie progress store (Context API)
  SearchContext.js       # ⌘K search-index registry (pages register, palette reads)
  ScrollReveal.js        # IO-based reveal wrapper (needs html.js from _document)
  CountUp.js             # count-up number (SSR renders final value)
  TuxMark.js             # full-color Tux brand logo (matches favicon.svg)
  modules/*.js           # course content, one JSX file per module
config/theme.json        # design tokens consumed by tailwind.config.js
data/modules.js          # single source of truth for module ids/order
lib/
  content-meta.js        # fs: read time + headings per module (getStaticProps only)
  slugify.js             # shared heading slug/id logic (build + runtime)
  scroll.js              # lenis-aware scrollTo helpers
layouts/
  Base.js                # shell: Head/favicon/fonts/Header/Footer/FAB/progress
  components/            # Header (with ⌘K palette), Sidebar, Footer,
                         # ThemeSwitcher, LenisProvider
pages/
  _app.js _document.js   # providers + suppressHydrationWarning + html.js script
  index.js               # home (wide)
  modules/index.js       # all-modules grid (wide; search + filters)
  modules/[id].js        # module page + SSG + runtime DOM pass + Alt+←/→
public/
  favicon.svg            # Tux favicon (browser tab icon)
  src/*.png              # course images, referenced as /src/image N.png
styles/
  style.scss             # @tailwind entry; imports below inside @layer blocks
  base.scss              # reset, display headings, links, focus, reveal primitives
  layout.scss            # topbar, sidebar, footer, TOC/reading bars, FAB, banner
  components.scss        # buttons, cards, code blocks, home, palette, content
  utilities.scss         # shared keyframes, fade-in, line-clamp, copy flash
render.yaml              # Render blueprint (buildCommand uses npm run render:build)
```

## Commands

| Command             | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Dev server                                         |
| `npm run build`     | Production build → `out/` (postbuild copies to root too) |
| `npm run start`     | Serve `out/` locally (`npx serve`)                 |
| `npm run render:build` | Explicit CI-style build (export + copy to root) |

Note: the `lint` script uses `next lint`, which Next 16 removed — ESLint isn't wired up
in this repo yet. Verification is `npm run build` + manual checks.

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
  (see the injected code-block copy button in `pages/modules/[id].js`).
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
| Invisible controls in dark mode           | Missing `.dark` override or insufficient contrast (see `module-card__title` history) |
| Programmatic scroll jumps to wrong place  | Must use `lib/scroll.js` (lenis.scrollTo) — raw `window.scrollTo` gets overridden by Lenis |
| Wheel over sidebar scrolls the page       | Missing `data-lenis-prevent` on the inner scroller       |
| Centered element drifts off-center        | `transform`-based centering + keyframe animation conflict (cookie banner) — use `mx-auto` |
| Truncated text overflows its row          | `truncate` needs block-level elements (inline `<span>`s overflow) |
| Reveal content invisible without JS       | Reveal hidden state must stay gated on `html.js` (set in `_document.js`) |
