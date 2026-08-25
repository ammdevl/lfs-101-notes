const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">
          <a href="#content" aria-label="Scroll to top">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }} aria-hidden="true">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            {" "}Back to top
          </a>
        </span>
        <span className="footer__sep">&middot;</span>
        <span className="footer__copy">
          &copy; 2026 &mdash; Unofficial study resource, not affiliated with the{" "}
          <a href="https://www.linuxfoundation.org/" target="_blank" rel="noopener">
            Linux Foundation
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
