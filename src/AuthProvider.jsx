import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getUser,
  logout as logoutRequest,
  startEmailLogin,
  verifyEmailLogin,
} from "./api";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await getUser();
      const nextUser = data?.user || data || null;
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const requestEmailCode = useCallback((email, options) => {
    return startEmailLogin(email, options);
  }, []);

  const verifyEmailCode = useCallback(
    async (email, code) => {
      const data = await verifyEmailLogin(email, code);
      const nextUser = data?.user || (await refreshUser());
      setUser(nextUser || null);
      return { user: nextUser, redirect: data?.redirect };
    },
    [refreshUser]
  );

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      refreshUser,
      requestEmailCode,
      verifyEmailCode,
      signOut,
    }),
    [
      isLoading,
      requestEmailCode,
      refreshUser,
      signOut,
      verifyEmailCode,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
