import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "../src/api";

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const location = useLocation();

  if (!auth?.token) {
    const redirectTo = `${location.pathname}${location.search}`;

    return (
      <Navigate
        to={`/login?mode=signup&redirect=${encodeURIComponent(redirectTo)}`}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
