import { useMemo, useState } from "react";
import Base from "@layouts/Base";
import ScrollReveal from "@components/ScrollReveal";
import CountUp from "@components/CountUp";
import { useRegisterSearchIndex } from "@components/SearchContext";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";
import { getModulesMeta, getSearchIndex } from "@lib/content-meta";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "todo", label: "In progress" },
  { id: "done", label: "Completed" },
];

const ModulesPage = ({ readMinutes, searchIndex }) => {
  const { completed, isCompleted } = useProgress();
  useRegisterSearchIndex(searchIndex);
  const total = MODULES.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const visible = useMemo(() => {
    const q = query.toLowerCase().replace(/\s+/g, " ").trim();
    return MODULES.map((m, i) => ({ ...m, num: i + 1 }))
      .filter((m) => {
        if (filter === "done" && !isCompleted(m.id)) return false;
        if (filter === "todo" && isCompleted(m.id)) return false;
        if (!q) return true;
        return (
          m.title.toLowerCase().includes(q) ||
          (m.desc || "").toLowerCase().includes(q)
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, completed]);

  const ringR = 24;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = total ? ringC * (1 - completed / total) : ringC;

  return (
    <Base title="Modules" description="All 17 LFS101 course modules — Linux history, command line, files, processes, networking, scripting, and security." wide>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb__parent">Home</Link>
        <span className="breadcrumb__sep" aria-hidden="true">/</span>
        <span className="breadcrumb__current" aria-current="page">Modules</span>
      </nav>

      <ScrollReveal>
        <h1>
          Course modules <span className="gradient-text">LFS101</span>
        </h1>
        <p className="modules-desc">
          Personal study notes from the <strong>&quot;Introduction to Linux&quot; (LFS101)</strong> course
          by the Linux Foundation. Search, filter, and work through them in order.
        </p>
      </ScrollReveal>

      {/* Progress summary */}
      <ScrollReveal delay={80}>
        <div className="modules-progress-card">
          <div
            className="progress-ring mr-1"
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin="0"
            aria-valuemax={total}
            aria-label={`Course progress: ${completed} of ${total} modules (${pct}%)`}
          >
            <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
              <defs>
                <linearGradient id="modulesRingGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <circle className="progress-ring__track" cx="28" cy="28" r={ringR} strokeWidth="3" fill="none" />
              <circle
                className="progress-ring__fill"
                cx="28"
                cy="28"
                r={ringR}
                strokeWidth="3"
                fill="none"
                stroke="url(#modulesRingGradient)"
                strokeLinecap="round"
                strokeDasharray={ringC}
                strokeDashoffset={ringOffset}
              />
            </svg>
            <span className="progress-ring__label text-xs">{pct}%</span>
          </div>
          <div className="modules-progress-header flex-1">
            <span className="modules-progress-label">Your progress</span>
            <span className="modules-progress-value">
              <CountUp value={completed} /> <span className="text-text-muted dark:text-darkmode-text-muted">/ {total} modules</span>
            </span>
            <div className="progress-bar mt-2" aria-hidden="true">
              <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Search + filters */}
      <div className="modules-toolbar">
        <div className="modules-search">
          <span className="modules-search__icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Filter modules…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter modules by title or description"
          />
        </div>
        <div className="modules-filters" role="group" aria-label="Filter by completion status">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`filter-chip ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {visible.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg font-semibold text-text-heading dark:text-darkmode-text-heading">No modules found</p>
          <p className="mt-1 text-text-secondary dark:text-darkmode-text-secondary">
            Try a different search term or filter.
          </p>
          <button
            className="btn btn--ghost mt-4"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="dashboard-grid">
          {visible.map((m, i) => {
            const done = isCompleted(m.id);
            return (
              <ScrollReveal key={m.id} delay={Math.min(i, 8) * 45} className="h-full">
                <Link href={`/modules/${m.id}/`} className="module-card h-full" aria-label={`${m.title}${done ? " (completed)" : ""}`}>
                  <div className="module-card__top">
                    <span className="module-card__tile" aria-hidden="true">{m.icon}</span>
                    <span className="module-card__num">Module {m.num}</span>
                    {done && (
                      <span className="module-card__done">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Done
                      </span>
                    )}
                  </div>
                  <div className="module-card__title">{m.title}</div>
                  <div className="module-card__desc">{m.desc}</div>
                  <div className="module-card__foot">
                    <span className="module-card__time">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {readMinutes[m.id] || 5} min read
                    </span>
                    <span className="module-card__arrow" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      )}

      <div className="attribution home-attribution">
        These notes are based on the original{" "}
        <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
          <strong>&quot;Introduction to Linux&quot; (LFS101)</strong>
        </a>{" "}
        course by the Linux Foundation.
      </div>
    </Base>
  );
};

export async function getStaticProps() {
  const meta = getModulesMeta();
  return {
    props: {
      readMinutes: Object.fromEntries(
        MODULES.map((m) => [m.id, meta[m.id]?.readMinutes ?? 5])
      ),
      searchIndex: getSearchIndex(meta),
    },
  };
}

export default ModulesPage;
