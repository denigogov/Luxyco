// for the error page needs

let lastValidRoute = "/";

export function setLastValidRoute(path: string) {
  lastValidRoute = path;
}

export function getLastValidRoute() {
  return lastValidRoute;
}
