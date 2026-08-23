import ThemeSwitcher from "./ThemeSwitcher";
import ProgressTracker from "./ProgressTracker";
import Link from "next/link";

const Header = ({ showProgress = false, showSidebarToggle = false, sidebarOpen, onToggleSidebar, inset = false }) => {
  return (
    <header className={`topbar ${inset ? "topbar--inset" : ""}`}>
      {showSidebarToggle && (
        <button
          className="topbar__sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="course-sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      )}
      <Link href="/" className="topbar__brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
        <span>LFS101 Notes</span>
      </Link>
      <div className="topbar__spacer" />
      <div className="topbar__actions">
        {showProgress && <ProgressTracker />}
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;
