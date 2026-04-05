// utils/state/Auth.tsx
import { createContext, useState, useEffect, type ReactNode } from "react";
import {
  getLocalStorageGroup,
  removeLocalStorageGroup,
  setLocalStorageGroup,
} from "../../whitelabel/src/global/utils/storage/localStorage";
import { apiPost, refreshAccessToken } from "../../api/http";

export type AuthUser = { id: number; username: string; role: string | null };

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export type AuthContextType = {
  status: AuthStatus;
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  login: (data: { user: AuthUser; accessToken: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// small helper: decode JWT payload safely
function decodeJwt<T = any>(token: string): T | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadBase64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=");

    const json = atob(payloadBase64);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedAuth = getLocalStorageGroup("auth") as
    | { user?: AuthUser; accessToken?: string }
    | undefined;

  const [user, setUser] = useState<AuthUser | null>(storedAuth?.user ?? null);
  const [accessToken, setAccessToken] = useState<string | null>(
    storedAuth?.accessToken ?? null,
  );
  const [status, setStatus] = useState<AuthStatus>("checking");

  const login = (data: { user: AuthUser; accessToken: string }) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setLocalStorageGroup("auth", {
      user: data.user,
      accessToken: data.accessToken,
    });
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      await apiPost("/auth/logout");
    } catch {
      // empty
    }

    setUser(null);
    setAccessToken(null);
    removeLocalStorageGroup("auth");
    setStatus("unauthenticated");
  };

  // Bootstrap: run once on app start
  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      const current = getLocalStorageGroup("auth") as
        | { user?: AuthUser; accessToken?: string }
        | undefined;

      const token = current?.accessToken ?? null;

      //  new behavior: if no token, definitely logged out
      if (!token) {
        setUser(null);
        setAccessToken(null);
        setStatus("unauthenticated");
        return;
      }

      // Token exists → decode and check exp
      type JwtDecoded = { exp?: number };
      const decoded = decodeJwt<JwtDecoded>(token);
      const nowSec = Math.floor(Date.now() / 1000);
      const REFRESH_THRESHOLD_SEC = 60;

      const exp = decoded?.exp;
      const secondsLeft = exp ? exp - nowSec : -1;

      // If no exp, or expired, or about to expire → try refresh
      if (!exp || secondsLeft <= REFRESH_THRESHOLD_SEC) {
        try {
          const newToken = await refreshAccessToken();
          if (cancelled) return;

          const updated = getLocalStorageGroup("auth") as
            | { user?: AuthUser; accessToken?: string }
            | undefined;

          setUser(updated?.user ?? null);
          setAccessToken(newToken);
          setStatus("authenticated");
        } catch {
          if (cancelled) return;
          setUser(null);
          setAccessToken(null);
          setStatus("unauthenticated");
        }
        return;
      }

      // Token is still "fresh enough" → trust it for now
      setStatus("authenticated");
    }

    void initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === "authenticated",
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
