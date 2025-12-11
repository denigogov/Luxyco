const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiGet<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, { credentials: "include", signal });

  if (!res.ok) {
    const err: any = new Error("Request failed");
    err.status = res.status;
    err.body = await res.text().catch(() => "");
    throw err;
  }

  return res.json() as Promise<T>;
}
