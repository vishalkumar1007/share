import { NavLink, useNavigate } from "react-router-dom";

const Icon = ({ children }) => (
  <span className="ws_nav_ico" aria-hidden>
    {children}
  </span>
);

const ICONS = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m3 10 9-7 9 7" />
      <path d="M5 10v10a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V10" />
    </svg>
  ),
  text: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16" />
      <path d="M4 12h10" />
      <path d="M4 17h14" />
    </svg>
  ),
  image: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  ),
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  audio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  chat: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const FEATURES = [
  { to: "/text", label: "Text", hint: "Notes & links", icon: "text" },
  { to: "/image", label: "Image", hint: "Photos", icon: "image" },
  { to: "/file", label: "File", hint: "Docs & zips", icon: "file" },
  { to: "/audio", label: "Audio", hint: "Voice clips", icon: "audio" },
  { to: "/chat", label: "Chat", hint: "Live room", icon: "chat" },
];

export const FeatureNav = ({ onNavigate, compact = false } = {}) => {
  const navigate = useNavigate();

  const go = (path) => {
    onNavigate?.();
    navigate(path);
  };

  return (
    <nav
      className={`ws_nav ws_nav--portal ${compact ? "ws_nav--compact" : ""}`}
      aria-label="Portal navigation"
    >
      {!compact ? <span className="ws_nav_section">Navigate</span> : null}

      <button type="button" className="ws_nav_link ws_nav_link--row" onClick={() => go("/")}>
        <Icon>{ICONS.home}</Icon>
        <span className="ws_nav_copy">
          <strong>Home</strong>
          {!compact ? <em>Landing page</em> : null}
        </span>
      </button>

      {!compact ? (
        <>
          <div className="ws_rail_divider" aria-hidden />
          <span className="ws_nav_section">Share</span>
        </>
      ) : null}

      {FEATURES.map((f) => (
        <NavLink
          key={f.to}
          to={f.to}
          className={({ isActive }) =>
            `ws_nav_link ws_nav_link--row ${isActive ? "is-active" : ""}`
          }
          onClick={() => onNavigate?.()}
          title={f.hint}
        >
          <Icon>{ICONS[f.icon]}</Icon>
          <span className="ws_nav_copy">
            <strong>{f.label}</strong>
            {!compact ? <em>{f.hint}</em> : null}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default FeatureNav;
