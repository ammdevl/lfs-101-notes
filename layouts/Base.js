import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import Head from "next/head";
import { useRef, useEffect, useState } from "react";

const Base = ({ title, description, children, sidebar, showProgress = false, sidebarOpen, onToggleSidebar, topbarInset = false }) => {
  const pageTitle = title ? `${title} | LFS101 Notes` : "Introduction to Linux - LFS101 Notes";
  const pageDesc = description || "Personal study notes from the Introduction to Linux (LFS101) course by the Linux Foundation.";
  const contentRef = useRef(null);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowFab(el.scrollTop > 300);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <div className={`app ${sidebar ? "app--sidebar" : ""}`}>
        {sidebar}
        <div className="main">
          <Header showProgress={showProgress} showSidebarToggle={!!sidebar} sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} inset={topbarInset} />
          <div className="split-layout">
            <main className="split-layout__content" id="content" ref={contentRef} tabIndex={-1}>
              <div className="content content-fade-in">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </div>
      <CookieBanner />
      {/* Scroll to top FAB */}
      <button
        className={`scroll-top-fab ${showFab ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" id="sr-announcer" />
    </>
  );
};

export default Base;
