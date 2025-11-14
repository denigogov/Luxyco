import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router";
import AppRouteOutlet from "./AppRouteOutlet";
import { LoginRoutes } from "./routes/login/Login.routes";
import { SettingsRoutes } from "./routes/settings/Settings.routes";
import { brandConfig } from "../utils/brands";

import { DashboardsRoutes } from "./routes/dashboard/Dashboard.routes";
import { OrdersRoutes } from "./routes/order/Orders.routes";
import B_Error from "../whitelabel/src/blocks/b-error/b-error";
import { b_errorData } from "../whitelabel/src/blocks/b-error/b-error.data";

const routesMap: Record<string, any> = {
  settings: SettingsRoutes,
  dashboard: DashboardsRoutes,
  order: OrdersRoutes,
};

const activeRoutes = (brandConfig.routes.includeGroups || [])
  .map((key: string) => routesMap[key])
  .filter(Boolean);
const routes = createRoutesFromElements(
  <>
    {LoginRoutes}
    {/* just test */}
    <Route path="*" element={<B_Error {...b_errorData} />} />

    <Route path="/" element={<AppRouteOutlet />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      {activeRoutes}
    </Route>
  </>
);
export const router = createBrowserRouter(routes);
