// utils/routes/roleAccess.ts
import { brandConfig } from "../brands";
import { matchRoutePattern } from "./matchRoutePattern";

type RouteAccessConfig = Record<string, string[]>;

function getRolePatterns(role: string | null | undefined): string[] {
  if (!role) return [];

  let routeAccess: RouteAccessConfig | undefined;

  if ("auth" in brandConfig && brandConfig.auth?.routeAccess) {
    routeAccess = brandConfig.auth.routeAccess as RouteAccessConfig;
  }

  if (!routeAccess) return [];

  return routeAccess[role] ?? [];
}

export function hasRoleAccessToPath(
  pathname: string,
  role: string | null | undefined,
): boolean {
  const patterns = getRolePatterns(role);

  if (!patterns.length) return false;

  // admin (or any role) can have full access via "*"
  if (patterns.includes("*")) return true;

  // check if any pattern matches current path
  return patterns.some((pattern) => matchRoutePattern(pattern, pathname));
}
