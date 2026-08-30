import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Base from "@layouts/Base";
import Sidebar from "@layouts/components/Sidebar";
import { useProgress } from "@components/ProgressContext";
import { useRegisterSearchIndex } from "@components/SearchContext";
import MODULES from "@data/modules";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useLenis } from "lenis/react";
import { getModulesMeta, getSearchIndex } from "@lib/content-meta";
import { scrollToTarget } from "@lib/scroll";

/* ---------- helpers ---------- */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONFETTI_COLORS = ["#4f46e5", "#7c3aed", "#a855f7", "#34d399", "#818cf8"];

function fireCompletionConfetti(allDone) {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
  });
  if (allDone) {
    setTimeout(
      () => confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: CONFETTI_COLORS, disableForReducedMotion: true }),
      250
    );
    setTimeout(
      () => confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: CONFETTI_COLORS, disableForReducedMotion: true }),
      420
    );
  }
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.cssText = "position:fixed;left:-9999px;";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
}

/* Inject a copy button into every static terminal block's header and fix
   the dot markup: the source HTML uses self-closing <span/>s which HTML
   parsing nests (so only one dot paints), and there is no wrapper. Rebuilds
   a proper .code-block__dots group. Idempotent. */
function injectCopyButtons(container) {
  container.querySelectorAll(".code-block__header").forEach((header) => {
    if (!header.querySelector(".code-block__dots")) {
      header.querySelectorAll(".code-block__dot").forEach((dot) => dot.remove());
      const dots = document.createElement("div");
      dots.className = "code-block__dots";
      dots.innerHTML =
        '<span class="code-block__dot code-block__dot--close"></span>' +
        '<span class="code-block__dot code-block__dot--min"></span>' +
        '<span class="code-block__dot code-block__dot--max"></span>';
      header.prepend(dots);
    }
  });

  container.querySelectorAll(".code-block__header").forEach((header) => {
    if (header.querySelector(".code-block__copy")) return;

    const btn = document.createElement("button");
    btn.className = "code-block__copy";
    btn.type = "button";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.innerHTML =
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>Copy</span>';

    btn.addEventListener("click", async () => {
      const block = btn.closest(".code-block");
      const code = block?.querySelector("pre code") || block?.querySelector("pre");
      const text = String(code?.textContent || "")
        .split("\n")
        .map((line) => line.replace(/^\$\s/, ""))
        .join("\n")
        .replace(/\s+$/, "");

      try {
        await copyText(text);
      } catch {
        // clipboard unavailable — nothing else to try
      }

      const label = btn.querySelector("span");
      btn.classList.add("copied");
      if (label) label.textContent = "Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        if (label) label.textContent = "Copy";
      }, 2000);

      const announcer = document.getElementById("sr-announcer");
      if (announcer) announcer.textContent = "Code copied to clipboard";
    });

    header.appendChild(btn);
  });
}

/* ---------- dynamic import map ---------- */

const moduleComponents = {
  "linux-history": () => import("@components/modules/LinuxHistory"),
  "linux-philosophy": () => import("@components/modules/LinuxPhilosophy"),
  "linux-families": () => import("@components/modules/LinuxFamilies"),
  "linux-basics": () => import("@components/modules/LinuxBasics"),
  "gui": () => import("@components/modules/Gui"),
  "command-line": () => import("@components/modules/CommandLine"),
  "documentation": () => import("@components/modules/Documentation"),
  "processes": () => import("@components/modules/Processes"),
  "file-operations": () => import("@components/modules/FileOperations"),
  "text-editors": () => import("@components/modules/TextEditors"),
  "user-environment": () => import("@components/modules/UserEnvironment"),
  "manipulating-text": () => import("@components/modules/ManipulatingText"),
  "network-operations": () => import("@components/modules/NetworkOperations"),
  "bash-scripting": () => import("@components/modules/BashScripting"),
  "bash-advanced": () => import("@components/modules/BashAdvanced"),
  "printing": () => import("@components/modules/Printing"),
  "security": () => import("@components/modules/Security"),
};

export async function getStaticPaths() {
  const paths = MODULES.map((m) => ({
    params: { id: m.id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const meta = getModulesMeta();
  const moduleMeta = meta[params.id] || { readMinutes: 5, headings: [] };
  return {
    props: {
      id: params.id,
      readMinutes: moduleMeta.readMinutes,
      headings: moduleMeta.headings,
      searchIndex: getSearchIndex(meta),
    },
  };
}

const ModulePage = ({ id, readMinutes, headings, searchIndex }) => {
  const router = useRouter();
  const lenis = useLenis();
  const { isCompleted, toggleComplete, completed } = useProgress();
  useRegisterSearchIndex(searchIndex);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ModuleComponent, setModuleComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const moduleData = MODULES.find((m) => m.id === id);
  const currentIndex = MODULES.findIndex((m) => m.id === id);
  const prevModule = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;
  const isComplete = id ? isCompleted(id) : false;

  useEffect(() => {
    if (!id || !moduleComponents[id]) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setModuleComponent(null);

    moduleComponents[id]().then((mod) => {
      setModuleComponent(() => mod.default);
      setLoading(false);
    });
  }, [id]);

  // DOM post-processing pass: anchor ids, table wraps, summary sections,
  // and copy buttons on terminal blocks. Idempotent; re-runs (bounded) if the
  // DOM is re-created, and retries until the content container exists so
  // background-tab timer throttling can't strand it half-done.
  useEffect(() => {
    if (loading || !ModuleComponent) return undefined;

    let cancelled = false;
    let attempts = 0;
    let stableChecks = 0;
    let didHashScroll = false;

    const runPass = () => {
      if (cancelled) return;
      const container = document.querySelector(".module-content");
      if (!container) {
        if (attempts++ < 30) setTimeout(runPass, 100);
        return;
      }

      // Anchor ids from the build-time heading list (same order & slug logic)
      container.querySelectorAll("h3").forEach((h3, i) => {
        if (headings[i]) h3.id = headings[i].id;
      });

      // Wrap tables for horizontal scrolling on small screens
      container.querySelectorAll("table").forEach((table) => {
        if (table.closest(".table-wrap")) return;
        const wrap = document.createElement("div");
        wrap.className = "table-wrap";
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      });

      container.querySelectorAll("h3").forEach((h3) => {
        if (h3.textContent.trim() !== "Summary") return;
        if (h3.closest(".summary-section")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "summary-section";
        h3.parentNode.insertBefore(wrapper, h3);
        wrapper.appendChild(h3);

        // Collect all sibling elements after the h3
        let sibling = wrapper.nextSibling;
        while (sibling) {
          const next = sibling.nextSibling;
          wrapper.appendChild(sibling);
          sibling = next;
        }
      });

      // Copy buttons on every terminal block
      injectCopyButtons(container);

      // Honor a deep link like /modules/command-line/#some-section (once)
      if (window.location.hash && !didHashScroll) {
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (target) {
          // let layout/paint settle, then scroll via Lenis
          setTimeout(() => scrollToTarget(lenis, target, prefersReducedMotion()), 60);
          didHashScroll = true;
        }
      }

      // Verify the decorations stuck; if the DOM was re-created (hydration
      // fallback, raced re-render), re-apply for a bounded window.
      const needsWork =
        (container.querySelector(".code-block__header") && !container.querySelector(".code-block__copy")) ||
        (headings.length > 0 && ![...container.querySelectorAll("h3")].some((h) => h.id));
      if (needsWork && attempts < 30) {
        attempts += 1;
        setTimeout(runPass, 200);
      } else if (!needsWork && stableChecks < 8) {
        // Keep watching briefly for late DOM re-creation
        stableChecks += 1;
        setTimeout(runPass, 350);
      }
    };

    const timer = setTimeout(runPass, 50);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, ModuleComponent]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "ArrowLeft" && prevModule) {
        e.preventDefault();
        router.push(`/modules/${prevModule.id}/`);
      }
      if (e.altKey && e.key === "ArrowRight" && nextModule) {
        e.preventDefault();
        router.push(`/modules/${nextModule.id}/`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevModule, nextModule, router]);

  const handleToggleComplete = () => {
    const wasComplete = isComplete;
    toggleComplete(id);
    if (!wasComplete) {
      const allDone = completed === MODULES.length - 1;
      fireCompletionConfetti(allDone);
      const announcer = document.getElementById("sr-announcer");
      if (announcer) {
        announcer.textContent = allDone
          ? "All 17 modules complete. Congratulations!"
          : "Module marked as complete";
      }
    }
  };

  if (!id) return null;

  const sidebarEl = <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />;

  return (
    <Base
      title={moduleData?.title}
      description={moduleData?.desc}
      showReadingProgress
      sidebar={sidebarEl}
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    >
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb__parent">Home</Link>
        <span className="breadcrumb__sep" aria-hidden="true">/</span>
        <Link href="/modules/" className="breadcrumb__parent">Modules</Link>
        <span className="breadcrumb__sep" aria-hidden="true">/</span>
        <span className="breadcrumb__current" aria-current="page">
          {moduleData?.title || id}
        </span>
      </nav>

      {/* Meta row */}
      {!loading && ModuleComponent && (
        <div className="module-meta">
              <span className="module-meta__chip">
                Module {currentIndex + 1} of {MODULES.length}
              </span>
              <span className="module-meta__chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {readMinutes} min read
              </span>
              {isComplete && (
                <span className="module-meta__chip module-meta__chip--done">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
          )}

          {/* Module content */}
          {loading ? (
            <div className="loading-state" role="status" aria-live="polite">
              <div className="skeleton skeleton-heading" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line--medium" />
              <div className="skeleton skeleton-line skeleton-line--short" />
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line--medium" />
              <span className="sr-only">Loading module...</span>
            </div>
          ) : ModuleComponent ? (
            <div className="module-content">
              <ModuleComponent />
            </div>
          ) : (
            <div>
              <h2>Module not found</h2>
              <p>Could not load module &quot;{id}&quot;.</p>
              <Link href="/" className="btn btn--primary mt-4 inline-flex">
                Back to Home
              </Link>
            </div>
          )}

          {/* Completion + module navigation */}
          {!loading && ModuleComponent && (
            <>
              <div className="mt-10 flex justify-center">
                <button
                  className={`btn ${isComplete ? "btn--ghost" : "btn--accent"} px-6 py-2.5`}
                  onClick={handleToggleComplete}
                  aria-pressed={isComplete}
                >
                  {isComplete ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Completed
                    </>
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
              </div>

              <div className="module-nav">
                {prevModule ? (
                  <Link href={`/modules/${prevModule.id}/`} className="module-nav__card">
                    <span className="module-nav__card-arrow module-nav__card-arrow--prev" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                    </span>
                    <span className="module-nav__card-body">
                      <span className="module-nav__card-label">Previous</span>
                      <span className="module-nav__card-title">{prevModule.title}</span>
                    </span>
                  </Link>
                ) : (
                  <span aria-hidden="true" />
                )}

                {nextModule ? (
                  <Link href={`/modules/${nextModule.id}/`} className="module-nav__card module-nav__card--next">
                    <span className="module-nav__card-body">
                      <span className="module-nav__card-label">Next</span>
                      <span className="module-nav__card-title">{nextModule.title}</span>
                    </span>
                    <span className="module-nav__card-arrow module-nav__card-arrow--next" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  <Link href="/modules/" className="module-nav__card module-nav__card--next">
                    <span className="module-nav__card-body">
                      <span className="module-nav__card-label">Finish</span>
                      <span className="module-nav__card-title">All Modules</span>
                    </span>
                    <span className="module-nav__card-arrow module-nav__card-arrow--next" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </Link>
                )}

                <p className="module-nav__hint">
                  <span className="kbd">Alt</span>
                  <span className="kbd">←</span>
                  <span className="kbd">→</span>
                  to move between modules
                </p>
              </div>
            </>
          )}

          {/* Attribution */}
          {!loading && ModuleComponent && (
            <div className="attribution" style={{ marginTop: "2rem" }}>
              These notes are based on the original{" "}
              <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
                <strong>&quot;Introduction to Linux&quot; (LFS101)</strong>
              </a>{" "}
              course by the Linux Foundation.
            </div>
          )}
    </Base>
  );
};

export default ModulePage;
