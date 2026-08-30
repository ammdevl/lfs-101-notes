import Header from "./components/Header";
import Footer from "./components/Footer";
import Head from "next/head";
import { useRef, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { scrollToTarget, scrollToTopOfPage } from "@lib/scroll";

const FAB_RING_C = 138.23; // 2πr, r = 22 — must match styles/layout.scss

const Base = ({ title, description, children, sidebar, sidebarOpen, onToggleSidebar, wide = false, showReadingProgress = false }) => {
  const pageTitle = title ? `${title} | LFS101 Notes` : "Introduction to Linux - LFS101 Notes";
  const pageDesc = description || "Personal study notes from the Introduction to Linux (LFS101) course by the Linux Foundation.";
  const contentRef = useRef(null);
  const lenis = useLenis();
  const [fabVisible, setFabVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Window is the scroll container (sticky topbar + Lenis root) — track it
  // for the scroll-to-top FAB and the reading progress bar.
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setFabVisible(y > 300);
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(range > 0 ? Math.min(1, Math.max(0, y / range)) : 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollToTopOfPage(lenis, window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };

  // Delegated in-page anchor handling with Lenis-aware smooth scrolling.
  // Covers the skip link, footer back-to-top, and TOC links.
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (target === contentRef.current) {
        scrollToTopOfPage(lenis, reduceMotion);
        contentRef.current.focus({ preventScroll: true });
      } else {
        scrollToTarget(lenis, target, reduceMotion);
      }
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [lenis]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      {showReadingProgress && (
        <div className="reading-progress" aria-hidden="true">
          <div className="reading-progress__fill" style={{ width: `${Math.round(scrollProgress * 100)}%` }} />
        </div>
      )}
      <div className={`app ${sidebar ? "app--sidebar" : ""}`}>
        {sidebar}
        <div className="main">
          <Header showSidebarToggle={!!sidebar} navbarWide={wide} sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} />
          <div className="split-layout">
            <main className="split-layout__content" id="content" ref={contentRef} tabIndex={-1}>
              <div className={`content content-fade-in ${wide ? "content--wide" : ""}`}>
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </div>
      {/* Scroll to top FAB with scroll-progress ring */}
      <button
        className={`scroll-top-fab ${fabVisible ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        tabIndex={fabVisible ? 0 : -1}
        style={{ "--fab-progress": scrollProgress }}
      >
        <svg className="scroll-top-fab__ring" width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
          <defs>
            <linearGradient id="fabRingGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle className="ring-track" cx="24" cy="24" r="22" />
          <circle className="ring-fill" cx="24" cy="24" r="22" />
        </svg>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" id="sr-announcer" />
    </>
  );
};

export default Base;
