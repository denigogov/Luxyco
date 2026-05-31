import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
import PriceConfigurationPage from "../../../components/blocks/settings/price/All/PriceConfigurationPage";
import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import PriceConfigurationNew from "../../../components/blocks/settings/price/Create/PriceConfigurationNew";
import PriceConfigurationEdit from "../../../components/blocks/settings/price/Edit/PriceConfigurationEdit";

import DeliveryPriceConfigCreate from "../../../components/blocks/settings/delivery/create/DeliveryPriceConfigCreate";
import DeliveryPriceConfigEdit from "../../../components/blocks/settings/delivery/edit/DeliveryPriceConfigEdit";
import DeliveryPriceConfig from "../../../components/blocks/settings/delivery/all/DeliveryPriceConfig";

const modalBase: ModalTypes = {
  options: {
    initialOpen: true,
    returnBack: true,
  },
};
const SimpleSetupPage = () => {
  return <h1>Setup Page</h1>;
};

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
    element: <PriceConfigurationPage />,
  },

  // price conig route
  {
    fullPath: "/settings/price/new",
    path: "price/new",
    element: (
      <Modal {...modalBase}>
        <PriceConfigurationNew />,
      </Modal>
    ),
  },
  {
    fullPath: "/settings/price/edit/:id",
    path: "price/edit/:id",
    element: (
      <Modal {...modalBase}>
        <PriceConfigurationEdit />,
      </Modal>
    ),
  },

  // delivery types conig route
  {
    fullPath: "/settings/delivery",
    path: "delivery",
    element: <DeliveryPriceConfig />,
  },
  {
    fullPath: "/settings/delivery/new",
    path: "delivery/new",
    element: (
      <Modal {...modalBase}>
        <DeliveryPriceConfigCreate />,
      </Modal>
    ),
  },
  {
    fullPath: "/settings/delivery/edit/:id",
    path: "delivery/edit/:id",
    element: (
      <Modal {...modalBase}>
        <DeliveryPriceConfigEdit />,
      </Modal>
    ),
  },
];

export const SettingsRoutes = (
  <Route path="/settings">
    <Route index element={<SimpleSetupPage />} />
    {settingsSubRoute
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
