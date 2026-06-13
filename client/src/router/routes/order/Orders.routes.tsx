import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
import AllOrders from "../../../components/blocks/orders/AllOrders/AllOrders";
import CreateOrder from "../../../components/blocks/orders/CreateOrder/CreateOrder";
import DetailsOrder from "../../../components/blocks/orders/DetailsOrder/DetailsOrder";
import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import EditOrders from "../../../components/blocks/orders/EditOrders/EditOrders";
import OrderPiecesModal from "../../../components/organisms/orderPiecesModal/OrderPiecesModal";
import AdditionalPieces from "../../../components/blocks/orders/AdditionPieces/AdditionalPieces";

const modalBase: ModalTypes = {
  options: {
    initialOpen: true,
    returnBack: true,
  },
};

const orderSubRoutes = [
  {
    fullPath: "/orders/new",
    path: "new",
    element: <CreateOrder />,
  },
];

const orderDetailsSubRoutee = [
  {
    fullPath: "/orders/:id/edit",
    path: "edit",
    element: (
      <Modal {...modalBase}>
        <EditOrders />
      </Modal>
    ),
  },
  {
    fullPath: "/orders/:id/item/:qr",
    path: "item/:qr",
    element: <OrderPiecesModal />,
  },
  {
    fullPath: "/orders/:id/piece-new",
    path: "piece-new",
    element: (
      <Modal {...modalBase}>
        <AdditionalPieces />
      </Modal>
    ),
  },
];

export const OrdersRoutes = (
  <Route path="orders">
    <Route index element={<AllOrders />} />

    {orderSubRoutes
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}

    <Route path=":id" element={<DetailsOrder />}>
      {orderDetailsSubRoutee
        .filter((r) => allowedPaths.includes(r.fullPath))
        .map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
    </Route>
  </Route>
);
