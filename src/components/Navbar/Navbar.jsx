import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../theme/ThemeContext.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import "./Navbar.css";

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const MenuIcon = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {open ? <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></> : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
  </svg>
);

const Navbar = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);

  const onHomePage = location.pathname === "/";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!onHomePage) {
      setScrolled(true);
      return undefined;
    }
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setScrolled(progress >= 0.04);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHomePage]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHome = () => {
    if (onHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigator("/");
    }
  };

  const handleShare = () => {
    navigator("/text");
  };

  const handleHowItWorks = () => {
    if (onHomePage) {
      scrollToSection("landing-how");
    } else {
      navigator("/");
      setTimeout(() => scrollToSection("landing-how"), 350);
    }
  };

  const firstName = user?.firstName || "";
  const displayName = user ? `${firstName} ${user.lastName || ""}`.trim() : "";

  return (
    <header
      className={`navbar ${onHomePage ? "navbar--home" : ""} ${scrolled ? "navbar--scrolled" : ""}`}
    >
      <div className="navbar_inner">
        <button
          className="navbar_brand"
          onClick={() => navigator("/")}
          aria-label="Multiverse home"
        >
          <span className="navbar_brand_text">
            <span className="navbar_brand_title">Multiverse</span>
            <span className="navbar_brand_sub">Private handoffs</span>
          </span>
        </button>

        <nav className="navbar_links" aria-label="Primary navigation">
          <button onClick={handleHome}>Home</button>
          <button onClick={() => onHomePage ? scrollToSection("landing-services") : navigator("/")}>Services</button>
          <button onClick={() => navigator("/chat")}>Live rooms</button>
          <button onClick={handleHowItWorks}>How it works</button>
        </nav>

        <div className="navbar_actions">
          <button
            className="navbar_theme_toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark / light theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {isAuthenticated ? (
            <div className="navbar_profile" ref={profileRef}>
              <button
                className="navbar_profile_chip"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
              >
                <span className="navbar_profile_avatar">
                  {(firstName[0] || "U").toUpperCase()}
                </span>
                <span className="navbar_profile_name">{displayName}</span>
                <span className="navbar_profile_chevron">
                  <ChevronIcon />
                </span>
              </button>
              {profileOpen ? (
                <div className="navbar_profile_menu">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigator("/dashboard");
                    }}
                  >
                    <DashboardIcon />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigator("/dashboard/activity");
                    }}
                  >
                    <HistoryIcon />
                    Activity History
                  </button>
                  <button
                    className="navbar_profile_menu_logout"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigator("/");
                    }}
                  >
                    <LogoutIcon />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <button className="navbar_login" onClick={() => navigator("/auth")}>
              Login
            </button>
          )}
          <button
            className="navbar_menu_toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
      <div className={`navbar_mobile_menu ${menuOpen ? "is-open" : ""}`}>
        <nav aria-label="Mobile navigation">
          <button onClick={handleHome}>Home</button>
          <button onClick={handleShare}>Create a portal</button>
          <button onClick={() => navigator("/chat")}>Live chat</button>
          <button onClick={handleHowItWorks}>How it works</button>
          {isAuthenticated ? (
            <button onClick={() => navigator("/dashboard")}>My dashboard</button>
          ) : (
            <button onClick={() => navigator("/auth")}>Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
