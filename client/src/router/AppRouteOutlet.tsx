import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import UIkit from "uikit";
import { useUIState } from "../whitelabel/src/global/utils/hooks/useUIState";
import "./_appRouteOutlet.styles.scss";
import Navbar from "../whitelabel/src/organisms/navbar/O-Navbar";
import { o_navbarData } from "../whitelabel/src/organisms/navbar/o-navbar.data";
import { useAuth } from "../utils/hooks/useAuth";
import { allowedPaths } from "../utils/brands";
import { setLastValidRoute } from "../utils/routes/routeStore";
import type { NavbarTypes } from "../whitelabel/src/organisms/navbar/o-navbar.types";

const AppRoute: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isNavOpen } = useUIState();
  const { isAuthenticated, logout, status } = useAuth();
  const [isUserOnline, setIsUserOnline] = useState(() => navigator.onLine);

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

  useEffect(() => {
    const onOnline = () => {
      setIsUserOnline(true);
      UIkit.notification({
        message: "Повторно сте онлајн ✅",
        status: "success",
        pos: "top-center",
      });
    };

    const onOffline = () => {
      setIsUserOnline(false);
      UIkit.notification({
        message: "Немате интернет конекција (офлајн) ⚠️",
        status: "danger",
        pos: "top-center",
      });
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleLogoutUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/login", { replace: true });
    logout();
  };

  if (status === "checking") {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    const target = location.pathname + location.search + location.hash;

    if (target === "/") {
      return <Navigate to="/login" replace />;
    }

    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(target)}`}
        replace
      />
    );
  }

  const navbarConfig: NavbarTypes = {
    ...o_navbarData,
    logoutButton: {
      ...o_navbarData.logoutButton,
      onClick: (e) => handleLogoutUser(e),
    },
  };

  return (
    <div className="app-layout">
      <Navbar {...navbarConfig} />
      <main className={`app-main ${isNavOpen ? "app-main--collapsed" : ""}`}>
        {!isUserOnline && (
          <div
            className="uk-alert-warning"
            uk-alert="true"
            style={{ margin: 0 }}
          >
            <p className="uk-margin-remove ">
              Офлајн сте. Некои функционалности може да не работат.
            </p>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AppRoute;
