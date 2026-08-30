// Build-time content metadata extraction.
// IMPORTANT: import only from getStaticProps code paths — this module uses
// Node fs and must never reach the client bundle.

import fs from "fs";
import path from "path";
import MODULES from "@data/modules";
import { assignHeadingIds } from "@lib/slugify";

const COMPONENTS_DIR = path.join(process.cwd(), "components", "modules");

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&mdash;": "\u2014",
  "&ndash;": "\u2013",
  "&middot;": "\u00b7",
  "&copy;": "\u00a9",
};

function decodeEntities(text) {
  return text
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp|mdash|ndash|middot|copy);/g, (m) => ENTITIES[m] || m);
}

function stripTags(html, replacement = " ") {
  return decodeEntities(String(html).replace(/<[^>]+>/g, replacement));
}

// Pull the big dangerouslySetInnerHTML template literal out of a module
// component source file. All 17 modules render their content this way.
function extractHtml(source) {
  const match = source.match(/dangerouslySetInnerHTML=\{\{\s*__html:\s*`([\s\S]*?)`\s*\}\}/);
  return match ? match[1] : "";
}

function pascalCase(id) {
  return id.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

// Reads every module component, returns:
// { [moduleId]: { words, readMinutes, headings: [{ text, id }] } }
// Heading ids are computed with the same slugify + dedupe the runtime DOM
// pass applies, so anchor links stay stable across build/runtime.
export function getModulesMeta() {
  const meta = {};
  for (const mod of MODULES) {
    const file = path.join(COMPONENTS_DIR, `${pascalCase(mod.id)}.js`);
    let html = "";
    try {
      html = extractHtml(fs.readFileSync(file, "utf8"));
    } catch {
      html = "";
    }

    const words = stripTags(html).split(/\s+/).filter(Boolean).length;
    const headingTexts = [];
    const h3Re = /<h3[^>]*>([\s\S]*?)<\/h3>/g;
    let m;
    while ((m = h3Re.exec(html)) !== null) {
      // "" replacement mimics textContent so build-time slugs match the
      // runtime DOM pass exactly (tags glued to words don't gain spaces).
      const text = stripTags(m[1], "").replace(/\s+/g, " ").trim();
      if (text) headingTexts.push(text);
    }
    const ids = assignHeadingIds(headingTexts);

    meta[mod.id] = {
      words,
      readMinutes: Math.max(1, Math.round(words / 200)),
      headings: headingTexts.map((text, i) => ({ text, id: ids[i] })),
    };
  }
  return meta;
}

// Flattens modules + meta into the client-side search index consumed by the
// ⌘K command palette (registered via SearchContext on each page).
export function getSearchIndex(meta = getModulesMeta()) {
  return MODULES.map((mod) => ({
    id: mod.id,
    title: mod.title,
    icon: mod.icon,
    desc: mod.desc,
    readMinutes: meta[mod.id]?.readMinutes ?? null,
    sections: meta[mod.id]?.headings ?? [],
  }));
}
