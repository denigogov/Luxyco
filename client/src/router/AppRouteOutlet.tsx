import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useUIState } from "../whitelabel/src/global/utils/hooks/useUIState";
import "./_appRouteOutlet.styles.scss";
import Navbar from "../whitelabel/src/organisms/navbar/O-Navbar";
import { useAuth } from "../utils/hooks/useAuth";
import type { NavbarTypes } from "../whitelabel/src/organisms/navbar/o-navbar.types";
import { hasRoleAccessToPath } from "../utils/routes/roleAccess";
import ErrorWrapper from "../components/blocks/ErrorWrapper";
import { filterNavbarByRole } from "../utils/helpers/filterNavbarByRole";
import QuickContextMenu from "../whitelabel/src/molecules/QuickContextMenu/QuickContextMenu";
import { quickMenuItems } from "../whitelabel/src/molecules/QuickContextMenu/quickContextMenu.data";
import { QrScanner } from "../whitelabel/src/molecules/qrScanner/QrScanner";
import { MAIN_NAVIGATION_MENU } from "../utils/brands/navigationMenu.global";
import { useLastValidRouteTracker } from "../utils/routes/useLastValidRouteTracker";
import { useNetworkStatus } from "../utils/hooks/useNetworkStatus";
import MobileQuickMenu from "../whitelabel/src/organisms/MobileQuickMenu/o-mobileQuickMenu";
import { MOBILE_QUICK_MENU_ITEMS } from "../whitelabel/src/organisms/MobileQuickMenu/o-mobileQuickMenu.data";
import { filterMobileQuickMenuByNavbar } from "../utils/helpers/filterMobileQuickMenuByNavbar";

const AppRoute: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quickMenu, setQuickMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });
  const { isNavOpen, isMobileQuickMenuVisible, isDesktopQuickMenuVisible } =
    useUIState();
  const isUserOnline = useNetworkStatus();
  const { isAuthenticated, logout, status, user } = useAuth(); // user has role
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);

  const currentPath = location.pathname;
  const currentFullPath = location.pathname + location.search + location.hash;
  const role = user?.role ?? null;

  const canAccess = hasRoleAccessToPath(currentPath, role);

  useLastValidRouteTracker({
    isAuthenticated,
    pathname: currentPath,
    fullPath: currentFullPath,
    canAccess,
  });

  const handleLogoutUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
    navigate("/login", { replace: true });
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

  if (!canAccess) {
    return <ErrorWrapper />;
  }

  const navbarForRole = filterNavbarByRole(MAIN_NAVIGATION_MENU, role);

  const mobileNavbarFiltered = filterMobileQuickMenuByNavbar(
    MOBILE_QUICK_MENU_ITEMS,
    navbarForRole,
  );

  const navbarConfig: NavbarTypes = {
    ...navbarForRole,
    logoutButton: {
      ...navbarForRole.logoutButton,
      onClick: (e) => handleLogoutUser(e),
    },
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktopQuickMenuVisible) return null;

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

  const getOrderQrFromPieceQr = (pieceQr: string) => {
    return pieceQr.replace(/-P\d+$/, "");
  };
  const handleScan = (qrCode: string) => {
    setIsQrScannerOpen(false);

    const isPieceQr = /-P\d+$/.test(qrCode);

    if (!isPieceQr) {
      navigate(`/orders/${encodeURIComponent(qrCode)}`, { replace: true });
      return;
    }

    const orderQrCode = getOrderQrFromPieceQr(qrCode);

    navigate(
      `/orders/${encodeURIComponent(orderQrCode)}/item/${encodeURIComponent(
        qrCode,
      )}`,
    );
  };

  const showMobileQuickMenu =
    isMobileQuickMenuVisible && mobileNavbarFiltered.length > 0;

  return (
    <div className="app-layout">
      <Navbar {...navbarConfig} />
      <main
        className={[
          "app-main",
          isNavOpen && "app-main--collapsed",
          showMobileQuickMenu && "app-main--withMobileQuickMenu",
        ]
          .filter(Boolean)
          .join(" ")}
        onContextMenu={handleContextMenu}
      >
        {/* <Button label="Скенирај" onClick={() => setIsQrScannerOpen(true)} /> */}
        <QrScanner
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          onScan={handleScan}
          onError={(error) => console.error(error)}
        />

        {isDesktopQuickMenuVisible && (
          <QuickContextMenu
            open={quickMenu.open}
            x={quickMenu.x}
            y={quickMenu.y}
            items={quickMenuItems}
            onNavigate={(path) => navigate(path)}
            onScan={() => setIsQrScannerOpen(true)}
            onClose={() =>
              setQuickMenu((prev) => ({
                ...prev,
                open: false,
              }))
            }
          />
        )}
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
      {showMobileQuickMenu && (
        <MobileQuickMenu
          onScan={() => setIsQrScannerOpen(true)}
          items={mobileNavbarFiltered}
        />
      )}
    </div>
  );
};

export default AppRoute;
