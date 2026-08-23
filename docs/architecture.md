# Architecture

The site has **no server**. Every page prerenders to plain HTML at build time; interactivity is client-side React hydrating on top of that HTML.

## Build-Time Pipeline

```mermaid
flowchart LR
    A["config/theme.json<br/>design tokens"] --> B["tailwind.config.js"]
    B --> C["styles/*.scss<br/>@layer base/components/utilities"]

    D["data/modules.js<br/>ids · titles · icons · order"] --> E["pages/modules/[id].js<br/>getStaticPaths / getStaticProps"]

    F["components/modules/*.js<br/>17 content files"] -->|dynamic import map| E

    E --> G["next build<br/>output: export"]
    C --> G
    G --> H["out/<br/>index.html · modules/&lt;id&gt;/index.html"]
    H -->|"postbuild hook:<br/>cp -r out/. ."| I["repo root copy<br/>(Render publish-dir safety net)"]
```

Key idea: `data/modules.js` is the single source of truth. The SSG loop enumerates it to generate one HTML file per module, and each module's JSX body is code-split through a dynamic-import map so visitors only download the page they open.

## Runtime Layout Shell

Every page renders inside `layouts/Base.js`:

```mermaid
flowchart TD
    APP["pages/_app.js providers"] --> T["ThemeProvider<br/>next-themes · class on &lt;html&gt;"]
    T --> P["ProgressProvider<br/>cookie-backed context"]
    P --> L["LenisProvider<br/>smooth scrolling"]
    L --> BASE["layouts/Base.js shell"]

    BASE --> SKIP["Skip link → main#content"]
    BASE --> SHELL[".app flex row"]

    SHELL -->|module pages only| SB["Sidebar<br/>fixed left drawer · 280px · full viewport height"]
    SHELL --> MAIN[".main (margin-left: 280px when sidebar open)"]

    MAIN --> TOP["Header / topbar 56px<br/>brand · progress tracker · theme switcher"]
    MAIN --> CONTENT["main#content<br/>.content → page children"]
    MAIN --> FOOT["Footer"]

    BASE -.-> CB["CookieBanner (first visit)"]
    BASE -.-> FAB["Scroll-to-top button"]
    BASE -.-> SR["#sr-announcer aria-live region"]
```

## Technology Choices

| Choice | Rationale |
|--------|-----------|
| Next.js Pages Router | Simple SSG with `getStaticPaths`/`getStaticProps`; App Router adds nothing for a pure-static site |
| `output: "export"` | Produces host-agnostic static files (`out/`) — deployable anywhere |
| Tailwind + SCSS partials | Utility classes for one-off layout; structured BEM-style SCSS for components |
| next-themes (`class` strategy) | Blocking inline script prevents flash-of-wrong-theme; CSS drives icon states |
| Cookie over localStorage | Keeps progress trivially portable without any storage permissions UI |

## Where Things Live

See the annotated directory map in [`AGENTS.md`](../AGENTS.md#directory-map).
