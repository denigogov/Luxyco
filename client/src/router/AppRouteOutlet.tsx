import { Navigate, Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import UIkit from "uikit";
import { useUIState } from "../whitelabel/src/global/utils/hooks/useUIState";
import "./_appRouteOutlet.styles.scss";
import Navbar from "../whitelabel/src/organisms/navbar/O-Navbar";
import { o_navbarData } from "../whitelabel/src/organisms/navbar/o-navbar.data";
import { useAuth } from "../utils/hooks/useAuth";
import { allowedPaths } from "../utils/brands";
import { setLastValidRoute } from "../utils/routes/routeStore";

const AppRoute: React.FC = () => {
  const location = useLocation();
  const { isNavOpen } = useUIState();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // @ts-expect-error/won't able to fix type
    UIkit.update();
  }, []);

  useEffect(() => {
    const path = location.pathname;

    if (allowedPaths.includes(path)) {
      setLastValidRoute(path);

      console.log(path);
    }
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Navbar {...o_navbarData} />
      <main className={`app-main ${isNavOpen ? "app-main--collapsed" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppRoute;
