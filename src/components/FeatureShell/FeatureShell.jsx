import { useEffect, useState } from "react";
import { useTheme } from "../../theme/ThemeContext.jsx";
import { FeatureNav } from "./FeatureNav";
import "../../pages/Dashboard/Dashboard.css";
import "./FeatureShell.css";

const FeatureShell = ({ children }) => {
  const { theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 800) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="ws ws--portal" data-ws-theme={theme}>
      <div className="ws_body ws_body--portal">
        <aside className={`ws_rail ws_rail--float ${menuOpen ? "is-open" : ""}`}>
          <FeatureNav onNavigate={() => setMenuOpen(false)} />
        </aside>

        {menuOpen ? (
          <button
            type="button"
            className="ws_scrim"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}

        <main className="ws_main ws_main--portal">
          <header className="ws_portal_mobile">
            <button
              type="button"
              className="ws_menu_toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
            <span className="ws_portal_mobile_title">Share</span>
          </header>

          <div className="ws_portal_content">{children}</div>
        </main>

        <nav className="ws_portal_bottom" aria-label="Portal shortcuts">
          <FeatureNav onNavigate={() => setMenuOpen(false)} compact />
        </nav>
      </div>
    </div>
  );
};

export default FeatureShell;
