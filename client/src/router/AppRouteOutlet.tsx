import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import UIkit from "uikit";
import { useUIState } from "../whitelabel/src/global/utils/hooks/useUIState";
import "./_appRouteOutlet.styles.scss";
import Navbar from "../whitelabel/src/organisms/navbar/O-Navbar";
import { o_navbarData } from "../whitelabel/src/organisms/navbar/o-navbar.data";
import { useAuth } from "../utils/hooks/useAuth";

const AppRoute: React.FC = () => {
  const { isNavOpen } = useUIState();
  useEffect(() => {
    // @ts-expect-error/won't able to fix type
    UIkit.update();
  }, []);

  const { isAuthenticated } = useAuth();
  console.log("APP ROUTE RENDERED", location.pathname, isAuthenticated);

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
