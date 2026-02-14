// utils/routes/matchRoutePattern.ts
export function matchRoutePattern(pattern: string, pathname: string): boolean {
  // Strip query + hash: "/orders/123?foo=bar#x" -> "/orders/123"
  const path = pathname.split(/[?#]/)[0];

  // wildcard pattern → match everything
  if (pattern === "*") return true;

  // exact match shortcut
  if (pattern === path) return true;

  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  // different segment count means no match
  if (patternParts.length !== pathParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    const pSeg = patternParts[i];
    const pathSeg = pathParts[i];

    if (pSeg.startsWith(":")) {
      continue;
    }

    // static segment must be identical
    if (pSeg !== pathSeg) {
      return false;
    }
  }

  return true;
}
