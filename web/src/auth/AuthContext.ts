import { createContext } from "react";
import type { User } from "../types/auth";

export interface AuthContextValue {
  user: User | null;
  login: (user: User, remember: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
