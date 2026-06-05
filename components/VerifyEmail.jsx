import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../src/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkEmail() {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Verification token is missing.");
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
        setMessage("Your email has been verified!");
      } catch (error) {
        setMessage(error.message);
      }
    }

    checkEmail();
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
