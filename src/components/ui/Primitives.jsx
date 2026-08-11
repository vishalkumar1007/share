import "./ui.css";

export const GlassCard = ({ children, className = "", ...rest }) => (
  <div className={`mv_glass ${className}`.trim()} {...rest}>
    {children}
  </div>
);

export const LiveBadge = ({ label = "LIVE", className = "" }) => (
  <span className={`mv_live ${className}`.trim()}>
    <span className="mv_live_dot" />
    {label}
  </span>
);

export const PortalBackdrop = ({ children, className = "" }) => (
  <div className={`mv_portal_bg ${className}`.trim()}>
    <span className="mv_atmosphere mv_atmosphere--a" aria-hidden="true" />
    <span className="mv_atmosphere mv_atmosphere--b" aria-hidden="true" />
    <span className="mv_atmosphere mv_atmosphere--c" aria-hidden="true" />
    <div className="mv_portal_bg_content">{children}</div>
  </div>
);

export const FloatingServiceOrb = ({
  title,
  desc,
  icon,
  onClick,
  accent = "red",
  delay = 0,
}) => (
  <button
    type="button"
    className={`mv_orb_btn mv_orb_btn--${accent}`}
    onClick={onClick}
    style={{ animationDelay: `${delay}s` }}
  >
    <span className="mv_orb_btn_plate" aria-hidden="true">
      <span className="mv_orb_btn_glow" />
      <span className="mv_orb_btn_icon">{icon}</span>
    </span>
    <span className="mv_orb_btn_copy">
      <span className="mv_orb_btn_title">{title}</span>
      <span className="mv_orb_btn_desc">{desc}</span>
    </span>
    <span className="mv_orb_btn_cta">Open</span>
  </button>
);
