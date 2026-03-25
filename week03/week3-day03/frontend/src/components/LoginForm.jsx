import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // 'login' | 'signup'
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!form.email || !form.password) {
      return setError("Email and password are required.");
    }
    if (tab === "signup" && !form.name) {
      return setError("Full name is required.");
    }

    setLoading(true);
    try {
      const endpoint = tab === "login" ? "/api/users/login" : "/api/users/register";
      const payload =
        tab === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* ── Left Panel ── */}
        <div className="auth-left">
          <div className="auth-left-logo">Netixsol</div>
          <div className="auth-left-img">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4149/4149678.png"
              alt="Task Manager Illustration"
            />
          </div>
          <div>
            <h2 className="auth-left-title">Welcome!</h2>
            <p className="auth-left-sub">
              To Netixsol, your one-stop solution for all your needs. WEB3 GREEKS
            </p>
            <div className="auth-dots">
              <span className="auth-dot active" />
              <span className="auth-dot" />
              <span className="auth-dot" />
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="auth-right">
          {tab === "login" ? (
            <>
              <h2 className="auth-title">Log In</h2>
              <p className="auth-switch">
                Don't have an account?{" "}
                <button onClick={() => { setTab("signup"); setError(""); }}>
                  Create an account
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-switch">
                Already have an account?{" "}
                <button onClick={() => { setTab("login"); setError(""); }}>
                  Login
                </button>
              </p>
            </>
          )}

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              {tab === "signup" && (
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={update}
                />
              )}
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={update}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={update}
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {tab === "login" && (
            <div className="forgot">Forgot your password?</div>
          )}
        </div>
      </div>
    </div>
  );
}
