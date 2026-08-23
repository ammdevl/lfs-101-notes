import { useRouter } from "next/router";
import { useEffect } from "react";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { isCompleted, completed, total } = useProgress();
  const activeId = router.query.id;

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

      <aside id="course-sidebar" className={`course-sidebar ${isOpen ? "open" : "closed"}`} aria-label="Course modules">
        <div className="course-sidebar__header">
          <div className="course-sidebar__progress-text">
            {completed}/{total} complete
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
                <span>{m.title}</span>
                {done && (
                  <span className="course-sidebar__link-check" aria-label="(completed)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
