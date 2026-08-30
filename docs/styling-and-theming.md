# Styling & Theming

## Layered SCSS Architecture

`styles/style.scss` is the entry point. Tailwind directives come first, then the project's partials — each wrapped in a Tailwind `@layer` so utilities can always override component styles:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base       { @import "base";       }  /* reset, typography, links, focus, reveal */
@layer components { @import "components"; }  /* buttons, cards, code, content, home, palette */
                  { @import "layout";     }  /* topbar, sidebar, footer, FAB, overlays */
@layer utilities  { @import "utilities";  }  /* keyframes, fade-in, line-clamp */
```

| File | Owns |
|------|------|
| `base.scss` | Reset, display headings, links + underline exclusion list, focus rings, `color-scheme`, reduced-motion, scroll-reveal primitives, `.gradient-text`, `.kbd` |
| `layout.scss` | Glass topbar (Tux brand, ⌘K search, GitHub link; navbar inset only on wide pages), sidebar drawer, footer, breadcrumb, reading-progress bar, progress rings, scroll FAB (with SVG ring) |
| `components.scss` | Buttons, cards, module cards, code blocks (+ injected copy button), module-content typography, home hero/terminal/bento/outline/steps, modules toolbar + filters, command palette |
| `utilities.scss` | Shared keyframes (`fade-up`, `shimmer`, `blink`, `pop`, …), page fade-in, line-clamp, copy flash |

**Naming:** BEM-ish classes per component (`.topbar__brand`, `.course-sidebar__link`, `.module-card__title`). Tailwind utilities in JSX are for one-off layout only.

## Design Tokens

All colors/fonts/sizes flow from `config/theme.json` through `tailwind.config.js`. Two full palettes exist side by side:

- `text-*`, `primary` (indigo `#4f46e5`), `accent` (violet `#7c3aed`), `success` (emerald), `body`, `border`, `code-inline`, … — light mode
- `darkmode-*` — the mirrored dark palette

Tailwind also exposes `font-display` (Space Grotesk — headings/brand), `font-primary` (Atkinson Hyperlegible — body), `font-secondary` (Inter — UI labels), `font-mono` (JetBrains Mono), plus `shadow-soft/lift/glow`, `bg-gradient-primary`, and animation utilities (`animate-fade-up`, `animate-shimmer`, …).

Use them via `theme("colors…")` in SCSS or utility classes; never hardcode hex values in JSX (SCSS may hardcode only derived values like rgba glows, with a comment).

## Dark Mode Rules

1. **Every** new visible surface needs an explicit `.dark` counterpart selector — e.g. `.dark .module-card { background: #101828; }`. (Regression class: `.module-card__title` once shipped without one and vanished on dark backgrounds.)
2. Dark-mode primary buttons use gradients with ≥4.5:1 contrast for white text (`#4f46e5 → #6d28d9`) and **brighten on hover** (the dark-UI convention).
3. The ThemeSwitcher's two icons are CSS-driven (`html.dark .theme-icon--sun`) so the correct one paints before hydration — do not reintroduce a mounted gate.
4. `html.dark` also sets `color-scheme: dark`, keeping native scrollbars/inputs consistent.

## Global Link Underline

`base.scss` underlines anchors on hover globally. Composite link-components are excluded from that rule by an explicit list (`.btn`, `.card`, `.module-card`, `.module-nav__card`, `.toc__link`, `.command-palette__item`, `.home-quick-link`, `.home-outline__item`, `.home-feature`, `.continue-card`, `.topbar__brand`, `.topbar__search-btn`, sidebar links, skip link).

If you add a new interactive card/link component, extend this list — otherwise its labels get underlined on hover.

## Motion System

- **Scroll reveal:** an inline script in `_document.js` adds `html.js`. `ScrollReveal` (`components/ScrollReveal.js`) marks children `.reveal`; a hidden initial state applies **only under `html.js`** (no-JS renders stay visible), and an IntersectionObserver adds `.is-visible` when in view. Stagger via the `delay` prop (`--reveal-delay`). Reduced motion forces everything visible.
- **Count-up:** `components/CountUp.js` renders the final value for SSR/no-JS, then animates 0 → value when in view.
- **Lenis** drives window smooth scrolling. Programmatic jumps MUST go through `lenis.scrollTo()` (`lib/scroll.js` helpers) — raw `window.scrollTo()`/`scrollIntoView()` get overridden by Lenis's animation loop. Elements that scroll internally (sidebar nav, palette results) carry `data-lenis-prevent` so wheel events don't bleed to the page.
- Global `prefers-reduced-motion` neutralizes all animation/transition durations.

## Common Pitfalls

- Images center with `margin-inline: auto`, **not** `text-align: center` — Tailwind preflight makes `img` block-level.
- Prefer transitions on specific properties (`transition-colors duration-normal`); the reduced-motion media query neutralizes them automatically.
- Don't put `transform`-based centering (e.g. `-translate-x-1/2`) on elements that also run `transform` keyframe animations — the animation's final transform overrides the centering (this broke the cookie banner once). Use `left-0 right-0 mx-auto` instead.
- `truncate`/line-clamp need block-level elements; inline `<span>`s silently overflow (bit the footer links and palette results once).
- Module content HTML blobs are invisible to Tailwind's content scanner — anything used only there must be plain SCSS.
