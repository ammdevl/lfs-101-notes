/**
 * Tux brand mark — the full-color Linux penguin, drawn to match
 * public/favicon.svg exactly (black body, white belly and face,
 * orange beak and feet).
 */
const TuxMark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="32" cy="37" rx="16" ry="20" fill="#16181d" />
    <ellipse cx="32" cy="42" rx="10" ry="13" fill="#f8fafc" />
    <ellipse cx="32" cy="23" rx="9.5" ry="7.5" fill="#f8fafc" />
    <circle cx="28.4" cy="21.2" r="1.7" fill="#16181d" />
    <circle cx="35.6" cy="21.2" r="1.7" fill="#16181d" />
    <path d="M27.8 24.6h8.4L32 30.6z" fill="#f5a623" />
    <ellipse cx="25" cy="57.6" rx="5.6" ry="2.5" fill="#f5a623" />
    <ellipse cx="39" cy="57.6" rx="5.6" ry="2.5" fill="#f5a623" />
  </svg>
);

export default TuxMark;
