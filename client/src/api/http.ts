// api/http.ts
import {
  getLocalStorage,
  setLocalStorageGroup,
  removeLocalStorageGroup,
} from "../whitelabel/src/global/utils/storage/localStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildUrl(path: string) {
  return path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

type AuthStorage = {
  user?: { id: number; username: string; role: string | null };
  accessToken?: string;
};

function getAuth(): AuthStorage | undefined {
  const storage = getLocalStorage();
  return storage.auth as AuthStorage | undefined;
}

function saveAuth(data: AuthStorage) {
  setLocalStorageGroup("auth", data);
}

function clearAuth() {
  removeLocalStorageGroup("auth");
}

function getAccessToken() {
  return getAuth()?.accessToken ?? null;
}

/**
 * common error helper
 */
async function throwHttpError(res: Response): Promise<never> {
  const err: any = new Error("Request failed");
  err.status = res.status;
  err.body = await res.text().catch(() => "");
  throw err;
}

/** small helper to parse JSON / 204 */
async function parseJsonOrVoid<T>(res: Response): Promise<T> {
  if (!res.ok) {
    await throwHttpError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/** build headers with optional token + json body */
function buildHeaders(init: RequestInit, token: string | null) {
  const base = init.headers ?? {};

  const headers: HeadersInit = {
    ...base,
    ...(init.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return headers;
}

async function refreshAccessToken() {
  const url = buildUrl("/auth/refresh");

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err: any = new Error("Refresh failed");
    err.status = res.status;
    err.body = await res.text().catch(() => "");
    clearAuth();
    throw err;
  }

  const data = (await res.json()) as AuthStorage & {
    user: AuthStorage["user"];
    accessToken: string;
  };

  saveAuth({ user: data.user, accessToken: data.accessToken });

  return data.accessToken;
}

async function requestWithAutoRefresh<T>(
  path: string,
  init: RequestInit = {},
  options?: { allowRefresh?: boolean }
): Promise<T> {
  const url = buildUrl(path);
  const allowRefresh = options?.allowRefresh ?? true;
  const isAuthCall =
    path.includes("/auth/login") || path.includes("/auth/refresh");

  const token = getAccessToken();

  // first request
  let res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: buildHeaders(init, token),
  });

  // if not a case for auto-refresh → parse / throw and return
  if (res.status !== 401 || !allowRefresh || isAuthCall) {
    return parseJsonOrVoid<T>(res);
  }

  // 401 + allowed to refresh → try refresh token
  try {
    const newToken = await refreshAccessToken();

    const retryRes = await fetch(url, {
      ...init,
      credentials: "include",
      headers: buildHeaders(init, newToken),
    });

    return parseJsonOrVoid<T>(retryRes);
  } catch (error) {
    // refresh failed → caller will see 401 and can redirect to /login
    const err: any = error instanceof Error ? error : new Error("Unauthorized");
    if (!err.status) err.status = 401;
    throw err;
  }
}

export function apiGet<T>(path: string, signal?: AbortSignal) {
  return requestWithAutoRefresh<T>(path, { method: "GET", signal });
}

export function apiPost<T>(path: string, body?: unknown, signal?: AbortSignal) {
  return requestWithAutoRefresh<T>(
    path,
    {
      method: "POST",
      signal,
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    {
      allowRefresh:
        !path.includes("/auth/login") && !path.includes("/auth/refresh"),
    }
  );
}
