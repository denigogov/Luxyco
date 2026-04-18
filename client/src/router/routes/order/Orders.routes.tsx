import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
import AllOrders from "../../../components/blocks/orders/AllOrders/AllOrders";
import CreateOrder from "../../../components/blocks/orders/CreateOrder/CreateOrder";
import DetailsOrder from "../../../components/blocks/orders/DetailsOrder/DetailsOrder";

const orderSubRoutes = [
  {
    fullPath: "/orders/:id",
    path: ":id",
    element: <DetailsOrder />,
  },
  {
    fullPath: "/orders/new",
    path: "new",
    element: <CreateOrder />,
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
  </Route>
);
