import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
import Customers from "../../../components/blocks/customers/All/Customers";
import CustomerDetails from "../../../components/blocks/customers/Details/CustomerDetails";

const orderSubRoutes = [
  {
    fullPath: "/customers/:customerId",
    path: ":customerId",
    element: <CustomerDetails />,
  },
];

export const CustomersRoutes = (
  <Route path="customers">
    <Route index element={<Customers />} />

    {orderSubRoutes
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
