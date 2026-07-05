import { useEffect, useMemo } from "react";
import { allowedPaths } from "../brands";
import { matchRoutePattern } from "./matchRoutePattern";
import { setLastValidRoute } from "./routeStore";

type UseLastValidRouteTrackerArgs = {
  isAuthenticated: boolean;
  pathname: string;
  fullPath: string;
  canAccess: boolean;
};

export function useLastValidRouteTracker({
  isAuthenticated,
  pathname,
  fullPath,
  canAccess,
}: UseLastValidRouteTrackerArgs) {
  const isKnownAppPath = useMemo(() => {
    return allowedPaths.some((pattern) => matchRoutePattern(pattern, pathname));
  }, [pathname]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isKnownAppPath) return;
    if (!canAccess) return;

    setLastValidRoute(fullPath);
  }, [isAuthenticated, isKnownAppPath, canAccess, fullPath]);
}
