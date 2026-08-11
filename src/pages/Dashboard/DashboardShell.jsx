import { useEffect, useMemo, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../theme/ThemeContext.jsx";
import { api } from "../../api/client.js";
import "./Dashboard.css";

const NAV = [
  { to: "/dashboard", end: true, label: "Home" },
  { to: "/dashboard/activity", label: "Shares" },
  { to: "/dashboard/profile", label: "Profile" },
  { to: "/dashboard/settings", label: "Settings" },
];

const PAGE_META = {
  "/dashboard": { title: "Home", blurb: "Your Multiverse workspace" },
  "/dashboard/activity": { title: "Shares", blurb: "Portals linked to this account" },
  "/dashboard/profile": { title: "Profile", blurb: "Account identity" },
  "/dashboard/settings": { title: "Settings", blurb: "Preferences for this device" },
};

const DashboardShell = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, checking, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [shares, setShares] = useState([]);
  const [loadingShares, setLoadingShares] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const refreshShares = async () => {
    setLoadingShares(true);
    const { ok, data } = await api.listMyShares(1, 50);
    if (ok) setShares(data.shares || data.data?.shares || []);
    setLoadingShares(false);
  };

  useEffect(() => {
    if (isAuthenticated) refreshShares();
  }, [isAuthenticated]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const displayName = useMemo(() => {
    if (!user) return "Multiverse User";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User";
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  if (checking) {
    return <div className="ws_boot" />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const counts = shares.reduce(
    (acc, s) => {
      acc.total += 1;
      acc[s.type] = (acc[s.type] || 0) + 1;
      if (s.expiresAt && new Date(s.expiresAt) > new Date()) acc.active += 1;
      return acc;
    },
    { total: 0, text: 0, image: 0, file: 0, audio: 0, active: 0 }
  );

  const meta =
    PAGE_META[location.pathname] ||
    PAGE_META["/dashboard"];

  return (
    <div className="ws" data-ws-theme={theme}>
      <header className="ws_top">
        <div className="ws_top_left">
          <button
            type="button"
            className="ws_menu_toggle"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
          <button type="button" className="ws_brand" onClick={() => navigate("/")}>
            <span className="ws_brand_mark">M</span>
            <span className="ws_brand_name">Multiverse</span>
          </button>
        </div>

        <div className="ws_top_actions">
          <button type="button" className="ws_btn ws_btn--quiet" onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            className="ws_btn ws_btn--solid"
            onClick={() => navigate("/text")}
          >
            New share
          </button>
          <div className="ws_userchip" title={user?.email || ""}>
            <span className="ws_userchip_avatar">
              {(displayName[0] || "U").toUpperCase()}
            </span>
            <span className="ws_userchip_name">{displayName.split(" ")[0]}</span>
          </div>
        </div>
      </header>

      <div className="ws_body">
        <aside className={`ws_rail ${menuOpen ? "is-open" : ""}`}>
          <nav className="ws_nav" aria-label="Dashboard">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `ws_nav_link ${isActive ? "is-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ws_rail_footer">
            <button
              type="button"
              className="ws_nav_link"
              onClick={() => navigate("/chat")}
            >
              Live chat
            </button>
            <button type="button" className="ws_nav_link ws_nav_link--mute" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </aside>

        {menuOpen ? (
          <button
            type="button"
            className="ws_scrim"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
        ) : null}

        <main className="ws_main">
          <div className="ws_main_head">
            <p className="ws_main_blurb">{meta.blurb}</p>
            <h1 className="ws_main_title">{meta.title}</h1>
          </div>

          <Outlet
            context={{
              user,
              displayName,
              shares,
              loadingShares,
              counts,
              refreshShares,
              theme,
              toggleTheme,
              logout: handleLogout,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
