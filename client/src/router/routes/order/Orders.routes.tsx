import { Navigate, Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";

const AllOrder = () => <h1>AllOrder page</h1>;
const Neworder = () => <h1>Neworder page</h1>;

const orderSubRoutes = [
  {
    fullPath: "/order/all-orders",
    path: "all-orders",
    element: <AllOrder />,
  },
  {
    fullPath: "/order/new-order",
    path: "new-order",
    element: <Neworder />,
  },
];

export const OrdersRoutes = (
  <Route path="order">
    <Route index element={<Navigate to="all-orders" replace />} />

    {orderSubRoutes
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
