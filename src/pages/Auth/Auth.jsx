import "./Auth.css";
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../../api/client.js";
import { PortalBackdrop } from "../../components/ui/Primitives.jsx";

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const nextPath = params.get("next") || "/dashboard";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailOk = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );

  const onLogin = async (e) => {
    e?.preventDefault?.();
    if (!emailOk) {
      toast.error("Enter a valid email");
      return;
    }
    if (!password.trim()) {
      toast.error("Enter your password");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await api.login({
        email: email.trim().toLowerCase(),
        password,
      });
      if (!ok || data.responseStatus !== "success" || !data.accessToken) {
        toast.error(data?.msg || data?.message || "Login failed");
        return;
      }
      localStorage.setItem("authToken", data.accessToken);
      toast.success(
        data.payloadData?.firstName
          ? `Welcome ${data.payloadData.firstName}`
          : data.msg || "Logged in"
      );
      navigate(nextPath.startsWith("/") ? nextPath : "/dashboard", { replace: true });
    } catch {
      toast.error("Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (e) => {
    e?.preventDefault?.();
    if (firstName.trim().length < 2) {
      toast.error("First name is too short");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      toast.error("Enter a valid email");
      return;
    }
    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (signupPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { ok, data } = await api.signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
      });
      if (!ok || data.responseStatus !== "success") {
        toast.error(data?.msg || data?.message || "Signup failed");
        return;
      }
      if (data.accessToken) localStorage.setItem("authToken", data.accessToken);
      toast.success(data.msg || "Account created");
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Auth_main">
      <PortalBackdrop>
        <div className="auth_stage">
          <div className="auth_panel">
            <div className="auth_panel_inner">
              <div className="auth_tabs" role="tablist">
                <span
                  className={`auth_tab_pill ${isLogin ? "" : "is-signup"}`}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  role="tab"
                  className={`auth_tab ${isLogin ? "is-active" : ""}`}
                  aria-selected={isLogin}
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </button>
                <button
                  type="button"
                  role="tab"
                  className={`auth_tab ${!isLogin ? "is-active" : ""}`}
                  aria-selected={!isLogin}
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </button>
              </div>

              <div className="auth_panel_head">
                <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
                <p>
                  {isLogin
                    ? "Sign in to open your Multiverse dashboard."
                    : "Join Multiverse to save portals and manage shares."}
                </p>
              </div>

              {isLogin ? (
                <form className="auth_form" onSubmit={onLogin}>
                  <label className="auth_field">
                    Email
                    <input
                      className="Auth_input"
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="auth_field">
                    <span className="auth_field_row">
                      Password
                      <button
                        type="button"
                        className="auth_link_btn"
                        onClick={() => navigate("/auth/forgot-password")}
                      >
                        Forgot?
                      </button>
                    </span>
                    <span className="auth_pass_wrap">
                      <input
                        className="Auth_input"
                        type={showPass ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="auth_pass_toggle"
                        onClick={() => setShowPass((v) => !v)}
                      >
                        {showPass ? "Hide" : "Show"}
                      </button>
                    </span>
                  </label>
                  <button type="submit" className="auth_submit" disabled={loading}>
                    {loading ? (
                      <span className="loader">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                </form>
              ) : (
                <form className="auth_form" onSubmit={onSignup}>
                  <div className="auth_name_row">
                    <label className="auth_field">
                      First name
                      <input
                        className="Auth_input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First"
                        autoComplete="given-name"
                      />
                    </label>
                    <label className="auth_field">
                      Last name
                      <input
                        className="Auth_input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last"
                        autoComplete="family-name"
                      />
                    </label>
                  </div>
                  <label className="auth_field">
                    Email
                    <input
                      className="Auth_input"
                      type="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                  </label>
                  <label className="auth_field">
                    Password
                    <input
                      className="Auth_input"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                  </label>
                  <label className="auth_field">
                    Confirm password
                    <input
                      className="Auth_input"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </label>
                  <button type="submit" className="auth_submit" disabled={loading}>
                    {loading ? (
                      <span className="loader">
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : (
                      "Create account"
                    )}
                  </button>
                </form>
              )}

              <p className="toggle-text">
                {isLogin ? "New here? " : "Already have an account? "}
                <span onClick={() => setIsLogin((v) => !v)}>
                  {isLogin ? "Create one" : "Sign in"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </PortalBackdrop>
    </div>
  );
};

export default Auth;
