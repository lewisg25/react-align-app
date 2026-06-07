import { useCallback, useEffect, useMemo, useState } from "react";
import { getUser, loginWithGoogle, logout as logoutRequest } from "./api";
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

  const signInWithGoogle = useCallback(
    async (credential) => {
      const data = await loginWithGoogle(credential);
      const nextUser = data?.user || (await refreshUser());
      setUser(nextUser || null);
      return nextUser;
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
      signInWithGoogle,
      signOut,
    }),
    [isLoading, refreshUser, signInWithGoogle, signOut, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
