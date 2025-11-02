import { Outlet } from "react-router";
import Navbar from "../../whitelabel/src/organisms/navbar/O-Navbar";
import { o_navbarData } from "../../whitelabel/src/organisms/navbar/o-navbar.data";
import { useEffect } from "react";
import UIkit from "uikit";
import { useUIState } from "../../whitelabel/src/global/utils/hooks/useUIState";
import "./_appRouteOutlet.styles.scss";

const AppRoute: React.FC = () => {
  const { isNavOpen } = useUIState();
  useEffect(() => {
    // @ts-expect-error
    UIkit.update();
  }, []);

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
