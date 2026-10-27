import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  ShieldCheck,
} from "lucide-react";

export default function Register({
  onBack,
  onLogin,
  onRegister,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !form.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: `${firstName} ${lastName}`.trim(),
            email,
            password,
          }),
        }
      );

      // Read the response safely so non-JSON server errors are also handled.
      const responseText = await response.text();
      let result = {};
      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        result = {};
      }

      if (!response.ok || !result.success) {
        const apiMessage =
          result?.error?.message ||
          result?.message ||
          result?.error?.issues?.[0]?.message ||
          (response.status === 409
            ? "An account with this email already exists. Please sign in instead."
            : `Unable to create account (HTTP ${response.status}). Check the API terminal for details.`);
        setError(apiMessage);
        return;
      }

      const { user, token } = result.data || {};
      if (!user || !token) {
        setError("The server response was incomplete. Please check the API response and try again.");
        return;
      }

      const currentUser = {
        id: user.id,
        firstName: user.fullName?.split(" ")[0] || firstName,
        lastName:
          user.fullName?.split(" ").slice(1).join(" ") || lastName,
        fullName: user.fullName || `${firstName} ${lastName}`.trim(),
        email: user.email || email,
        role: user.role,
      };

      localStorage.setItem("venuevista_auth_token", token);
      localStorage.setItem(
        "venuevista_current_user",
        JSON.stringify(currentUser)
      );

      if (onRegister) {
        onRegister(currentUser);
      }
    } catch (error) {
      console.error("VenueVista registration failed:", error);
      setError(
        "Unable to connect to the API. Confirm the backend is running at http://localhost:4000 and check the browser Console for details."
      );
    }
  };

  return (
    <div className="login-page register-page">

      {/* BACKGROUND */}
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      {/* BACK */}
      <button
        type="button"
        className="login-back"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to VenueVista
      </button>

      <div className="login-layout register-layout">

        {/* LEFT */}
        <div className="login-showcase">

          <div className="login-brand">

            <span className="login-brand-mark">
              V
            </span>

            <span>
              VENUEVISTA
            </span>

          </div>

          <div className="login-showcase-content">

            <span className="login-eyebrow">
              <span></span>
              JOIN THE EXPERIENCE
            </span>

            <h1>
              Your next
              <br />
              <em>great memory</em>
              <br />
              awaits.
            </h1>

            <p>
              Create your VenueVista account and
              discover concerts, sports, theatre,
              festivals and unforgettable
              experiences.
            </p>

            <div className="register-benefits">

              <div>
                <span>01</span>

                <div>
                  <strong>
                    Discover Events
                  </strong>

                  <small>
                    Find experiences happening
                    around you.
                  </small>
                </div>
              </div>

              <div>
                <span>02</span>

                <div>
                  <strong>
                    Book Securely
                  </strong>

                  <small>
                    Simple and secure ticket
                    booking.
                  </small>
                </div>
              </div>

              <div>
                <span>03</span>

                <div>
                  <strong>
                    Manage Tickets
                  </strong>

                  <small>
                    Keep all your bookings in
                    one place.
                  </small>
                </div>
              </div>

            </div>

          </div>

          <div className="login-showcase-footer">
            <ShieldCheck size={16} />

            <span>
              Secure & trusted ticketing experience
            </span>
          </div>

        </div>

        {/* RIGHT */}
        <div className="login-card-wrapper">

          <div className="login-card">

            <div className="login-heading">

              <span className="login-small-title">
                CREATE ACCOUNT
              </span>

              <h2>
                Join VenueVista
              </h2>

              <p>
                Create your account to start
                exploring amazing experiences.
              </p>

            </div>

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="register-name-grid">

                <div className="login-field">

                  <label>
                    First name
                  </label>

                  <div className="login-input-wrap">

                    <User size={17} />

                    <input
                      type="text"
                      placeholder="Naman"
                      value={form.firstName}
                      onChange={(e) =>
                        updateField(
                          "firstName",
                          e.target.value
                        )
                      }
                      autoComplete="given-name"
                    />

                  </div>
                </div>

                <div className="login-field">

                  <label>
                    Last name
                  </label>

                  <div className="login-input-wrap">

                    <input
                      type="text"
                      placeholder="Gupta"
                      value={form.lastName}
                      onChange={(e) =>
                        updateField(
                          "lastName",
                          e.target.value
                        )
                      }
                      autoComplete="family-name"
                    />

                  </div>
                </div>

              </div>

              {/* EMAIL */}
              <div className="login-field">

                <label>
                  Email address
                </label>

                <div className="login-input-wrap">

                  <Mail size={18} />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                    autoComplete="email"
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div className="login-field">

                <label>
                  Password
                </label>

                <div className="login-input-wrap">

                  <LockKeyhole size={18} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(e) =>
                      updateField(
                        "password",
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
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

              {/* CONFIRM PASSWORD */}
              <div className="login-field">

                <label>
                  Confirm password
                </label>

                <div className="login-input-wrap">

                  <LockKeyhole size={18} />

                  <input
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    placeholder="Re-enter your password"
                    value={
                      form.confirmPassword
                    }
                    onChange={(e) =>
                      updateField(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirm(
                        !showConfirm
                      )
                    }
                  >
                    {showConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* TERMS */}
              <label className="register-terms">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Terms of Service will be available here."
                      )
                    }
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Privacy Policy will be available here."
                      )
                    }
                  >
                    Privacy Policy
                  </button>
                  .
                </span>

              </label>

              {/* ERROR */}
              {error && (
                <div className="login-error register-error">
                  {error}
                </div>
              )}

              {/* REGISTER */}
              <button
                type="submit"
                className="login-submit"
              >
                Create Account
                <span>→</span>
              </button>

            </form>

            {/* DIVIDER */}
            <div className="login-divider">
              <span>
                OR CONTINUE WITH
              </span>
            </div>

            {/* SOCIAL */}
            <div className="login-socials">

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Google registration will be connected with backend."
                  )
                }
              >
                <span className="google-letter">
                  G
                </span>

                Google
              </button>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Apple registration will be connected with backend."
                  )
                }
              >
                <span className="apple-symbol">
                  ●
                </span>

                Apple
              </button>

            </div>

            {/* LOGIN */}
            <div className="login-register">

              <span>
                Already have an account?
              </span>

              <button
                type="button"
                onClick={onLogin}
              >
                Sign in
              </button>

            </div>

            <div className="login-security">

              <LockKeyhole size={13} />

              Your information is protected
              with secure authentication.

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}