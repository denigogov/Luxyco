import PriceConfigurationPage from "../../../components/blocks/settings/price/All/PriceConfigurationPage";
import PriceConfigurationNew from "../../../components/blocks/settings/price/Create/PriceConfigurationNew";
import PriceConfigurationEdit from "../../../components/blocks/settings/price/Edit/PriceConfigurationEdit";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";

const modalBase: ModalTypes = {
  options: {
    initialOpen: true,
    returnBack: true,
  },
};

export const priceSettingsSubRoutes = [
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
];
