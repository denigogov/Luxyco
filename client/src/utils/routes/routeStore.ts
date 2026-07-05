const LAST_VALID_ROUTE_KEY = "luxyco:lastValidRoute";
const DEFAULT_ROUTE = "/dashboard";

export function setLastValidRoute(path: string) {
  if (!path) return;
  if (path.startsWith("/login")) return;

  sessionStorage.setItem(LAST_VALID_ROUTE_KEY, path);
}

export function getLastValidRoute() {
  return sessionStorage.getItem(LAST_VALID_ROUTE_KEY) ?? DEFAULT_ROUTE;
}
