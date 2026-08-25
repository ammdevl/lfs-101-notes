import Base from "@layouts/Base";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";

const HomePage = () => {
  const { completed } = useProgress();
  const pct = MODULES.length ? Math.round((completed / MODULES.length) * 100) : 0;

  return (
    <Base topbarInset>
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1 className="home-hero__title">Introduction to Linux</h1>
        <p className="home-hero__subtitle">LFS101 Notes</p>
        <p className="home-hero__desc">
          Personal study notes from the <strong>&quot;Introduction to Linux&quot; (LFS101)</strong> course by the Linux Foundation.
          Use these notes alongside the official course material to reinforce your learning.
        </p>
        <div className="home-hero__actions">
          <Link href="/modules/" className="btn btn--primary">
            Browse Modules
          </Link>
          <Link href={`/modules/${MODULES[0].id}/`} className="btn btn--accent">
            Start Learning
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="home-stats">
        <div className="home-stat">
          <span className="home-stat__value">{MODULES.length}</span>
          <span className="home-stat__label">Modules</span>
        </div>
        <div className="home-stat">
          <span className="home-stat__value">{completed}</span>
          <span className="home-stat__label">Completed</span>
        </div>
        <div className="home-stat home-stat--progress">
          <span className="home-stat__value">{pct}%</span>
          <span className="home-stat__label">Progress</span>
          <div className="progress-bar mt-2" style={{ width: "100%" }} role="progressbar" aria-valuenow={completed} aria-valuemin="0" aria-valuemax={MODULES.length} aria-label="Course progress">
            <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* About the course */}
      <div className="home-section">
        <h2 className="home-section__title">About This Course</h2>
        <div className="home-about">
          <p>
            <strong>Introduction to Linux (LFS101)</strong> is a free, self-paced course offered by the{" "}
            <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
              Linux Foundation
            </a>
            . It covers everything you need to get started with Linux — from its history and philosophy to practical command-line skills, file management, networking, scripting, and security.
          </p>
          <p>
            Whether you&apos;re a developer, system administrator, or simply curious about open-source operating systems, this course provides a solid foundation. These notes summarize the key concepts from each module to help you review and retain what you&apos;ve learned.
          </p>
        </div>
      </div>

      {/* What you'll learn */}
      <div className="home-section">
        <h2 className="home-section__title">What You&apos;ll Learn</h2>
        <div className="home-features">
          <div className="home-feature">
            <span className="home-feature__icon">
              <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <polyline points="7 8 10 11 7 14" />
                <line x1="13" y1="14" x2="17" y2="14" />
              </svg>
            </span>
            <div>
              <strong>Command Line Mastery</strong>
              <p className="text-sm text-text-secondary">Navigate the filesystem, manage processes, and use pipes, redirection, and shell scripting.</p>
            </div>
          </div>
          <div className="home-feature">
            <span className="home-feature__icon">
              <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </span>
            <div>
              <strong>File &amp; Process Management</strong>
              <p className="text-sm text-text-secondary">Understand permissions, ownership, links, and how Linux manages processes and services.</p>
            </div>
          </div>
          <div className="home-feature">
            <span className="home-feature__icon">
              <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <div>
              <strong>Networking &amp; Security</strong>
              <p className="text-sm text-text-secondary">Configure networks, use SSH, manage firewalls, and apply local security principles.</p>
            </div>
          </div>
          <div className="home-feature">
            <span className="home-feature__icon">
              <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <div>
              <strong>Linux Ecosystem</strong>
              <p className="text-sm text-text-secondary">Explore distributions, desktop environments, package management, and the open-source community.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Who is this for */}
      <div className="home-section">
        <h2 className="home-section__title">Who Is This For?</h2>
        <div className="home-about">
          <ul className="home-list">
            <li><strong>Developers</strong> who want to understand the platform their code runs on.</li>
            <li><strong>System Administrators</strong> building foundational Linux skills.</li>
            <li><strong>Students</strong> studying computer science or IT.</li>
            <li><strong>Anyone</strong> curious about Linux and open-source software.</li>
          </ul>
        </div>
      </div>

      {/* How to use */}
      <div className="home-section">
        <h2 className="home-section__title">How to Use These Notes</h2>
        <div className="home-about">
          <ol className="home-list home-list--ordered">
            <li>Enroll in the free <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">LFS101 course</a> on the Linux Foundation website.</li>
            <li>Study each module&apos;s official material, then review the corresponding notes here.</li>
            <li>Use your own terminal to practice commands as you learn.</li>
            <li>Mark modules as complete to track your progress — saved automatically in your browser.</li>
          </ol>
        </div>
      </div>

      {/* Quick Links */}
      <div className="home-section">
        <h2 className="home-section__title">Quick Links</h2>
        <div className="home-quick-links">
          <a className="home-quick-link" href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
            <span className="home-quick-link__icon">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <span className="home-quick-link__text">Official LFS101 Course</span>
          </a>
          <a className="home-quick-link" href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
            <span className="home-quick-link__icon">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </span>
            <span className="home-quick-link__text">Linux Foundation</span>
          </a>
          <a className="home-quick-link" href="https://www.kernel.org/" target="_blank" rel="noopener">
            <span className="home-quick-link__icon">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="12" cy="12" r="1" />
              </svg>
            </span>
            <span className="home-quick-link__text">Linux Kernel</span>
          </a>
          <a className="home-quick-link" href="https://www.linux.com/what-is-linux/" target="_blank" rel="noopener">
            <span className="home-quick-link__icon">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </span>
            <span className="home-quick-link__text">What is Linux?</span>
          </a>
          <a className="home-quick-link" href="https://distrowatch.com/" target="_blank" rel="noopener">
            <span className="home-quick-link__icon">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </span>
            <span className="home-quick-link__text">DistroWatch</span>
          </a>
          <a className="home-quick-link" href="https://github.com/torvalds/linux" target="_blank" rel="noopener">
            <span className="home-quick-link__icon">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </span>
            <span className="home-quick-link__text">Linux on GitHub</span>
          </a>
        </div>
      </div>

      <div className="attribution">
        These notes are based on the original{" "}
        <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
          <strong>&quot;Introduction to Linux&quot; (LFS101)</strong>
        </a>{" "}
        course by the Linux Foundation.
      </div>
    </Base>
  );
};

export default HomePage;
