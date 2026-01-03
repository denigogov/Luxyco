import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";

const AllOrder = () => <h1>AllOrder page</h1>;
const Neworder = () => <h1>Neworder page</h1>;
const OrderDetail = () => <h1>Order details page</h1>;

const orderSubRoutes = [
  {
    fullPath: "/orders/:id",
    path: ":id",
    element: <OrderDetail />,
  },
  {
    fullPath: "/orders/new",
    path: "new",
    element: <Neworder />,
  },
];

export const OrdersRoutes = (
  <Route path="orders">
    <Route index element={<AllOrder />} />

    {orderSubRoutes
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
