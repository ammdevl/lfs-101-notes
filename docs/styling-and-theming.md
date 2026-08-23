# Styling & Theming

## Layered SCSS Architecture

`styles/style.scss` is the entry point. Tailwind directives come first, then the project's partials — each wrapped in a Tailwind `@layer` so utilities can always override component styles:

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base       { @import "base";       }  /* reset, typography, links, focus */
@layer components { @import "components"; }  /* cards, buttons, code, content   */
                  { @import "layout";     }  /* topbar, sidebar, footer          */
@layer utilities  { @import "utilities";  }  /* animations, line-clamp           */
```

| File | Owns |
|------|------|
| `base.scss` | Reset, headings, link rules + underline exclusion list, focus rings, `color-scheme`, reduced-motion |
| `layout.scss` | Topbar, sidebar drawer, footer, breadcrumb, scroll FAB, cookie banner, theme icons |
| `components.scss` | Buttons, cards, code blocks, module-content typography, home-page sections |
| `utilities.scss` | Fade-in, line-clamp, copy flash animation |

**Naming:** BEM-ish classes per component (`.topbar__brand`, `.course-sidebar__link`, `.card__title`). Tailwind utilities in JSX are for one-off layout only.

## Design Tokens

All colors/fonts/sizes flow from `config/theme.json` through `tailwind.config.js`. Two full palettes exist side by side:

- `text-*`, `primary`, `body`, `border`, `code-inline`, … — light mode
- `darkmode-text-*`, `darkmode-primary`, … — dark mode

Use them via `theme("colors…")` in SCSS or utility classes; never hardcode hex values in JSX.

## Dark Mode Rules

1. **Every** new visible surface needs an explicit `.dark` counterpart selector — e.g. `.dark .card { @apply bg-darkmode-body border-darkmode-border; }`.
2. Dark-mode primary buttons use deep blue/green bases with ≥4.5:1 contrast and **brighten on hover** (the dark-UI convention).
3. The ThemeSwitcher's two icons are CSS-driven (`html.dark .theme-icon--sun`) so the correct one paints before hydration — do not reintroduce a mounted gate.
4. `html.dark` also sets `color-scheme: dark`, keeping native scrollbars/inputs consistent.

## Global Link Underline

`base.scss` underlines anchors on hover globally. Composite link-components are excluded from that rule by an explicit list:

```scss
.btn, .card, .home-quick-link, .topbar__brand,
.course-sidebar__link, .course-sidebar__brand,
.course-sidebar__home-btn, .skip-link { … text-decoration: none; }
```

If you add a new interactive card/link component, extend this list — otherwise its labels get underlined on hover.

## Common Pitfalls

- Images center with `margin-inline: auto`, **not** `text-align: center` — Tailwind preflight makes `img` block-level.
- Prefer transitions on specific properties (`transition-colors duration-normal`); the reduced-motion media query neutralizes them automatically.
