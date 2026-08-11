import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../api/client.js";
import "./Admin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const existing = sessionStorage.getItem("adminToken");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (existing) {
    return <Navigate to="/admin/settings" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { ok, data } = await api.adminLogin({ email, password });
      if (!ok || !data?.accessToken) {
        toast.error(data?.msg || data?.message || "Admin login failed");
        return;
      }
      sessionStorage.setItem("adminToken", data.accessToken);
      toast.success("Welcome, admin");
      navigate("/admin/settings", { replace: true });
    } catch (error) {
      toast.error(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin_page">
      <form className="admin_card" onSubmit={onSubmit}>
        <span className="admin_kicker">Admin</span>
        <h1>Multiverse console</h1>
        <p>Sign in to configure mail credentials for live chat invites.</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className="admin_btn" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
