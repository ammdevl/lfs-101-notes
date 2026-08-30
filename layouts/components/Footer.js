import Link from "next/link";
import TuxMark from "@components/TuxMark";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-row">
              <span className="footer__brand-icon" aria-hidden="true">
                <TuxMark size={26} />
              </span>
              <span className="footer__brand-name">LFS101 Notes</span>
            </div>
            <p className="footer__desc">
              Personal study notes from the &ldquo;Introduction to Linux&rdquo; (LFS101)
              course by the Linux Foundation — free, unofficial, and stored entirely
              in your browser.
            </p>
          </div>

          <nav aria-label="Course">
            <h2 className="footer__heading">Course</h2>
            <div className="footer__links">
              <Link href="/modules/">All modules</Link>
              <Link href="/modules/linux-history/">Start learning</Link>
              <Link href="/">Home</Link>
            </div>
          </nav>

          <nav aria-label="Resources">
            <h2 className="footer__heading">Resources</h2>
            <div className="footer__links">
              <a href="https://training.linuxfoundation.org/training/introduction-to-linux/" target="_blank" rel="noopener">
                Official LFS101 course
              </a>
              <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
                Linux Foundation
              </a>
              <a href="https://www.kernel.org/" target="_blank" rel="noopener">
                Kernel.org
              </a>
              <a href="https://distrowatch.com/" target="_blank" rel="noopener">
                DistroWatch
              </a>
            </div>
          </nav>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">
            &copy; 2026 &mdash; Unofficial study resource, not affiliated with the{" "}
            <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
              Linux Foundation
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
