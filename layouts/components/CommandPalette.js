import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useLenis } from "lenis/react";
import { useSearchContext } from "@components/SearchContext";
import { scrollToTarget } from "@lib/scroll";

/**
 * ⌘K command palette. Searches module titles/descriptions and their
 * section headings (build-time index from lib/content-meta.js).
 * Sections deep-link to /modules/<id>/#<section-id>; the module page's
 * runtime pass assigns matching ids to the DOM headings.
 */

const MAX_MODULE_RESULTS = 6;
const MAX_SECTION_RESULTS = 8;

function normalize(text) {
  return String(text).toLowerCase().replace(/\s+/g, " ").trim();
}

function buildResults(index, query) {
  const q = normalize(query);
  const modules = [];
  const sections = [];

  for (const mod of index) {
    const title = normalize(mod.title);
    const desc = normalize(mod.desc || "");
    const matchesModule = !q || title.includes(q) || desc.includes(q);

    if (matchesModule) {
      modules.push({
        key: `mod-${mod.id}`,
        type: "module",
        icon: mod.icon,
        title: mod.title,
        sub: mod.desc || "",
        href: `/modules/${mod.id}/`,
      });
    }

    if (q) {
      for (const section of mod.sections || []) {
        if (normalize(section.text).includes(q)) {
          sections.push({
            key: `sec-${mod.id}-${section.id}`,
            type: "section",
            icon: "¶",
            title: section.text,
            sub: mod.title,
            href: `/modules/${mod.id}/#${section.id}`,
          });
        }
      }
    }

    if (modules.length >= MAX_MODULE_RESULTS && sections.length >= MAX_SECTION_RESULTS) break;
  }

  return { modules: modules.slice(0, MAX_MODULE_RESULTS), sections: sections.slice(0, MAX_SECTION_RESULTS) };
}

const CommandPalette = ({ open, onClose }) => {
  const router = useRouter();
  const lenis = useLenis();
  const { index } = useSearchContext();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const { modules, sections } = useMemo(() => buildResults(index, query), [index, query]);
  const flat = useMemo(() => [...modules, ...sections], [modules, sections]);

  // Reset + focus on open; restore focus on close
  useEffect(() => {
    if (!open) return undefined;
    restoreFocusRef.current = document.activeElement;
    setQuery("");
    setActiveIndex(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      clearTimeout(timer);
      if (restoreFocusRef.current instanceof HTMLElement) restoreFocusRef.current.focus();
    };
  }, [open]);

  // Announce result counts to screen readers
  useEffect(() => {
    if (!open) return;
    const announcer = document.getElementById("sr-announcer");
    if (announcer) {
      const count = flat.length;
      announcer.textContent = count
        ? `${count} search ${count === 1 ? "result" : "results"} available`
        : "No search results";
    }
  }, [open, flat.length]);

  const goTo = useCallback(
    (item) => {
      if (!item) return;
      onClose();
      const hash = item.href.includes("#") ? item.href.split("#")[1] : null;
      const currentId = router.query.id;
      const targetId = item.href.split("/")[2];

      if (hash && currentId === targetId) {
        // Already on the module page — scroll straight to the section
        scrollToTarget(
          lenis,
          document.getElementById(hash),
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
      } else {
        router.push(item.href);
        if (hash) {
          setTimeout(() => {
            scrollToTarget(
              lenis,
              document.getElementById(hash),
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            );
          }, 350);
        }
      }
    },
    [onClose, router, lenis]
  );

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      goTo(flat[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // Minimal focus trap: keep Tab cycling inside the panel
      const focusables = panelRef.current?.querySelectorAll("input, button");
      if (!focusables?.length) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Keep the highlighted item in view while arrowing through results
  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector(`[data-item-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!open) return null;

  let itemIndex = -1;

  return (
    <div className="command-palette" onKeyDown={onKeyDown}>
      <div className="command-palette__overlay" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className="command-palette__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Search modules and sections"
      >
        <div className="command-palette__input-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="command-palette__input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-results"
            aria-activedescendant={flat[activeIndex] ? `cmd-item-${activeIndex}` : undefined}
            placeholder="Search modules and sections…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-label="Search modules and sections"
          />
          <button className="kbd" onClick={onClose} aria-label="Close search">
            esc
          </button>
        </div>

        <div
          className="command-palette__results"
          id="command-palette-results"
          role="listbox"
          aria-label="Search results"
          data-lenis-prevent
        >
          {!index.length ? (
            <p className="command-palette__empty">Search index not loaded yet.</p>
          ) : !flat.length ? (
            <p className="command-palette__empty">No results for “{query}”.</p>
          ) : (
            <>
              {modules.length > 0 && (
                <p className="command-palette__group-label" role="presentation">Modules</p>
              )}
              {modules.map((item) => {
                itemIndex += 1;
                const i = itemIndex;
                return (
                  <button
                    key={item.key}
                    id={`cmd-item-${i}`}
                    data-item-index={i}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`command-palette__item ${i === activeIndex ? "active" : ""}`}
                    onClick={() => goTo(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <span className="command-palette__item-icon" aria-hidden="true">{item.icon}</span>
                    <span className="command-palette__item-text">
                      <span className="command-palette__item-title">{item.title}</span>
                      <span className="command-palette__item-sub">{item.sub}</span>
                    </span>
                  </button>
                );
              })}
              {sections.length > 0 && (
                <p className="command-palette__group-label" role="presentation">Sections</p>
              )}
              {sections.map((item) => {
                itemIndex += 1;
                const i = itemIndex;
                return (
                  <button
                    key={item.key}
                    id={`cmd-item-${i}`}
                    data-item-index={i}
                    role="option"
                    aria-selected={i === activeIndex}
                    className={`command-palette__item ${i === activeIndex ? "active" : ""}`}
                    onClick={() => goTo(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <span className="command-palette__item-icon" aria-hidden="true">{item.icon}</span>
                    <span className="command-palette__item-text">
                      <span className="command-palette__item-title">{item.title}</span>
                      <span className="command-palette__item-sub">{item.sub}</span>
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        <div className="command-palette__footer">
          <span className="inline-flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="kbd">↵</span> open
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="kbd">esc</span> close
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
