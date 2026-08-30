// Pure heading-slug helpers shared by the build-time content extractor
// (lib/content-meta.js, used in getStaticProps) and the runtime DOM pass
// (pages/modules/[id].js) so that palette/TOC anchor ids always match.

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "")
    .replace(/&[a-z]+;|&#\d+;/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Given heading texts in document order, returns deterministic unique ids:
// "summary", "summary-2", … Mirrors the counter logic used at runtime.
export function assignHeadingIds(texts) {
  const used = new Map();
  return texts.map((text) => {
    let base = slugify(text) || "section";
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  });
}
