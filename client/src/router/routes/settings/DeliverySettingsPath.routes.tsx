import DeliveryPriceConfig from "../../../components/blocks/settings/delivery/all/DeliveryPriceConfig";
import DeliveryPriceConfigCreate from "../../../components/blocks/settings/delivery/create/DeliveryPriceConfigCreate";
import DeliveryPriceConfigEdit from "../../../components/blocks/settings/delivery/edit/DeliveryPriceConfigEdit";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";

const modalBase: ModalTypes = {
  options: {
    initialOpen: true,
    returnBack: true,
  },
};

export const deliverySettingsSubRoutes = [
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
