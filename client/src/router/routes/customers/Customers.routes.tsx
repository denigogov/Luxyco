import { Route } from "react-router";
import Table from "../../../whitelabel/src/molecules/table/M-table";
import { m_tableData } from "../../../whitelabel/src/molecules/table/m-table.data";

export const CustomersRoutes = (
  <Route path="/customers" element={<Table {...m_tableData} />} />
);
