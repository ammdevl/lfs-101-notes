import { useProgress } from "@components/ProgressContext";

const CookieBanner = () => {
  const { showBanner, acceptCookies, declineCookies } = useProgress();

  if (!showBanner) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner__content">
        <div className="cookie-banner__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
        </div>
        <div className="cookie-banner__text">
          <strong>We use cookies</strong>
          <p>This site uses a cookie to save your module progress locally in your browser. No personal data is collected or sent to any server. Your progress stays on your device.</p>
        </div>
        <div className="cookie-banner__actions">
          <button className="btn btn--ghost" onClick={declineCookies}>
            Decline
          </button>
          <button className="btn btn--primary" onClick={acceptCookies}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
