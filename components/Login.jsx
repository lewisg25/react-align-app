import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../src/useAuth";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const requestedRedirect = searchParams.get("redirect");
  const redirectPath =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/dashboard";
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) {
      setError("Google did not return a credential.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);
      await signInWithGoogle(credentialResponse.credential);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-panel">
      <h2>Welcome</h2>
      <p>Use Google to sign in to your dashboard.</p>
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
      {isSubmitting && <p className="auth-status">Creating your session...</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;
