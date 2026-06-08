import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { startEmailLogin } from "../src/api";
import { useAuth } from "../src/useAuth";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [yearsMarried, setYearsMarried] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedRedirect = searchParams.get("redirect");
  const redirectPath =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard";
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const yearsTogether = Number(yearsMarried);
  const hasValidYearsMarried = yearsMarried !== "" && yearsTogether >= 0;

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!hasValidYearsMarried) {
      setError("Enter how many years you have been married.");
      return;
    }

    if (!credentialResponse.credential) {
      setError("Google did not return a credential.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await signInWithGoogle(credentialResponse.credential, yearsTogether);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!hasValidYearsMarried) {
        setError("Enter how many years you have been married.");
        return;
      }

      setError("");
      setStatus("");
      setIsSubmitting(true);
      await startEmailLogin(email, redirectPath, yearsTogether);
      setStatus("Check your email for your sign-in link.");
      setEmail("");
    } catch (err) {
      setError(err.message || "We could not send your sign-in link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-panel">
      <h2>Welcome</h2>
      <p>Sign in to your dashboard with Google or email.</p>
      <div className="marriage-years-field">
        <label htmlFor="years-married">How many years have you been married?</label>
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
      </div>
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

      <div className="auth-divider">
        <span>or</span>
      </div>

      <form className="email-login-form" onSubmit={handleEmailSubmit}>
        <label htmlFor="email-login">Continue with email</label>
        <div className="email-login-row">
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            Send Link
          </button>
        </div>
      </form>

      {isSubmitting && <p className="auth-status">Working on it...</p>}
      {status && <p className="auth-status">{status}</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;
