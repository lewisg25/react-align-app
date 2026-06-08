import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../src/api";
import { useAuth } from "../src/useAuth";

const getSafeRedirect = (redirect) =>
  redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    async function checkEmail() {
      const token = searchParams.get("token");
      const redirectPath = getSafeRedirect(searchParams.get("redirect"));

      if (!token) {
        setMessage("Verification token is missing.");
        return;
      }

      try {
        await verifyEmail(token);
        await refreshUser();
        setMessage("Your email has been verified. Redirecting...");
        navigate(redirectPath, { replace: true });
      } catch (error) {
        setMessage(error.message);
      }
    }

    checkEmail();
  }, [navigate, refreshUser, searchParams]);

  return (
    <div className="auth-panel">
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;
