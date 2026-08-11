import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth.js";
import { useTheme } from "../../theme/ThemeContext.jsx";
import Navbar from "../../components/Navbar/Navbar";
import {
  fetchUserProfileDataThunk,
  userProfileApiIsLoading,
  userProfileApiData,
} from "../../reduxSetup/features/apiCollections/userProfileData/centralExportUserProfileData";
import "./Dashboard.css";

const OverviewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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

const ProfileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ActivityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
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

const ArrowIcon = () => (
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
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: <OverviewIcon /> },
  { id: "profile", label: "Profile", icon: <ProfileIcon /> },
  { id: "activity", label: "Activity History", icon: <ActivityIcon /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon /> },
];

const Dashboard = () => {
  const navigator = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { isAuthenticated, checking, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState(() => {
    const requested = searchParams.get("section");
    return NAV_SECTIONS.some((s) => s.id === requested) ? requested : "overview";
  });

  const selectSection = (id) => {
    setActiveSection(id);
    setSearchParams(id === "overview" ? {} : { section: id }, { replace: true });
  };

  const userProfileData = useSelector(userProfileApiData);
  const userProfileDataLoading = useSelector(userProfileApiIsLoading);

  useEffect(() => {
    if (!userProfileData) {
      dispatch(fetchUserProfileDataThunk());
    }
  }, [dispatch, userProfileData]);

  const profile = userProfileData?.data || {};
  const firstName = profile.firstName || user?.firstName || "";
  const lastName = profile.lastName || user?.lastName || "";
  const displayName = `${firstName} ${lastName}`.trim() || "Multiverse User";
  const email = profile.email || user?.email || "";

  const textHistory = profile.userData?.textMultiverseData || [];
  const imageHistory = profile.userData?.imageMultiverseData || [];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully", {
      style: { color: "#19b030d0" },
    });
    navigator("/");
  };

  if (checking) {
    return (
      <div className="start_loading" style={{ height: "100dvh" }}></div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="dash_main">
      <Navbar />
      <div className="dash_layout">
        <aside className="dash_side">
          <div className="dash_side_user">
            <span className="dash_side_avatar">
              {(firstName[0] || "U").toUpperCase()}
            </span>
            <div className="dash_side_user_text">
              <span className="dash_side_user_name">{displayName}</span>
              <span className="dash_side_user_email">{email}</span>
            </div>
          </div>

          <nav className="dash_nav">
            {NAV_SECTIONS.map((item) => (
              <button
                key={item.id}
                className={`dash_nav_item ${
                  activeSection === item.id ? "is-active" : ""
                }`}
                onClick={() => selectSection(item.id)}
              >
                <span className="dash_nav_item_icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <button className="dash_side_logout" onClick={handleLogout}>
            <span className="dash_nav_item_icon">
              <LogoutIcon />
            </span>
            Logout
          </button>
        </aside>

        <main className="dash_content">
          {activeSection === "overview" ? (
            <DashboardOverview
              displayName={displayName}
              textCount={textHistory.length}
              imageCount={imageHistory.length}
              onOpenProfile={() => setActiveSection("profile")}
              onStartSharing={() => navigator("/text")}
            />
          ) : null}

          {activeSection === "profile" ? (
            <ProfileSection
              firstName={firstName}
              lastName={lastName}
              email={email}
            />
          ) : null}

          {activeSection === "activity" ? (
            <ActivitySection
              loading={userProfileDataLoading}
              textHistory={textHistory}
              imageHistory={imageHistory}
            />
          ) : null}

          {activeSection === "settings" ? (
            <SettingsSection
              theme={theme}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
};

const DashboardOverview = ({
  displayName,
  textCount,
  imageCount,
  onOpenProfile,
  onStartSharing,
}) => (
  <>
    <header className="dash_section_head">
      <span className="dash_kicker">Overview</span>
      <h1 className="dash_title">Welcome back, {displayName}</h1>
      <p className="dash_desc">
        Manage your profile, track your shared multiverses and tweak your
        settings — all in one place.
      </p>
    </header>

    <div className="dash_stats">
      <div className="dash_stat">
        <span className="dash_stat_num">{textCount + imageCount}</span>
        <span className="dash_stat_label">Total shared</span>
      </div>
      <div className="dash_stat">
        <span className="dash_stat_num">{textCount}</span>
        <span className="dash_stat_label">Text multiverses</span>
      </div>
      <div className="dash_stat">
        <span className="dash_stat_num">{imageCount}</span>
        <span className="dash_stat_label">Image multiverses</span>
      </div>
    </div>

    <div className="dash_panel">
      <span className="dash_panel_kicker">Quick actions</span>
      <div className="dash_quick_actions">
        <button className="dash_btn dash_btn--primary" onClick={onStartSharing}>
          Start Sharing <ArrowIcon />
        </button>
        <button className="dash_btn dash_btn--ghost" onClick={onOpenProfile}>
          View Profile
        </button>
      </div>
    </div>
  </>
);

const ProfileSection = ({ firstName, lastName, email }) => {
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editEmail, setEditEmail] = useState(email);

  useEffect(() => {
    setEditFirstName(firstName);
    setEditLastName(lastName);
    setEditEmail(email);
  }, [firstName, lastName, email]);

  const handleSaveProfile = () => {
    toast("Profile update coming soon", {
      style: { color: "#b8860b" },
    });
  };

  return (
    <>
      <header className="dash_section_head">
        <span className="dash_kicker">Profile</span>
        <h1 className="dash_title">Your profile</h1>
        <p className="dash_desc">
          View and manage the identity attached to your Multiverse account.
        </p>
      </header>

      <div className="dash_panel">
        <div className="dash_profile_hero">
          <span className="dash_profile_avatar">
            {(firstName[0] || "U").toUpperCase()}
          </span>
          <div className="dash_profile_hero_text">
            <span className="dash_profile_name">
              {`${firstName} ${lastName}`.trim() || "Multiverse User"}
            </span>
            <span className="dash_profile_email">{email}</span>
          </div>
        </div>

        <div className="dash_form_grid">
          <label className="dash_field">
            <span className="dash_field_label">First name</span>
            <input
              className="dash_input"
              type="text"
              value={editFirstName}
              onChange={(e) => setEditFirstName(e.target.value)}
              placeholder="First name"
            />
          </label>
          <label className="dash_field">
            <span className="dash_field_label">Last name</span>
            <input
              className="dash_input"
              type="text"
              value={editLastName}
              onChange={(e) => setEditLastName(e.target.value)}
              placeholder="Last name"
            />
          </label>
          <label className="dash_field dash_field--full">
            <span className="dash_field_label">Email address</span>
            <input
              className="dash_input"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email address"
            />
          </label>
        </div>

        <div className="dash_panel_footer">
          <button className="dash_btn dash_btn--primary" onClick={handleSaveProfile}>
            Save changes
          </button>
        </div>
      </div>
    </>
  );
};

const ActivitySection = ({ loading, textHistory, imageHistory }) => {
  const total = textHistory.length + imageHistory.length;

  return (
    <>
      <header className="dash_section_head">
        <span className="dash_kicker">Activity History</span>
        <h1 className="dash_title">Sharing history</h1>
        <p className="dash_desc">
          Everything you have shared across the Multiverse, newest first.
        </p>
      </header>

      {loading ? (
        <div className="dash_empty">Loading your activity…</div>
      ) : total === 0 ? (
        <div className="dash_empty">
          <span className="dash_empty_title">No activity yet</span>
          <span className="dash_empty_sub">
            Share your first text or image to see it here.
          </span>
        </div>
      ) : (
        <div className="dash_activity_list">
          {textHistory.map((item) => (
            <div className="dash_activity_item" key={item.multiverseCode}>
              <span className="dash_activity_badge">Text</span>
              <p className="dash_activity_text">
                {item.codeMappedText || "Shared text"}
              </p>
              <span className="dash_activity_code">
                #{item.multiverseCode}
              </span>
            </div>
          ))}
          {imageHistory.map((item) => (
            <div className="dash_activity_item" key={item.multiverseCode}>
              <span className="dash_activity_badge dash_activity_badge--image">
                Image
              </span>
              <p className="dash_activity_text">
                {item.codeMappedText || "Shared image"}
              </p>
              <span className="dash_activity_code">
                #{item.multiverseCode}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const SettingsSection = ({ theme, toggleTheme, onLogout }) => (
  <>
    <header className="dash_section_head">
      <span className="dash_kicker">Settings</span>
      <h1 className="dash_title">Preferences</h1>
      <p className="dash_desc">
        Tune the Multiverse to your taste.
      </p>
    </header>

    <div className="dash_panel">
      <div className="dash_setting_row">
        <div className="dash_setting_text">
          <span className="dash_setting_title">Appearance</span>
          <span className="dash_setting_sub">
            Currently on the {theme === "dark" ? "dark" : "light"} theme.
          </span>
        </div>
        <button className="dash_btn dash_btn--ghost" onClick={toggleTheme}>
          {theme === "dark" ? "Switch to light" : "Switch to dark"}
        </button>
      </div>

      <div className="dash_setting_row">
        <div className="dash_setting_text">
          <span className="dash_setting_title">Notifications</span>
          <span className="dash_setting_sub">
            Receive activity updates for your multiverses.
          </span>
        </div>
        <button
          className="dash_btn dash_btn--ghost"
          onClick={() =>
            toast("Notifications coming soon", { style: { color: "#b8860b" } })
          }
        >
          Enable
        </button>
      </div>

      <div className="dash_setting_row dash_setting_row--danger">
        <div className="dash_setting_text">
          <span className="dash_setting_title">Sign out</span>
          <span className="dash_setting_sub">
            End this session on this device.
          </span>
        </div>
        <button className="dash_btn dash_btn--danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  </>
);

export default Dashboard;
