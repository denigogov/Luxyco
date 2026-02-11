export function ensureJson<T = any>(body: unknown): T | null {
  if (!body) return null;
  if (typeof body === "object") return body as T;
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as T;
    } catch {
      return { message: body } as T;
    }
  }
  return null;
}
