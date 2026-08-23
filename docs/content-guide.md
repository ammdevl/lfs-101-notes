# Content Guide

Everything about authoring and editing the course material itself.

## Anatomy of a Module

Each module is a single React component in `components/modules/` (e.g. `LinuxHistory.js`). The body is course content: headings, paragraphs, tables, terminal code blocks, and figures.

### The Three Registration Points

A module exists only if it is registered in **all three** places:

1. **`components/modules/<Name>.js`** — the content component itself
2. **`data/modules.js`** — metadata entry (`id`, `title`, `icon`, `desc`); the array order defines sidebar/homepage ordering
3. **`pages/modules/[id].js`** — entry in the `moduleComponents` dynamic-import map

Miss one and you get either a 404 route, an empty sidebar entry, or a "Module not found" page.

## Images

- All images live in `public/src/`.
- They are referenced with URLs starting `/src/…` — Next serves `public/` at the site root, so `public/src/image 5.png` becomes `/src/image 5.png`.
- Filenames contain spaces → they must be URL-encoded in `src` attributes (`/src/image%205.png`).
- Always wrap images in the standard figure pattern:

```jsx
<figure>
  <a href="/src/image%205.png" aria-label="Descriptive label">
    <img src="/src/image%205.png" alt="What the screenshot shows" />
  </a>
  <figcaption>Caption text</figcaption>
</figure>
```

The link opens the full-size image; the caption explains it. Centering and hover styling are handled globally in `styles/components.scss`.

## Terminal Code Blocks

macOS-style blocks are plain markup (no component needed inside module content):

```html
<div class="code-block">
  <div class="code-block__header">
    <span class="code-block__title">user@lfs101: ~</div>
  </div>
  <pre><code><span class="term-cmd">$ ls -la</span></code></pre>
</div>
```

Color classes: `term-cmd` (green commands), `term-out` (output), `term-comment` (gray).

> The interactive copy button belongs to the `<CodeBlock />` layout component used outside generated content; static module blocks don't need one.

## Summary Sections

After a module page mounts, a DOM pass finds every `<h3>` reading exactly **"Summary"** and wraps it — plus everything after it — in a `.summary-section` container that gets special styling. So: just write `<h3>Summary</h3>` as the last heading; no wrapper markup needed.

## Editing Checklist

- [ ] Content updated in `components/modules/<Name>.js`
- [ ] New images added to `public/src/` and referenced as `/src/image%20N.png`
- [ ] If renaming/reordering: `data/modules.js` order + ids updated
- [ ] `npm run build` passes and `out/modules/<id>/index.html` contains your change
