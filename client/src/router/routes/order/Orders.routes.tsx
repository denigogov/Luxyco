import { Navigate, Route } from "react-router";
import { brandConfig } from "../../../utils/brands";

const AllOrder = () => <h1>AllOrder page</h1>;
const Neworder = () => <h1>Neworder page</h1>;
const allowed = brandConfig.routes.includePaths;

export const OrdersRoutes = (
  <Route path="/order">
    <Route index element={<Navigate to="/order/all-orders" replace />} />
    {allowed.includes("/order/all-orders") && (
      <Route path="all-orders" element={<AllOrder />} />
    )}
    <Route path="new-order" element={<Neworder />} />
  </Route>
);
