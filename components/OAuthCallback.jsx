import { Link } from "react-router-dom";

const OAuthCallback = () => {
  return (
    <div className="auth-panel">
      <h2>Sign In</h2>
      <p>Google sign-in now happens directly from the login page.</p>
      <Link className="btn-submit" to="/login">
        Return to login
      </Link>
    </div>
  );
};

export default OAuthCallback;
