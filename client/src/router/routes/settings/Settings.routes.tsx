import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
// import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";
import { userSubRoutes } from "./UserSettingsPath.routes";
import { deliverySettingsSubRoutes } from "./DeliverySettingsPath.routes";
import { priceSettingsSubRoutes } from "./PriceSettingsPath.routes";
import SettingsRoot from "../../../components/blocks/settings/SettintsRoot/SettingsRoot";

// const modalBase: ModalTypes = {
//   options: {
//     initialOpen: true,
//     returnBack: true,
//   },
// };

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

  // price route
  ...priceSettingsSubRoutes,

  // delivery settings route
  ...deliverySettingsSubRoutes,

  // user settings route
  ...userSubRoutes,
];

export const SettingsRoutes = (
  <Route path="/settings">
    <Route index element={<SettingsRoot />} />
    {settingsSubRoute
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
