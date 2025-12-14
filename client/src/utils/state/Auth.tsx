import { createContext, useState, type ReactNode } from "react";
import {
  getLocalStorageGroup,
  removeLocalStorageGroup,
  setLocalStorageGroup,
} from "../../whitelabel/src/global/utils/storage/localStorage";

export type AuthUser = { id: number; username: string; role: string | null };

export type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  login: (data: { user: AuthUser; accessToken: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedAuth = getLocalStorageGroup("auth") as
    | { user?: AuthUser; accessToken?: string }
    | undefined;

  const [user, setUser] = useState<AuthUser | null>(storedAuth?.user ?? null);
  const [accessToken, setAccessToken] = useState<string | null>(
    storedAuth?.accessToken ?? null
  );

  const login = (data: { user: AuthUser; accessToken: string }) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setLocalStorageGroup("auth", {
      user: data.user,
      accessToken: data.accessToken,
    });
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    removeLocalStorageGroup("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        user,
        accessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
