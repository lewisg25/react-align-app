import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createEmailAccount,
  getUser,
  loginWithEmail,
  loginWithGoogle,
  logout as logoutRequest,
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

  const signInWithEmail = useCallback(
    async (email, password) => {
      const data = await loginWithEmail(email, password);
      const nextUser = data?.user || (await refreshUser());
      setUser(nextUser || null);
      return nextUser;
    },
    [refreshUser]
  );

  const signInWithGoogle = useCallback(
    async (credential) => {
      const data = await loginWithGoogle(credential);
      const nextUser = data?.user || (await refreshUser());
      setUser(nextUser || null);
      return nextUser;
    },
    [refreshUser]
  );

  const signUpWithEmail = useCallback(
    async (email, password, yearsTogether, coupleProfile) => {
      await createEmailAccount(
        email,
        password,
        yearsTogether,
        coupleProfile
      );
      const data = await loginWithEmail(email, password);
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
      signInWithEmail,
      signInWithGoogle,
      signUpWithEmail,
      signOut,
    }),
    [
      isLoading,
      refreshUser,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      signUpWithEmail,
      user,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
