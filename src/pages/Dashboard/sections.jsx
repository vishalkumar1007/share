import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { api, buildReceiveUrl } from "../../api/client.js";

export const OverviewPage = () => {
  const { displayName, counts, shares, refreshShares, loadingShares } =
    useOutletContext();
  const navigate = useNavigate();
  const recent = shares.slice(0, 8);
  const first = displayName.split(" ")[0] || displayName;

  return (
    <div className="ws_stack">
      <section className="ws_hero">
        <div>
          <p className="ws_hero_hello">Hello, {first}</p>
          <h2 className="ws_hero_line">Here’s what’s on your desk.</h2>
        </div>
        <div className="ws_hero_actions">
          <button
            type="button"
            className="ws_btn ws_btn--solid"
            onClick={() => navigate("/text")}
          >
            Open share portal
          </button>
          <button
            type="button"
            className="ws_btn ws_btn--quiet"
            onClick={() => navigate("/chat")}
          >
            Start chat
          </button>
        </div>
      </section>

      <section className="ws_metrics" aria-label="Share stats">
        <div className="ws_metric">
          <span className="ws_metric_value">{counts.total}</span>
          <span className="ws_metric_label">Total shares</span>
        </div>
        <div className="ws_metric">
          <span className="ws_metric_value">{counts.active}</span>
          <span className="ws_metric_label">Still active</span>
        </div>
        <div className="ws_metric">
          <span className="ws_metric_value">{counts.text || 0}</span>
          <span className="ws_metric_label">Text</span>
        </div>
        <div className="ws_metric">
          <span className="ws_metric_value">
            {(counts.image || 0) + (counts.file || 0) + (counts.audio || 0)}
          </span>
          <span className="ws_metric_label">Media</span>
        </div>
      </section>

      <section className="ws_board">
        <div className="ws_board_bar">
          <h3 className="ws_board_title">Recent shares</h3>
          <button type="button" className="ws_textbtn" onClick={refreshShares}>
            Refresh
          </button>
        </div>

        {loadingShares ? (
          <p className="ws_muted">Loading…</p>
        ) : recent.length === 0 ? (
          <div className="ws_empty">
            <p className="ws_empty_title">No shares yet</p>
            <p className="ws_muted">Create a portal to see it listed here.</p>
            <button
              type="button"
              className="ws_btn ws_btn--solid"
              onClick={() => navigate("/text")}
            >
              Create first share
            </button>
          </div>
        ) : (
          <ul className="ws_table">
            {recent.map((item) => (
              <li key={item.shareId} className="ws_table_row">
                <span className="ws_type">{item.type}</span>
                <div className="ws_table_main">
                  <strong>{item.title || "Untitled"}</strong>
                  <span>#{item.shareId}</span>
                </div>
                <button
                  type="button"
                  className="ws_textbtn"
                  onClick={() => navigate("/dashboard/activity")}
                >
                  Manage
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export const ActivityPage = () => {
  const { shares, loadingShares, refreshShares } = useOutletContext();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return shares;
    return shares.filter((s) => s.type === filter);
  }, [shares, filter]);

  const copyLink = async (shareId, type) => {
    await navigator.clipboard.writeText(buildReceiveUrl(shareId, type));
    toast.success("Link copied");
  };

  const remove = async (shareId) => {
    const { ok, data } = await api.deleteShare(shareId);
    if (!ok) {
      toast.error(data?.message || data?.msg || "Delete failed");
      return;
    }
    toast.success("Deleted");
    refreshShares();
  };

  return (
    <div className="ws_stack">
      <div className="ws_toolbar">
        <div className="ws_filters" role="tablist" aria-label="Filter by type">
          {["all", "text", "image", "file", "audio"].map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`ws_filter ${filter === key ? "is-active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="ws_toolbar_right">
          <button type="button" className="ws_btn ws_btn--quiet" onClick={refreshShares}>
            Refresh
          </button>
          <button
            type="button"
            className="ws_btn ws_btn--solid"
            onClick={() => navigate("/text")}
          >
            New share
          </button>
        </div>
      </div>

      {loadingShares ? (
        <p className="ws_muted">Loading activity…</p>
      ) : filtered.length === 0 ? (
        <div className="ws_empty ws_empty--board">
          <p className="ws_empty_title">Nothing here</p>
          <p className="ws_muted">Try another filter, or create a new share.</p>
        </div>
      ) : (
        <ul className="ws_table ws_table--rich">
          {filtered.map((item) => (
            <li key={item.shareId} className="ws_table_row">
              <span className="ws_type">{item.type}</span>
              <div className="ws_table_main">
                <strong>{item.title || item.type}</strong>
                <span>
                  #{item.shareId} · {item.privacy}
                  {item.expiresAt
                    ? ` · expires ${new Date(item.expiresAt).toLocaleString()}`
                    : ""}
                </span>
              </div>
              <div className="ws_row_actions">
                <button
                  type="button"
                  className="ws_textbtn"
                  onClick={() => copyLink(item.shareId, item.type)}
                >
                  Copy
                </button>
                <button
                  type="button"
                  className="ws_textbtn ws_textbtn--danger"
                  onClick={() => remove(item.shareId)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ProfilePage = () => {
  const { user, displayName } = useOutletContext();
  return (
    <div className="ws_stack">
      <section className="ws_board">
        <div className="ws_profile">
          <span className="ws_profile_avatar">
            {(displayName[0] || "U").toUpperCase()}
          </span>
          <div>
            <h2 className="ws_profile_name">{displayName}</h2>
            <p className="ws_muted">{user?.email}</p>
          </div>
        </div>

        <div className="ws_fields">
          <label className="ws_field">
            <span>First name</span>
            <input value={user?.firstName || ""} readOnly />
          </label>
          <label className="ws_field">
            <span>Last name</span>
            <input value={user?.lastName || ""} readOnly />
          </label>
          <label className="ws_field ws_field--wide">
            <span>Email</span>
            <input value={user?.email || ""} readOnly />
          </label>
        </div>
      </section>
    </div>
  );
};

export const SettingsPage = () => {
  const { theme, toggleTheme, logout } = useOutletContext();
  return (
    <div className="ws_stack">
      <section className="ws_board">
        <div className="ws_setting">
          <div>
            <h3 className="ws_setting_title">Appearance</h3>
            <p className="ws_muted">
              Workspace is using the {theme === "dark" ? "dark" : "light"} palette.
            </p>
          </div>
          <button type="button" className="ws_btn ws_btn--quiet" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "light" : "dark"}
          </button>
        </div>
        <div className="ws_setting ws_setting--danger">
          <div>
            <h3 className="ws_setting_title">Sign out</h3>
            <p className="ws_muted">End this session on this device.</p>
          </div>
          <button type="button" className="ws_btn ws_btn--danger" onClick={logout}>
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};
