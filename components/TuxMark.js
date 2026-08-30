/**
 * Tux brand mark — the site logo, drawn to match public/favicon.svg.
 * Inherits color via currentColor so it works on gradient/colored chips.
 */
const TuxMark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    {/* body silhouette */}
    <ellipse cx="32" cy="35" rx="16.5" ry="21.5" />
    {/* head bump merges with body */}
    <ellipse cx="32" cy="20" rx="10.5" ry="9" />
    {/* feet */}
    <ellipse cx="24.5" cy="57.5" rx="6" ry="2.8" />
    <ellipse cx="39.5" cy="57.5" rx="6" ry="2.8" />
  </svg>
);

export default TuxMark;
