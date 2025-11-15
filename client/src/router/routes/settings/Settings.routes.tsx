import { Navigate, Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";

const Price = () => (
  <div>
    <h1>Price</h1> page
  </div>
);
const Status = () => (
  <div>
    <h1>Status</h1> page
  </div>
);

const settingsSubRoute = [
  {
    fullPath: "/settings/status",
    path: "status",
    element: <Status />,
  },
  {
    fullPath: "/settings/price",
    path: "price",
    element: <Price />,
  },
];

export const SettingsRoutes = (
  <Route path="/settings">
    <Route index element={<Navigate to="/settings/price" replace />} />
    {settingsSubRoute
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
