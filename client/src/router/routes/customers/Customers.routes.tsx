import { Route } from "react-router";
import Table from "../../../whitelabel/src/molecules/table/M-table";
import { m_tableData } from "../../../whitelabel/src/molecules/table/m-table.data";
import { allowedPaths } from "../../../utils/brands";
import CustomerDetails from "../../../whitelabel/src/blocks/customerDetals/CustomerDetails";

const orderSubRoutes = [
  {
    fullPath: "/customers/:customerId",
    path: ":customerId",
    element: <CustomerDetails />,
  },
];

export const CustomersRoutes = (
  <Route path="customers">
    <Route index element={<Table {...m_tableData} />} />

    {orderSubRoutes
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
  </Route>
);
