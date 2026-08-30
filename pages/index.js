import { useEffect, useMemo, useState } from "react";
import Base from "@layouts/Base";
import ScrollReveal from "@components/ScrollReveal";
import CountUp from "@components/CountUp";
import { useRegisterSearchIndex } from "@components/SearchContext";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";
import { getModulesMeta, getSearchIndex } from "@lib/content-meta";

/* ---------------- Animated terminal hero ---------------- */

const TERMINAL_SCRIPT = [
  { cmd: "whoami", out: "student", cls: "" },
  { cmd: "uname -srm", out: "Linux 6.8.0 x86_64", cls: "" },
  { cmd: "ls ~/lfs101/ | wc -l", out: "17", cls: "" },
  { cmd: "./start-learning.sh", out: "Loading module 1: Linux History Overview…", cls: "home-terminal__ok" },
];

const HeroTerminal = () => {
  // SSR / no-JS markup shows the full transcript; JS restarts the typing loop.
  const [lines, setLines] = useState(TERMINAL_SCRIPT);
  const [typing, setTyping] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    setLines([]);
    let line = 0;
    let char = 0;
    let cancelled = false;
    let timer;

    const typeNext = () => {
      if (cancelled) return;
      if (line >= TERMINAL_SCRIPT.length) {
        // Hold the full transcript, then replay
        timer = setTimeout(() => {
          line = 0;
          char = 0;
          setLines([]);
          typeNext();
        }, 5000);
        return;
      }
      const step = TERMINAL_SCRIPT[line];
      if (char <= step.cmd.length) {
        setTyping(step.cmd.slice(0, char));
        char += 1;
        timer = setTimeout(typeNext, 40 + Math.random() * 50);
      } else {
        setLines((prev) => [...prev.slice(-3), step]);
        setTyping("");
        line += 1;
        char = 0;
        timer = setTimeout(typeNext, 750);
      }
    };

    typeNext();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="home-terminal">
      <div className="home-terminal__header">
        <div className="home-terminal__dots" aria-hidden="true">
          <span className="home-terminal__dot home-terminal__dot--close" />
          <span className="home-terminal__dot home-terminal__dot--min" />
          <span className="home-terminal__dot home-terminal__dot--max" />
        </div>
        <span className="home-terminal__title">student@lfs101: ~</span>
      </div>
      <div className="home-terminal__body" aria-hidden="true">
        {lines.map((l, i) => (
          <div key={`${i}-${l.cmd}`}>
            <div className="home-terminal__line">
              <span className="home-terminal__prompt">$</span>
              {l.cmd}
            </div>
            <div className={`home-terminal__line ${l.cls || "home-terminal__accent"}`}>
              {l.out}
            </div>
          </div>
        ))}
        <div className="home-terminal__line">
          <span className="home-terminal__prompt">$</span>
          {typing}
          <span className="home-terminal__cursor" />
        </div>
      </div>
    </div>
  );
};

/* ---------------- Page ---------------- */

const HomePage = ({ totalMinutes, searchIndex }) => {
  const { completed, isCompleted, lastVisitedId } = useProgress();
  useRegisterSearchIndex(searchIndex);
  const total = MODULES.length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const totalHours = Math.max(1, Math.round(totalMinutes / 60));

  // Resume target: last visited (if not finished), else first unfinished
  const continueModule = useMemo(() => {
    if (completed === 0 && !lastVisitedId) return null;
    if (lastVisitedId && !isCompleted(lastVisitedId)) {
      return MODULES.find((m) => m.id === lastVisitedId);
    }
    return MODULES.find((m) => !isCompleted(m.id)) || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completed, lastVisitedId]);

  const ringR = 24;
  const ringC = 2 * Math.PI * ringR;

  return (
    <Base topbarInset wide>
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero__bg" aria-hidden="true">
          <span className="home-hero__glow home-hero__glow--1" />
          <span className="home-hero__glow home-hero__glow--2" />
        </div>

        <ScrollReveal>
          <span className="home-hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Unofficial study notes · Linux Foundation LFS101
          </span>
          <h1 className="home-hero__title">
            Learn <span className="gradient-text">Linux</span>, one module at a time
          </h1>
          <p className="home-hero__subtitle">
            Clear, structured notes for the free &ldquo;Introduction to Linux&rdquo;
            course — from your first terminal session to bash scripting and
            security. Study alongside the official material and track your
            progress as you go.
          </p>
          <div className="home-hero__actions">
            <Link href={`/modules/${MODULES[0].id}/`} className="btn btn--primary">
              Start learning
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/modules/" className="btn btn--ghost">
              Browse modules
            </Link>
          </div>
          <div className="home-hero__trust">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {total} modules
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              ~{totalHours}h of reading
            </span>
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free &amp; self-paced
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal scale delay={120}>
          <HeroTerminal />
        </ScrollReveal>
      </div>

      {/* Stats bento */}
      <div className="home-stats">
        <ScrollReveal delay={0}>
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <CountUp value={total} className="home-stat__value" />
            <span className="home-stat__label">Course modules</span>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <CountUp value={completed} className="home-stat__value" />
            <span className="home-stat__label">Modules completed</span>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={160}>
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <line x1="2" y1="12" x2="22" y2="12" />
              </svg>
            </span>
            <CountUp value={pct} suffix="%" className="home-stat__value" />
            <span className="home-stat__label">Course progress</span>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={240}>
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <CountUp value={totalHours} suffix="h" className="home-stat__value" />
            <span className="home-stat__label">Total reading time</span>
          </div>
        </ScrollReveal>
      </div>

      {/* Continue learning */}
      {continueModule && (
        <ScrollReveal className="mt-6">
          <Link href={`/modules/${continueModule.id}/`} className="continue-card" aria-label={`Continue learning: ${continueModule.title}`}>
            <span className="continue-card__icon" aria-hidden="true">{continueModule.icon}</span>
            <div className="continue-card__body">
              <span className="continue-card__label">
                {completed === 0 ? "Pick up where you left off" : "Continue learning"}
              </span>
              <span className="continue-card__title">{continueModule.title}</span>
              <div className="continue-card__progress">
                <div className="progress-bar" role="progressbar" aria-valuenow={completed} aria-valuemin="0" aria-valuemax={total} aria-label="Course progress">
                  <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
                </div>
                <span>{completed}/{total} · {pct}%</span>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-text-secondary dark:text-darkmode-text-secondary">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </ScrollReveal>
      )}

      {/* What you'll learn */}
      <div className="home-section home-section--narrow">
        <ScrollReveal>
          <h2 className="home-section__title">What you&rsquo;ll learn</h2>
          <p className="home-section__sub">
            Everything you need to feel at home on Linux — the same ground the
            official LFS101 course covers, distilled into review-friendly notes.
          </p>
        </ScrollReveal>
        <div className="home-features">
          {[
            {
              title: "Command Line Mastery",
              desc: "Navigate the filesystem, manage processes, and use pipes, redirection, and shell scripting.",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <polyline points="7 8 10 11 7 14" />
                  <line x1="13" y1="14" x2="17" y2="14" />
                </svg>
              ),
            },
            {
              title: "File & Process Management",
              desc: "Understand permissions, ownership, links, and how Linux manages processes and services.",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              ),
            },
            {
              title: "Networking & Security",
              desc: "Configure networks, use SSH, manage firewalls, and apply local security principles.",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
            },
            {
              title: "Linux Ecosystem",
              desc: "Explore distributions, desktop environments, package management, and the open-source community.",
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
            },
          ].map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 70}>
              <div className="home-feature">
                <span className="home-feature__icon" aria-hidden="true">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Course outline */}
      <div className="home-section home-section--narrow">
        <ScrollReveal>
          <h2 className="home-section__title">Course outline</h2>
          <p className="home-section__sub">
            Seventeen modules, from the history of the kernel to local security
            principles — each with an estimated reading time.
          </p>
        </ScrollReveal>
        <ScrollReveal className="home-outline" delay={80}>
          {MODULES.map((m, i) => (
            <div key={m.id} className="home-outline__item">
              <span className="home-outline__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="home-outline__title">{m.title}</span>
            </div>
          ))}
        </ScrollReveal>
      </div>

      {/* Who is this for */}
      <div className="home-section home-section--narrow">
        <ScrollReveal>
          <h2 className="home-section__title">Who is this for?</h2>
        </ScrollReveal>
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
      <div className="home-section home-section--narrow">
        <ScrollReveal>
          <h2 className="home-section__title">How to use these notes</h2>
        </ScrollReveal>
        <div className="home-steps">
          {[
            {
              title: "Enroll",
              desc: (
                <>
                  Sign up for the free{" "}
                  <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
                    LFS101 course
                  </a>{" "}
                  on the Linux Foundation website.
                </>
              ),
            },
            {
              title: "Study",
              desc: "Work through each module's official material, then review the matching notes here.",
            },
            {
              title: "Practice",
              desc: "Open a terminal and run every command yourself — muscle memory beats memorization.",
            },
            {
              title: "Track",
              desc: "Mark modules as complete to keep your progress — saved automatically in your browser.",
            },
          ].map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 70}>
              <div className="home-step">
                <span className="home-step__num" aria-hidden="true">{i + 1}</span>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="home-section home-section--narrow">
        <ScrollReveal>
          <h2 className="home-section__title">Quick links</h2>
        </ScrollReveal>
        <div className="home-quick-links">
          {[
            { label: "Official LFS101 Course", href: "https://training.linuxfoundation.org/training/introduction-to-linux/" },
            { label: "Linux Foundation", href: "https://www.linuxfoundation.org/" },
            { label: "Linux Kernel", href: "https://www.kernel.org/" },
            { label: "What is Linux?", href: "https://www.linux.com/what-is-linux/" },
            { label: "DistroWatch", href: "https://distrowatch.com/" },
            { label: "Linux on GitHub", href: "https://github.com/torvalds/linux" },
          ].map((l) => (
            <a key={l.label} className="home-quick-link" href={l.href} target="_blank" rel="noopener">
              <span className="home-quick-link__icon" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
              {l.label}
            </a>
          ))}
        </div>
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

export async function getStaticProps() {
  const meta = getModulesMeta();
  return {
    props: {
      totalMinutes: MODULES.reduce((sum, m) => sum + (meta[m.id]?.readMinutes ?? 5), 0),
      searchIndex: getSearchIndex(meta),
    },
  };
}

export default HomePage;
