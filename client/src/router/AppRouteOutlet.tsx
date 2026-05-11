import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useUIState } from "../whitelabel/src/global/utils/hooks/useUIState";
import "./_appRouteOutlet.styles.scss";
import Navbar from "../whitelabel/src/organisms/navbar/O-Navbar";
import { o_navbarData } from "../whitelabel/src/organisms/navbar/o-navbar.data";
import { useAuth } from "../utils/hooks/useAuth";
import { allowedPaths } from "../utils/brands";
import { setLastValidRoute } from "../utils/routes/routeStore";
import type { NavbarTypes } from "../whitelabel/src/organisms/navbar/o-navbar.types";
import {
  notifySuccess,
  notifyWarning,
} from "../whitelabel/src/atoms/notification/Notification";
import { hasRoleAccessToPath } from "../utils/routes/roleAccess";
import ErrorWrapper from "../components/blocks/ErrorWrapper";
import { filterNavbarByRole } from "../utils/helpers/filterNavbarByRole";
import QuickContextMenu from "../whitelabel/src/molecules/QuickContextMenu/QuickContextMenu";
import { quickMenuItems } from "../whitelabel/src/molecules/QuickContextMenu/quickContextMenu.data";

const AppRoute: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quickMenu, setQuickMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });
  const { isNavOpen } = useUIState();
  const { isAuthenticated, logout, status, user } = useAuth(); // user has role
  const [isUserOnline, setIsUserOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const path = location.pathname;

    if (allowedPaths.includes(path)) {
      setLastValidRoute(path);
    }
  }, [location.pathname]);

  useEffect(() => {
    const onOnline = () => {
      setIsUserOnline(true);
      notifySuccess({
        title: "Повторно сте онлајн",
        text: "Вашата интернет конекција е стабилна",
        pos: "top-center",
      });
    };

    const onOffline = () => {
      setIsUserOnline(false);

      notifyWarning({
        title: "Немате интернет конекција (офлајн)",
        text: "Брат ми нема интернет",
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

    // if user is already trying to access login (even /login/whatever), just go to /login
    if (target === "/" || target.startsWith("/login")) {
      return <Navigate to="/login" replace />;
    }

    return (
      <Navigate
        to={`/login?redirectTo=${encodeURIComponent(target)}`}
        replace
      />
    );
  }

  const currentPath = location.pathname;
  const role = user?.role ?? null;

  const canAccess = hasRoleAccessToPath(currentPath, role);

  if (!canAccess) {
    return <ErrorWrapper />;
  }

  const navbarForRole = filterNavbarByRole(o_navbarData, role);

  const navbarConfig: NavbarTypes = {
    ...navbarForRole,
    logoutButton: {
      ...navbarForRole.logoutButton,
      onClick: (e) => handleLogoutUser(e),
    },
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest("select") ||
      target.closest("button") ||
      target.closest("a")
    ) {
      return;
    }
    e.preventDefault();
    setQuickMenu({
      open: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div className="app-layout">
      <Navbar {...navbarConfig} />
      <main
        className={`app-main ${isNavOpen ? "app-main--collapsed" : ""}`}
        onContextMenu={handleContextMenu}
      >
        <QuickContextMenu
          open={quickMenu.open}
          x={quickMenu.x}
          y={quickMenu.y}
          items={quickMenuItems}
          onNavigate={(path) => navigate(path)}
          onClose={() =>
            setQuickMenu((prev) => ({
              ...prev,
              open: false,
            }))
          }
        />
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
