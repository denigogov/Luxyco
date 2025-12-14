// Customers.tsx

import { useCustomersList } from "../../../features/customers/customers.queries";
import Table from "../../../whitelabel/src/molecules/table/M-table";
import { m_tableData } from "../../../whitelabel/src/molecules/table/m-table.data";
import type { rowTypes } from "../../../whitelabel/src/molecules/table/m-table.types";
import TableFilter from "../../../whitelabel/src/molecules/tableFilter/M_tableFilter";
import Button from "../../../whitelabel/src/atoms/button/A-Button";
import type { ButtonTypes } from "../../../whitelabel/src/atoms/button/a-button.types";
import TableSort from "../../../whitelabel/src/molecules/tableSort/M_tableSort";
import type { SortOption } from "../../../whitelabel/src/molecules/tableSort/M_tableSort";
import ErrorWrapper from "../ErrorWrapper";

const Customers: React.FC = () => {
  const sortOptions: SortOption[] = [
    {
      key: "name_asc",
      label: "Име (А → Ш)",
      sortBy: "name",
      sortDir: "asc",
    },
    {
      key: "name_desc",
      label: "Име (Ш → А)",
      sortBy: "name",
      sortDir: "desc",
    },
    {
      key: "createdAt_desc",
      label: "Прво најново креирани",
      sortBy: "createdAt",
      sortDir: "desc",
    },
    {
      key: "createdAt_asc",
      label: "Прво најстаро креирани",
      sortBy: "createdAt",
      sortDir: "asc",
    },
  ];

  // add new type because of the backend nested data
  type CustomerAddress = {
    formattedAddress?: string;
  };
  // extendded because of the customerAddresses nested data from backend
  type RowWithAddress = rowTypes & {
    customerAddresses?: CustomerAddress[];
    formattedAddress: string;
  };

  const { data, isLoading, error } = useCustomersList();
  const rawRows: RowWithAddress[] = (data as any)?.data ?? [];

  const rows = rawRows.map((c) => ({
    ...c,
    formattedAddress:
      c.customerAddresses?.[0]?.formattedAddress ?? "Клиентот нема адреса",
  }));

  console.log(rows);

  if (isLoading) return <h1>Loading</h1>;
  if (error) return <ErrorWrapper />;

  const ButtonFilterOpen: ButtonTypes = {
    label: "Филтери",
    style: "secondary",
    icon: {
      name: "gitter",
      position: "right",
    },
    toggleTarget: "#test",
  };

  return (
    <div>
      <div className="uk-inline uk-margin-small-right">
        <Button {...ButtonFilterOpen} />
      </div>

      <TableSort options={sortOptions} />

      {/* OFFCANVAS FILTERS */}
      <div
        id="test"
        className=""
        uk-offcanvas="overlay: true; flip: true; container"
      >
        <div className="uk-offcanvas-bar">
          <TableFilter />
        </div>
      </div>

      <Table {...m_tableData} rows={rows} />
    </div>
  );
};

export default Customers;
