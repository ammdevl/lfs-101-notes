# Accessibility

Accessibility is a first-class feature here, not an afterthought. This page documents what is implemented and the standards to keep when contributing.

## Implemented Features

### Structure & Navigation
- **Skip link** — first focusable element, jumps to `<main id="content">`
- **Landmarks** — semantic `header`, `main`, `footer`, `nav` throughout
- **Sidebar drawer** — `aria-label` on nav and aside, active link gets `aria-current="page"`, closes on Escape, removed from tab order only after its slide-out animation finishes
- **Keyboard module navigation** — `Alt + ←/→` moves between previous/next modules
- **Command palette (⌘K)** — `role="dialog"` with `aria-modal`, combobox input wired to a listbox, `↑/↓/Enter/Esc` support, focus restore on close, and result counts announced through the live region

### Interactive Controls
- Toggle buttons carry `aria-label`, `aria-expanded`, and `aria-controls` (sidebar toggle → `#course-sidebar`)
- All icon-only controls (theme switcher, scroll-to-top) have text labels
- Visible `:focus-visible` rings on every interactive element, with light/dark variants
- Decorative SVGs are marked `aria-hidden="true"`

### Feedback & Announcements
- Async results are announced through a single polite live region: `<div id="sr-announcer" aria-live="polite">` — e.g. the code-block copy button announces "Code copied to clipboard"
- Loading states use `role="status"` with screen-reader-only text
- Progress indicators use proper `role="progressbar"` with value/min/max attributes

### Content
- Images require meaningful `alt` text; figures pair image links with captions
- Tables use `scope="col"` headers and captions where present
- External links use `rel="noopener"`

## Visual Standards

| Standard | Implementation |
|----------|----------------|
| WCAG AA contrast (≥4.5:1 body text) | Dark-mode primary button gradients keep white text ≥4.5:1 (≈6:1) and brighten on hover; accent surfaces switch to light-on-dark text |
| Theme consistency | `color-scheme: light/dark` keeps native scrollbars and inputs in sync |
| Motion sensitivity | Global `prefers-reduced-motion: reduce` rule neutralizes animations/transitions |
| Readability | Atkinson Hyperlegible body font; smooth scrolling via Lenis respects reduced motion |

## Checklist for New Work

When adding or changing UI:

- [ ] Keyboard operable, visible focus state
- [ ] Correct roles/ARIA (`aria-current`, `aria-expanded`, labels for icon buttons)
- [ ] Contrast verified in **both** light and dark mode
- [ ] Overlay behavior: Escape closes, focus not trapped accidentally
- [ ] Animations respect reduced motion
