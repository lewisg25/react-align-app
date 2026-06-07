import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../src/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <p className="auth-status">Checking your session...</p>;
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`;

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
