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
import ErrorWrapper from "../components/blocks/ErrorWrapper";
import { CustomersRoutes } from "./routes/customers/Customers.routes";

const routesMap: Record<string, any> = {
  settings: SettingsRoutes,
  dashboard: DashboardsRoutes,
  orders: OrdersRoutes,
  customers: CustomersRoutes,
};

const activeRoutes = (brandConfig.routes.includeGroups || [])
  .map((key: string) => routesMap[key])
  .filter(Boolean);

const routes = createRoutesFromElements(
  <>
    {LoginRoutes}
    <Route path="/" element={<AppRouteOutlet />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      {activeRoutes}
      <Route path="*" element={<ErrorWrapper />} />
    </Route>
  </>
);
export const router = createBrowserRouter(routes);
