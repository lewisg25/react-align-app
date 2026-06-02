import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getStoredAuth } from "../src/api";

const ProtectedRoute = ({ children }) => {
  const auth = getStoredAuth();
  const location = useLocation();

  if (!auth?.token) {
    const redirectTo = `${location.pathname}${location.search}`;

    return <Navigate to={`/login?mode=signup&redirect=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
