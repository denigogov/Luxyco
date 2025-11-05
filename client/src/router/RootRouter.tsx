import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router";
import AppRouteOutlet from "./AppRouteOutlet";
import { LoginRoutes } from "./routes/login/Login.routes";
import { SettingsRoutes } from "./routes/settings/Settings.routes";

const Kur = () => {
  return (
    <div>
      <h1>Vmro Dpmne 1111</h1>
    </div>
  );
};

const Dashboard = () => <div>Dashboard Route Page</div>;

const routes = createRoutesFromElements(
  <>
    {LoginRoutes}
    <Route path="/" element={<AppRouteOutlet />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="/personal" element={<Kur />} />
      {SettingsRoutes}
    </Route>
  </>
);
export const router = createBrowserRouter(routes);
