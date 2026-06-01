import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle, registerAccount, saveAuth } from "../src/api";

const GOOGLE_SCRIPT_ID = "google-identity-services";

function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", resolve, { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const Login = () => {
  // 1. Existing form visibility state
  const [showForm, setShowForm] = useState(false); 
  
  // 2. New state to toggle between Login (true) and Sign Up (false)
  const [isLoginView, setIsLoginView] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [yearsTogether, setYearsTogether] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const navigate = useNavigate();

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    let cancelled = false;

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !googleButtonRef.current) return;

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async ({ credential }) => {
            setError("");
            setIsSubmitting(true);

            try {
              const auth = await loginWithGoogle({ credential });
              saveAuth(auth);
              navigate("/dashboard");
            } catch (err) {
              setError(err.message);
            } finally {
              setIsSubmitting(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 280,
        });
      })
      .catch(() => {
        setError("Google sign-in could not be loaded.");
      });

    return () => {
      cancelled = true;
    };
  }, [googleClientId, navigate, showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Additional validation if the user is signing up
    if (!isLoginView && !firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!isLoginView && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      let auth;

      if (isLoginView) {
        auth = await loginUser({ email, password });
      } else {
        auth = await registerAccount({
          firstName,
          lastName,
          email,
          password,
          yearsTogether,
        });
      }

      saveAuth(auth);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to reset form states when switching tabs
  const handleToggleView = (isLogin) => {
    setIsLoginView(isLogin);
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const googleLogin = googleClientId ? (
    <div className="oauth-section">
      <div ref={googleButtonRef} className="google-button" />
    </div>
  ) : null;

  // Case 1: If showForm is false, give them the initial choice to Sign In or Sign Up
  if (!showForm) {
    return (
      <div className="landing-container">
        <h2>Welcome</h2>
        {googleLogin}
        <div className="landing-actions">
          <button 
            onClick={() => { setShowForm(true); handleToggleView(true); }} 
            className="btn-signin"
          >
            Sign In
          </button>
          <button 
            onClick={() => { setShowForm(true); handleToggleView(false); }} 
            className="btn-signup"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Case 2: If showForm is true, render the dynamic form
  return (
    <div className="form-container">
      {/* Dynamic Header based on state */}
      <h2>{isLoginView ? "Sign In" : "Create Account"}</h2>
      {googleLogin}
      
      {/* Toggle tabs inside the form wrapper so they can switch easily */}
      <div className="form-tabs">
        <button 
          type="button"
          onClick={() => handleToggleView(true)}
          className={isLoginView ? "tab-active" : "tab-inactive"}
        >
          Login
        </button>
        <button 
          type="button"
          onClick={() => handleToggleView(false)}
          className={!isLoginView ? "tab-active" : "tab-inactive"}
        >
          Register
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <main>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="name-grid">
              <div className="input-group">
                <label htmlFor="first-name"><b>First Name</b></label>
                <input
                  type="text"
                  id="first-name"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="last-name"><b>Last Name</b></label>
                <input
                  type="text"
                  id="last-name"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="psw"><b>Password</b></label>
            <input
              type="password"
              id="psw"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Conditional Input: Only shows up during Sign Up */}
          {!isLoginView && (
            <>
              <div className="input-group">
                <label htmlFor="confirm-psw"><b>Confirm Password</b></label>
                <input
                  type="password"
                  id="confirm-psw"
                  placeholder="Repeat Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="years-together"><b>Years Together</b></label>
                <input
                  type="number"
                  id="years-together"
                  min="0"
                  placeholder="0"
                  value={yearsTogether}
                  onChange={(e) => setYearsTogether(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isLoginView ? "Login" : "Sign Up"}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
