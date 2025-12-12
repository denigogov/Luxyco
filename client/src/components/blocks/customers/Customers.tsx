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
  // sort options (dynamic-friendly)
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

  const { data, isLoading, error } = useCustomersList();
  const rows: rowTypes[] = (data as any)?.data ?? [];

  if (isLoading) return <h1>Loading</h1>;

  // example !
  if (error && !rows) return <ErrorWrapper />;

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

      <Table {...m_tableData} />
    </div>
  );
};

export default Customers;
