import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { forgotPassword } from "../src/api";
import { useAuth } from "../src/useAuth";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, signUpWithEmail } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [yearsMarried, setYearsMarried] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedRedirect = searchParams.get("redirect");
  const redirectPath =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard";
  const trimmedUserName = userName.trim();
  const trimmedPartnerName = partnerName.trim();
  const isCreatingAccount = authMode === "create";
  const isForgotPassword = authMode === "forgot";
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google did not return a credential.");
      return;
    }

    try {
      setError("");
      setStatus("");
      setIsSubmitting(true);
      await signInWithGoogle(credentialResponse.credential);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    const yearsTogether = Number(yearsMarried);

    try {
      if (!email.trim()) return setError("Enter your email address.");
      if (isForgotPassword) {
        setError("");
        setStatus("");
        setIsSubmitting(true);
        await forgotPassword(email);
        return setStatus("Check your email for password reset instructions.");
      }

      if (!password) return setError("Enter your password.");
      if (isCreatingAccount && password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
      if (
        isCreatingAccount &&
        (!trimmedUserName || !trimmedPartnerName || yearsMarried === "")
      ) {
        return setError("Complete all account details.");
      }

      setError("");
      setStatus("");
      setIsSubmitting(true);
      if (isCreatingAccount) {
        await signUpWithEmail(email, password, yearsTogether, {
          userName: trimmedUserName,
          partnerName: trimmedPartnerName,
        });
        localStorage.setItem("alignUserName", trimmedUserName);
        localStorage.setItem("alignPartnerName", trimmedPartnerName);
      } else {
        await signInWithEmail(email, password);
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-panel">
      <h2>Welcome</h2>
      <p>Log in or create an account with email and password.</p>

      {!isCreatingAccount && !isForgotPassword && (
        <div className="auth-actions">
          {hasGoogleClientId ? (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed.")}
              useOneTap
            />
          ) : (
            <p className="auth-error">Missing VITE_GOOGLE_CLIENT_ID.</p>
          )}
        </div>
      )}

      <form className="email-login-form" onSubmit={handleEmailSubmit}>
        <div className="auth-mode-toggle" aria-label="Choose account action">
          <button
            type="button"
            className={authMode === "login" ? "active" : ""}
            onClick={() => {
              setAuthMode("login");
              setError("");
              setStatus("");
            }}
          >
            Log in
          </button>
          <button
            type="button"
            className={authMode === "create" ? "active" : ""}
            onClick={() => {
              setAuthMode("create");
              setError("");
              setStatus("");
            }}
          >
            Create account
          </button>
        </div>

        <div className="auth-form-grid">
          <label htmlFor="email-login">Email</label>
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />

          {!isForgotPassword && (
            <>
              <label htmlFor="password-login">Password</label>
              <input
                id="password-login"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                autoComplete={
                  isCreatingAccount ? "new-password" : "current-password"
                }
                required
              />
            </>
          )}

          {isCreatingAccount && (
            <>
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
              />
            </>
          )}

          {isCreatingAccount && (
            <>
              <label htmlFor="user-name">Your name</label>
              <input
                id="user-name"
                type="text"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                placeholder="Your name"
                autoComplete="given-name"
                required
              />

              <label htmlFor="partner-name">Partner name</label>
              <input
                id="partner-name"
                type="text"
                value={partnerName}
                onChange={(event) => setPartnerName(event.target.value)}
                placeholder="Your partner's name"
                autoComplete="given-name"
                required
              />

              <label htmlFor="years-married">
                How many years have you been married?
              </label>
              <input
                id="years-married"
                type="number"
                min="0"
                max="80"
                step="1"
                value={yearsMarried}
                onChange={(event) => setYearsMarried(event.target.value)}
                placeholder="0"
                required
              />
            </>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isForgotPassword
            ? "Send reset email"
            : isCreatingAccount
            ? "Create account"
            : "Log in"}
        </button>

        {!isCreatingAccount && (
          <button
            type="button"
            className="auth-link-button"
            onClick={() => {
              setAuthMode(isForgotPassword ? "login" : "forgot");
              setError("");
              setStatus("");
            }}
          >
            {isForgotPassword ? "Back to log in" : "Forgot password?"}
          </button>
        )}
      </form>

      {isSubmitting && <p className="auth-status">Working on it...</p>}
      {status && <p className="auth-status">{status}</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;
