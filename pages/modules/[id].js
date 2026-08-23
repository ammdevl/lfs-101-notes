import { useRouter } from "next/router";
import Base from "@layouts/Base";
import Sidebar from "@layouts/components/Sidebar";
import { useProgress } from "@components/ProgressContext";
import MODULES from "@data/modules";
import Link from "next/link";
import { useState, useEffect } from "react";

// Dynamic import for module content
const moduleComponents = {
  "linux-history": () => import("@components/modules/LinuxHistory"),
  "linux-philosophy": () => import("@components/modules/LinuxPhilosophy"),
  "linux-families": () => import("@components/modules/LinuxFamilies"),
  "linux-basics": () => import("@components/modules/LinuxBasics"),
  "gui": () => import("@components/modules/Gui"),
  "command-line": () => import("@components/modules/CommandLine"),
  "documentation": () => import("@components/modules/Documentation"),
  "processes": () => import("@components/modules/Processes"),
  "file-operations": () => import("@components/modules/FileOperations"),
  "text-editors": () => import("@components/modules/TextEditors"),
  "user-environment": () => import("@components/modules/UserEnvironment"),
  "manipulating-text": () => import("@components/modules/ManipulatingText"),
  "network-operations": () => import("@components/modules/NetworkOperations"),
  "bash-scripting": () => import("@components/modules/BashScripting"),
  "bash-advanced": () => import("@components/modules/BashAdvanced"),
  "printing": () => import("@components/modules/Printing"),
  "security": () => import("@components/modules/Security"),
};

export async function getStaticPaths() {
  const paths = MODULES.map((m) => ({
    params: { id: m.id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  return { props: { id: params.id } };
}

const ModulePage = ({ id }) => {
  const router = useRouter();
  const { isCompleted, toggleComplete } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ModuleComponent, setModuleComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  const moduleData = MODULES.find((m) => m.id === id);
  const currentIndex = MODULES.findIndex((m) => m.id === id);
  const prevModule = currentIndex > 0 ? MODULES[currentIndex - 1] : null;
  const nextModule = currentIndex < MODULES.length - 1 ? MODULES[currentIndex + 1] : null;
  const isComplete = id ? isCompleted(id) : false;

  useEffect(() => {
    if (!id || !moduleComponents[id]) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setModuleComponent(null);

    moduleComponents[id]().then((mod) => {
      setModuleComponent(() => mod.default);
      setLoading(false);
    });
  }, [id]);

  // Wrap summary sections in .summary-section div after render
  useEffect(() => {
    if (loading || !ModuleComponent) return;

    // Wait for DOM to settle
    const timer = setTimeout(() => {
      const container = document.querySelector(".module-content");
      if (!container) return;

      container.querySelectorAll("h3").forEach((h3) => {
        if (h3.textContent.trim() !== "Summary") return;
        if (h3.closest(".summary-section")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "summary-section";
        h3.parentNode.insertBefore(wrapper, h3);
        wrapper.appendChild(h3);

        // Collect all sibling elements after the h3
        let sibling = wrapper.nextSibling;
        while (sibling) {
          const next = sibling.nextSibling;
          wrapper.appendChild(sibling);
          sibling = next;
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [loading, ModuleComponent]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "ArrowLeft" && prevModule) {
        e.preventDefault();
        router.push(`/modules/${prevModule.id}/`);
      }
      if (e.altKey && e.key === "ArrowRight" && nextModule) {
        e.preventDefault();
        router.push(`/modules/${nextModule.id}/`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevModule, nextModule, router]);

  if (!id) return null;

  const sidebarEl = <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />;

  return (
    <Base title={moduleData?.title} showProgress sidebar={sidebarEl} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}>

      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb__parent">Home</Link>
        <span className="breadcrumb__sep" aria-hidden="true">/</span>
        <Link href="/modules/" className="breadcrumb__parent">Modules</Link>
        <span className="breadcrumb__sep" aria-hidden="true">/</span>
        <span className="breadcrumb__current" aria-current="page">
          {moduleData?.title || id}
        </span>
      </nav>

      {/* Module content */}
      {loading ? (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="skeleton skeleton-heading" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--medium" />
          <div className="skeleton skeleton-line skeleton-line--short" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line--medium" />
          <span className="sr-only">Loading module...</span>
        </div>
      ) : ModuleComponent ? (
        <div className="module-content">
          <ModuleComponent />
        </div>
      ) : (
        <div>
          <h2>Module not found</h2>
          <p>Could not load module &quot;{id}&quot;.</p>
          <Link href="/" className="btn btn--primary mt-4 inline-flex">
            Back to Home
          </Link>
        </div>
      )}

      {/* Module navigation */}
      {!loading && ModuleComponent && (
        <div className="module-nav">
          {prevModule ? (
            <Link href={`/modules/${prevModule.id}/`} className="btn btn--ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Previous
            </Link>
          ) : (
            <div />
          )}

          <button
            className={`btn ${isComplete ? "btn--ghost" : "btn--accent"}`}
            onClick={() => toggleComplete(id)}
            aria-pressed={isComplete}
          >
            {isComplete ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Completed
              </>
            ) : (
              "Mark as Complete"
            )}
          </button>

          {nextModule ? (
            <Link href={`/modules/${nextModule.id}/`} className="btn btn--ghost">
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ) : (
            <Link href="/modules/" className="btn btn--ghost">
              All Modules
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>
      )}

      {/* Attribution */}
      {!loading && ModuleComponent && (
        <div className="attribution" style={{ marginTop: "2rem" }}>
          These notes are based on the original{" "}
          <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
            <strong>&quot;Introduction to Linux&quot; (LFS101)</strong>
          </a>{" "}
          course by the Linux Foundation.
        </div>
      )}
    </Base>
  );
};

export default ModulePage;
