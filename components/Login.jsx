import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../src/useAuth";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { requestEmailCode, verifyEmailCode } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [authStep, setAuthStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
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
  const isCreatingAccount = authMode === "create";
  const isCodeStep = authStep === "code";
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedUserName = userName.trim();
  const trimmedPartnerName = partnerName.trim();

  const resetFlow = (nextMode = authMode) => {
    setAuthMode(nextMode);
    setAuthStep("email");
    setCode("");
    setError("");
    setStatus("");
  };

  const accountProfile = () => {
    const yearsTogether = Number(yearsMarried);

    return {
      firstName: trimmedUserName,
      userName: trimmedUserName,
      partnerName: trimmedPartnerName,
      yearsMarried: yearsTogether,
      yearsTogether,
    };
  };

  const requestCode = async () => {
    if (!trimmedEmail) return setError("Enter your email address.");

    if (isCreatingAccount) {
      const yearsTogether = Number(yearsMarried);
      if (!trimmedUserName || !trimmedPartnerName || yearsMarried === "") {
        return setError("Complete all account details.");
      }
      if (!Number.isFinite(yearsTogether) || yearsTogether < 0) {
        return setError("Enter a valid number of years.");
      }
    }

    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      await requestEmailCode(trimmedEmail, {
        redirect: redirectPath,
        createAccount: isCreatingAccount,
        profile: isCreatingAccount ? accountProfile() : {},
      });
      setAuthStep("code");
      setStatus("Check your email for your 6-digit sign-in code.");
    } catch (err) {
      setError(err.message || "Could not send your sign-in code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async () => {
    const trimmedCode = code.trim();

    if (!/^\d{6}$/.test(trimmedCode)) {
      return setError("Enter the 6-digit code from your email.");
    }

    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const data = await verifyEmailCode(trimmedEmail, trimmedCode);
      if (isCreatingAccount) {
        localStorage.setItem("alignUserName", trimmedUserName);
        localStorage.setItem("alignPartnerName", trimmedPartnerName);
      }
      navigate(data?.redirect || redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Could not verify your sign-in code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isCodeStep) {
      await verifyCode();
      return;
    }
    await requestCode();
  };

  return (
    <div className="auth-panel">
      <h2>Welcome</h2>
      <p>
        {isCodeStep
          ? `Enter the code sent to ${trimmedEmail}.`
          : "Log in or create an account with an email code."}
      </p>

      <form className="email-login-form" onSubmit={handleSubmit}>
        {!isCodeStep && (
          <div className="auth-mode-toggle" aria-label="Choose account action">
            <button
              type="button"
              className={authMode === "login" ? "active" : ""}
              onClick={() => resetFlow("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "create" ? "active" : ""}
              onClick={() => resetFlow("create")}
            >
              Create account
            </button>
          </div>
        )}

        <div className="auth-form-grid">
          <label htmlFor="email-login">Email</label>
          <input
            id="email-login"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isCodeStep || isSubmitting}
            required
          />

          {isCodeStep ? (
            <>
              <label htmlFor="email-code">Sign-in code</label>
              <input
                id="email-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="123456"
                autoComplete="one-time-code"
                required
              />
            </>
          ) : (
            isCreatingAccount && (
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
            )
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isCodeStep ? "Verify code" : "Send code"}
        </button>

        {isCodeStep && (
          <button
            type="button"
            className="auth-link-button"
            onClick={() => resetFlow()}
            disabled={isSubmitting}
          >
            Use a different email
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
