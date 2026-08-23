import { useRouter } from "next/router";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { isCompleted, completed, total } = useProgress();
  const activeId = router.query.id;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      <aside className={`course-sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="course-sidebar__header">
          <div className="course-sidebar__progress-text">
            {completed}/{total} complete
          </div>
        </div>

        <nav className="course-sidebar__nav">
          {MODULES.map((m, i) => {
            const done = isCompleted(m.id);
            return (
              <Link
                key={m.id}
                href={`/modules/${m.id}/`}
                className={`course-sidebar__link ${activeId === m.id ? "active" : ""}`}
                onClick={onClose}
              >
                <span className="course-sidebar__link-num">{i + 1}</span>
                <span>{m.title}</span>
                {done && (
                  <span className="course-sidebar__link-check" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
