import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyEmail() {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Email verification failed");
        }

        setSuccess(true);
        setMessage("Your email has been verified!");
      } catch (error) {
        setMessage(error.message);
      }
    }

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>

      {success && <Link to="/login">Go to login</Link>}
    </div>
  );
}

export default VerifyEmail;
