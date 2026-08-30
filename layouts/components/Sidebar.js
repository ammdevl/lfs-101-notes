import { useRouter } from "next/router";
import { useEffect } from "react";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";

const RING_R = 10;
const RING_C = 2 * Math.PI * RING_R;

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { isCompleted, completed, total } = useProgress();
  const activeId = router.query.id;
  const offset = total ? RING_C * (1 - completed / total) : RING_C;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // On mobile the drawer overlays the page, so close it after navigating.
  // On desktop keep it open so users can hop between modules.
  const handleNavClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? "active" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="course-sidebar"
        className={`course-sidebar ${isOpen ? "open" : "closed"}`}
        aria-label="Course modules"
        data-lenis-prevent
      >
        <div className="course-sidebar__header">
          <p className="course-sidebar__eyebrow">Course content</p>
          <div className="course-sidebar__progress-row">
            <div
              className="progress-ring"
              role="progressbar"
              aria-valuenow={completed}
              aria-valuemin="0"
              aria-valuemax={total}
              aria-label={`Course progress: ${completed} of ${total} modules complete`}
            >
              <svg width="38" height="38" viewBox="0 0 30 30" aria-hidden="true">
                <defs>
                  <linearGradient id="sidebarRingGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <circle className="progress-ring__track" cx="15" cy="15" r={RING_R} strokeWidth="2.5" fill="none" opacity="0.5" />
                <circle
                  className="progress-ring__fill"
                  cx="15"
                  cy="15"
                  r={RING_R}
                  strokeWidth="2.5"
                  fill="none"
                  stroke="url(#sidebarRingGradient)"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={offset}
                />
              </svg>
              <span className="progress-ring__label text-[8px] text-white">
                {total ? Math.round((completed / total) * 100) : 0}%
              </span>
            </div>
            <p className="course-sidebar__progress-text">
              <strong>{completed} of {total}</strong>
              <br />
              modules complete
            </p>
          </div>
        </div>

        <nav className="course-sidebar__nav" aria-label="Modules">
          {MODULES.map((m, i) => {
            const done = isCompleted(m.id);
            const active = activeId === m.id;
            return (
              <Link
                key={m.id}
                href={`/modules/${m.id}/`}
                className={`course-sidebar__link ${active ? "active" : ""}`}
                onClick={handleNavClick}
                aria-current={active ? "page" : undefined}
              >
                <span className="course-sidebar__link-num" aria-hidden="true">{i + 1}</span>
                <span className="truncate">{m.title}</span>
                {done && (
                  <span className="course-sidebar__link-check" aria-label="(completed)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="course-sidebar__footer">
          <Link href="/" className="course-sidebar__home-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
