
import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  Building2,
  Shield,
} from "lucide-react";

const ROLES = [
  {
    value: "CUSTOMER",
    label: "Customer",
    description: "Explore events, book tickets, manage your bookings.",
    Icon: UserRound,
  },
  {
    value: "ORGANIZER",
    label: "Organizer",
    description: "Create and manage events, track sales and analytics.",
    Icon: Building2,
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Monitor platform sales, users, events and analytics.",
    Icon: Shield,
  },
];

export default function Login({
  onBack,
  onLogin,
  onCreateAccount,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        setError(
          result.message || "Incorrect email or password."
        );
        return;
      }

      const { user, token } = result.data || {};

      if (!user || !token) {
        setError(
          "The server returned an incomplete login response."
        );
        return;
      }

      // Verify the selected account type against the backend role.
      const actualRole = String(user.role || "").toUpperCase();

      if (actualRole !== role) {
        const selectedRole =
          ROLES.find((item) => item.value === role)?.label || role;

        setError(
          `This account is not registered as ${selectedRole}. Please choose the correct login type.`
        );
        return;
      }

      const fullName = user.fullName || "";
      const nameParts = fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const loggedInUser = {
        id: user.id,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" "),
        fullName,
        email: user.email,
        role: actualRole,
      };

      localStorage.setItem("venuevista_auth_token", token);
      localStorage.setItem(
        "venuevista_current_user",
        JSON.stringify(loggedInUser)
      );

      // Keep the existing Remember Me control.
      if (!remember) {
        sessionStorage.setItem("venuevista_session_login", "true");
      } else {
        sessionStorage.removeItem("venuevista_session_login");
      }

      if (onLogin) {
        onLogin(loggedInUser);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background decoration */}
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      {/* Back */}
      <button
        type="button"
        className="login-back"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to VenueVista
      </button>

      <div className="login-layout">
        {/* LEFT SIDE */}
        <div className="login-showcase">
          <div className="login-brand">
            <span className="login-brand-mark">V</span>
            <span>VENUEVISTA</span>
          </div>

          <div className="login-showcase-content">
            <span className="login-eyebrow">
              <span />
              YOUR WORLD OF EVENTS
            </span>

            <h1>
              Every great
              <br />
              <em>experience</em>
              <br />
              starts here.
            </h1>

            <p>
              Discover concerts, sports, theatre,
              festivals and unforgettable
              experiences — all in one place.
            </p>

            <div className="login-showcase-stats">
              <div>
                <strong>10K+</strong>
                <span>Events</span>
              </div>

              <div>
                <strong>500+</strong>
                <span>Venues</span>
              </div>

              <div>
                <strong>50+</strong>
                <span>Cities</span>
              </div>
            </div>
          </div>

          <div className="login-showcase-footer">
            <ShieldCheck size={18} />
            <div>
              <span>Secure &amp; trusted ticketing experience</span>
              <small>
                Your data and payments are always protected.
              </small>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-heading">
              <span className="login-small-title">
                WELCOME BACK
              </span>

              <h2>Sign in to VenueVista</h2>

              <p>
                Access your tickets, bookings and favourite events.
              </p>
            </div>

            {/* ACCOUNT TYPE */}
            <div
              className="login-role-section"
              aria-label="Select your account type"
            >
              <span className="login-role-heading">
                Select your account type
              </span>

              <div className="login-role-picker">
                {ROLES.map(({ value, label, description, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={role === value}
                    className={`login-role-option ${
                      role === value ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      setRole(value);
                      setError("");
                    }}
                  >
                    <span className="login-role-icon">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>

                    <span className="login-role-copy">
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>

                    <span className="login-role-radio">
                      {role === value ? "✓" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="login-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <div className="login-input-wrap">
                  <Mail size={18} />

                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="login-field">
                <div className="login-label-row">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      alert(
                        "Password reset flow will be connected next."
                      )
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="login-input-wrap">
                  <LockKeyhole size={18} />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="login-error" role="alert">
                  {error}
                </div>
              )}

              {/* OPTIONS */}
              <div className="login-options">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>
              </div>

              {/* LOGIN */}
              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <span>→</span>}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="login-divider">
              <span>OR CONTINUE WITH</span>
            </div>

            {/* SOCIAL */}
            <div className="login-socials">
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Google login will be connected with backend."
                  )
                }
              >
                <span className="google-letter">G</span>
                Google
              </button>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Apple login will be connected with backend."
                  )
                }
              >
                <span className="apple-symbol">●</span>
                Apple
              </button>
            </div>

            {/* REGISTER */}
            <div className="login-register">
              <span>Don't have an account?</span>

              <button
                type="button"
                onClick={onCreateAccount}
              >
                Create an account
              </button>
            </div>

            <div className="login-security">
              <LockKeyhole size={14} />
              Your information is protected with secure authentication.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}