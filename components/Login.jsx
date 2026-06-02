import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, loginWithGoogle, registerAccount, saveAuth } from "../src/api";

const GOOGLE_SCRIPT_ID = "google-identity-services";
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  yearsTogether: "",
};

const signupFields = [
  { id: "firstName", label: "First Name", placeholder: "Enter First Name", required: true },
  { id: "lastName", label: "Last Name", placeholder: "Enter Last Name" },
  { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "Repeat Password", required: true },
  { id: "yearsTogether", label: "Years Together", type: "number", min: "0", placeholder: "0" },
];

function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();

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

function AuthField({ id, label, form, onChange, type = "text", ...props }) {
  const inputId = id.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

  return (
    <div className="input-group">
      <label htmlFor={inputId}><b>{label}</b></label>
      <input
        id={inputId}
        name={id}
        type={type}
        value={form[id]}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

const Login = () => {
  const [searchParams] = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const requestedRedirect = searchParams.get("redirect");
  const redirectPath =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard";
  const [showForm, setShowForm] = useState(requestedMode === "signup" || requestedMode === "login");
  const [isLoginView, setIsLoginView] = useState(requestedMode !== "signup");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();

  useEffect(() => {
    if (requestedMode !== "signup" && requestedMode !== "login") return;

    setShowForm(true);
    setIsLoginView(requestedMode !== "signup");
  }, [requestedMode]);

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
              navigate(redirectPath);
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
      .catch(() => setError("Google sign-in could not be loaded."));

    return () => {
      cancelled = true;
    };
  }, [googleClientId, navigate, redirectPath, showForm]);

  const handleChange = ({ target }) => {
    setForm((currentForm) => ({ ...currentForm, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) return setError("Please fill in all fields.");
    if (!isLoginView && !form.firstName.trim()) return setError("Please enter your first name.");
    if (!isLoginView && form.password !== form.confirmPassword) return setError("Passwords do not match.");

    setError("");
    setIsSubmitting(true);

    try {
      const auth = isLoginView
        ? await loginUser({ email: form.email, password: form.password })
        : await registerAccount(form);

      saveAuth(auth);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleView = (isLogin) => {
    setIsLoginView(isLogin);
    setError("");
    setForm((currentForm) => ({
      ...currentForm,
      password: "",
      confirmPassword: "",
    }));
  };

  const openForm = (isLogin) => {
    setShowForm(true);
    handleToggleView(isLogin);
  };

  const googleLogin = googleClientId && (
    <div className="oauth-section">
      <div ref={googleButtonRef} className="google-button" />
    </div>
  );

  if (!showForm) {
    return (
      <div className="landing-container">
        <h2>Welcome</h2>
        {googleLogin}
        <div className="landing-actions">
          <button onClick={() => openForm(true)} className="btn-signin">Sign In</button>
          <button onClick={() => openForm(false)} className="btn-signup">Create Account</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>{isLoginView ? "Sign In" : "Create Account"}</h2>
      {googleLogin}

      <div className="form-tabs">
        {[true, false].map((isLogin) => (
          <button
            key={isLogin ? "login" : "register"}
            type="button"
            onClick={() => handleToggleView(isLogin)}
            className={isLoginView === isLogin ? "tab-active" : "tab-inactive"}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        ))}
      </div>

      {error && <p className="error-message">{error}</p>}

      <main>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="name-grid">
              {signupFields.slice(0, 2).map((field) => (
                <AuthField key={field.id} form={form} onChange={handleChange} {...field} />
              ))}
            </div>
          )}

          <AuthField id="email" label="Email" type="email" placeholder="Enter Email" form={form} onChange={handleChange} required />
          <AuthField id="password" label="Password" type="password" placeholder="Enter Password" form={form} onChange={handleChange} required />

          {!isLoginView && signupFields.slice(2).map((field) => (
            <AuthField key={field.id} form={form} onChange={handleChange} {...field} />
          ))}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isLoginView ? "Login" : "Sign Up"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
