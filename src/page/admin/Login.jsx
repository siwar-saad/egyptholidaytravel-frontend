import { useState } from "react";
import API from "../../api";
import "./Admin.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Change this endpoint if your backend login route has another name.
      const res = await API.post("/auth/login", form);

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token || !user) {
        setError("Invalid login response.");
        return;
      }

      if (user.role !== "admin") {
        setError("Only admins can access this page.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <div className="auth-left">
          <div className="auth-shape">
            <h1>Egypt Holiday</h1>
            <p>Admin access only</p>
          </div>
        </div>

        <div className="auth-right">
          <h2>Admin Login</h2>
          <p>Sign in to manage packages, reservations and clients.</p>

          {error && <div className="success-alert">⚠️ {error}</div>}

          <input
            type="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
