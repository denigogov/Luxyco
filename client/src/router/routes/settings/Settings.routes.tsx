import { Navigate, Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
import PriceConfigurationPage from "../../../components/blocks/settings/price/PriceConfigurationPage";
import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";

const modalBase: ModalTypes = {
  options: {
    initialOpen: true,
    returnBack: true,
  },
};
const SimpleSetupPage = () => {
  return <h1>Setup Page</h1>;
};

const NewProduct = () => (
  <div>
    <h1>NewProduct</h1> page
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
    element: <PriceConfigurationPage />,
  },

  {
    fullPath: "/settings/price/new",
    path: "price/new",
    element: (
      <Modal {...modalBase}>
        <NewProduct />,
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
