import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../api/client.js";
import "./Admin.css";

const AdminSettings = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("adminToken");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [form, setForm] = useState({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    fromName: "Multiverse",
    fromEmail: "",
    passMasked: "",
    hasPassword: false,
  });

  useEffect(() => {
    if (!token) return;
    (async () => {
      const { ok, data, status } = await api.getMailSettings();
      if (!ok) {
        if (status === 401 || status === 403) {
          sessionStorage.removeItem("adminToken");
          navigate("/admin", { replace: true });
        }
        toast.error(data?.msg || "Could not load settings");
        setLoading(false);
        return;
      }
      const mail = data.mail || {};
      setForm((prev) => ({
        ...prev,
        host: mail.host || "smtp.gmail.com",
        port: mail.port || 587,
        secure: Boolean(mail.secure),
        user: mail.user || "",
        fromName: mail.fromName || "Multiverse",
        fromEmail: mail.fromEmail || "",
        passMasked: mail.passMasked || "",
        hasPassword: Boolean(mail.hasPassword),
        pass: "",
      }));
      setLoading(false);
    })();
  }, [token, navigate]);

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        host: form.host,
        port: Number(form.port) || 587,
        secure: Boolean(form.secure),
        user: form.user,
        fromName: form.fromName,
        fromEmail: form.fromEmail || form.user,
      };
      if (form.pass) payload.pass = form.pass;
      const { ok, data } = await api.updateMailSettings(payload);
      if (!ok) {
        toast.error(data?.msg || data?.message || "Save failed");
        return;
      }
      toast.success("Mail settings saved");
      const mail = data.mail || {};
      setForm((prev) => ({
        ...prev,
        pass: "",
        passMasked: mail.passMasked || prev.passMasked,
        hasPassword: Boolean(mail.hasPassword),
      }));
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    setTesting(true);
    try {
      const { ok, data } = await api.testMailSettings({});
      if (!ok) {
        toast.error(data?.msg || data?.message || "Test failed");
        return;
      }
      toast.success(data?.msg || "Test email sent");
    } finally {
      setTesting(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="admin_page">
      <div className="admin_card admin_card--wide">
        <div className="admin_card_head">
          <div>
            <span className="admin_kicker">Admin</span>
            <h1>Mail credentials</h1>
            <p>Used to send live chat invite emails. Passwords are stored encrypted.</p>
          </div>
          <button type="button" className="admin_btn admin_btn--ghost" onClick={logout}>
            Logout
          </button>
        </div>

        {loading ? (
          <p className="admin_muted">Loading…</p>
        ) : (
          <form className="admin_form" onSubmit={save}>
            <div className="admin_grid">
              <label>
                SMTP host
                <input
                  value={form.host}
                  onChange={(e) => setField("host", e.target.value)}
                  placeholder="smtp.gmail.com"
                  required
                />
              </label>
              <label>
                Port
                <input
                  type="number"
                  value={form.port}
                  onChange={(e) => setField("port", e.target.value)}
                  required
                />
              </label>
              <label>
                Username
                <input
                  value={form.user}
                  onChange={(e) => setField("user", e.target.value)}
                  placeholder="you@gmail.com"
                  required
                />
              </label>
              <label>
                Password {form.hasPassword ? `(saved: ${form.passMasked})` : ""}
                <input
                  type="password"
                  value={form.pass}
                  onChange={(e) => setField("pass", e.target.value)}
                  placeholder={form.hasPassword ? "Leave blank to keep" : "App password"}
                  autoComplete="new-password"
                />
              </label>
              <label>
                From name
                <input
                  value={form.fromName}
                  onChange={(e) => setField("fromName", e.target.value)}
                />
              </label>
              <label>
                From email
                <input
                  type="email"
                  value={form.fromEmail}
                  onChange={(e) => setField("fromEmail", e.target.value)}
                  placeholder="same as username usually"
                />
              </label>
            </div>
            <label className="admin_check">
              <input
                type="checkbox"
                checked={form.secure}
                onChange={(e) => setField("secure", e.target.checked)}
              />
              Use TLS/SSL (secure)
            </label>
            <div className="admin_actions">
              <button type="submit" className="admin_btn" disabled={saving}>
                {saving ? "Saving…" : "Save credentials"}
              </button>
              <button
                type="button"
                className="admin_btn admin_btn--ghost"
                onClick={test}
                disabled={testing}
              >
                {testing ? "Sending…" : "Send test email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
