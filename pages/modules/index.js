import Base from "@layouts/Base";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";

const ModulesPage = () => {
  const { completed, isCompleted } = useProgress();
  const pct = MODULES.length ? Math.round((completed / MODULES.length) * 100) : 0;

  return (
    <Base title="Modules" description="All 17 LFS101 course modules — Linux history, command line, files, processes, networking, scripting, and security." showProgress>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb__parent">Home</Link>
        <span className="breadcrumb__sep" aria-hidden="true">/</span>
        <span className="breadcrumb__current" aria-current="page">Modules</span>
      </nav>

      <h1>
        Introduction to Linux{" "}
        <span className="modules-subtitle">LFS101 Notes</span>
      </h1>
      <p className="modules-desc">
        Personal study notes from the <strong>&quot;Introduction to Linux&quot; (LFS101)</strong> course by the Linux Foundation.
        Use these notes alongside the official course material.
      </p>

      <div className="modules-progress-card">
        <div className="modules-progress-header">
          <span className="modules-progress-label">Your Progress</span>
          <span className="modules-progress-value">
            {completed}/{MODULES.length} modules ({pct}%)
          </span>
        </div>
        <div className="progress-bar" style={{ width: "100%", height: "8px" }} role="progressbar" aria-valuenow={completed} aria-valuemin="0" aria-valuemax={MODULES.length} aria-label="Course progress">
          <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="dashboard-grid">
        {MODULES.map((m, i) => {
          const done = isCompleted(m.id);
          return (
            <Link
              key={m.id}
              href={`/modules/${m.id}/`}
              className="card"
              aria-label={`${m.title}${done ? " (completed)" : ""}`}
            >
              <div className="module-card-header">
                <span className="module-card-icon" aria-hidden="true">{m.icon}</span>
                <span className="module-card-num">Module {i + 1}</span>
                {done && (
                  <span className="module-card-done">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Done
                  </span>
                )}
              </div>
              <div className="card__title">{m.title}</div>
              <div className="card__desc">{m.desc}</div>
            </Link>
          );
        })}
      </div>

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

export default ModulesPage;
