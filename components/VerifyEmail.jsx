import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../src/api";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function confirmEmail() {
      try {
        const data = await verifyEmail(token);
        setStatus(data.message || "Email verified. Stay aligned.");
      } catch (err) {
        setError(err.message);
        setStatus("");
      }
    }

    confirmEmail();
  }, [token]);

  return (
    <main className="form-container">
      <h2>Email Verification</h2>
      {token && status && <p className="product-status">{status}</p>}
      {!token && <p className="error-message">Verification token is missing.</p>}
      {error && <p className="error-message">{error}</p>}
      <Link to="/login">
        <button className="btn-solid">Back to Login</button>
      </Link>
    </main>
  );
};

export default VerifyEmail;
