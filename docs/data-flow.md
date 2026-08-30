# Data Flow

Four independent flows power the site. None of them touch a server.

## 1. Design Tokens → Styles

```mermaid
flowchart LR
    J["config/theme.json<br/>(single source of truth)"] --> T["tailwind.config.js<br/>maps tokens to color/font keys"]
    T --> U["Utility classes<br/>text-primary · bg-darkmode-body …"]
    J -->|read at build time| S["styles/*.scss<br/>theme(&quot;colors…&quot;) references"]
```

Change a value in `theme.json`, rebuild, and every component referencing the token updates. Never hardcode colors in JSX.

## 2. Module Metadata → Pages

```mermaid
flowchart TD
    M["data/modules.js<br/>MODULES array (id, title, icon, desc)"] --> P["getStaticPaths<br/>one route per module"]
    M --> Q["getStaticProps<br/>id · readMinutes · headings · searchIndex"]
    Q --> R["pages/modules/[id].js"]
    R -->|"moduleComponents map"| DI["dynamic import()<br/>components/modules/&lt;Name&gt;.js"]
    DI --> DOM["client DOM pass: anchor ids · .table-wrap ·<br/>.summary-section · copy buttons"]
```

Adding a module means touching **three** places — see [Content Guide](content-guide.md).

## 3. Progress Tracking (cookies)

```mermaid
flowchart TD
    BTN["'Mark as Complete' button<br/>pages/modules/[id].js"] -->|toggleComplete| CTX["ProgressContext.js<br/>reads/writes cookie"]
    CTX --> C1["Sidebar progress ring + checkmarks"]
    CTX --> C3["Home + Modules page stats"]
```

- Storage: a browser cookie holding completed module ids, plus localStorage for the
  module — no accounts, no server.
- Consumers read via `useProgress()` (`completed`, `total`, `isCompleted(id)`,
  `toggleComplete(id)`).

## 4. Theming

```mermaid
flowchart LR
    SW["ThemeSwitcher button"] -->|setTheme| NT["next-themes<br/>toggles .dark class on html"]
    NT --> CSS["SCSS .dark overrides<br/>+ html.dark icon visibility rules"]
    NT -.->|blocking script on load| NOPAINT["no flash of wrong theme"]
```

Both sun/moon icons render statically; CSS shows the right one for the current class, so there is never a mount flicker.

## Related

- [Architecture](architecture.md) — where these flows live in code
- [Styling & Theming](styling-and-theming.md) — how token styling is authored
