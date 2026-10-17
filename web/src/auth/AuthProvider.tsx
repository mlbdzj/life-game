import { useCallback, useMemo, useState, type ReactNode } from "react";
import { clearUser, loadUser, saveUser } from "../lib/auth";
import type { User } from "../types/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadUser());

  const login = useCallback((nextUser: User, remember: boolean) => {
    saveUser(nextUser, remember);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
