// Customers.tsx

import { useMemo } from "react";

import { useCustomersList } from "../../../features/customers/customers.queries";
import Table from "../../../whitelabel/src/molecules/table/M-table";
import { m_tableData } from "../../../whitelabel/src/molecules/table/m-table.data";
import type { rowTypes } from "../../../whitelabel/src/molecules/table/m-table.types";
import TableFilter from "../../../whitelabel/src/molecules/tableFilter/M_tableFilter";
import Button from "../../../whitelabel/src/atoms/button/A-Button";
import type { ButtonTypes } from "../../../whitelabel/src/atoms/button/a-button.types";
import ErrorWrapper from "../ErrorWrapper";
import { useDataFilters } from "../../../utils/hooks/useDataFilters";
import { m_tableFilterData } from "../../../whitelabel/src/molecules/tableFilter/m-tableFilter.data";
import type { FilterValues } from "../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import Pagination from "../../../whitelabel/src/atoms/pagination/A-pagination";

const Customers: React.FC = () => {
  const { name, city, phoneNumber, street, setFilters, limit, village } =
    useDataFilters();

  const ButtonFilterOpen: ButtonTypes = {
    label: "Филтери",
    style: "secondary",
    icon: { name: "gitter", position: "right" },
    toggleTarget: "#customers-filters",
  };

  // add new type because of the backend nested data
  type CustomerAddress = {
    formattedAddress?: string;
    village?: string;
  };
  // extendded because of the customerAddresses nested data from backend
  type RowWithAddress = rowTypes & {
    customerAddresses?: CustomerAddress[];
    formattedAddress: string;
    village?: string;
  };

  const params = useMemo(
    () => ({ name, city, phoneNumber, street, limit, village }),
    [name, city, phoneNumber, street, limit, village]
  );

  const { data, isLoading, error } = useCustomersList(params);
  const rawRows: RowWithAddress[] = (data as any)?.data ?? [];

  const rows = rawRows.map((c) => ({
    ...c,
    formattedAddress: `${
      c.customerAddresses?.[0]?.formattedAddress ?? "Клиентот нема адреса"
    }  ${
      c.customerAddresses?.[0]?.village
        ? "/" + c.customerAddresses?.[0]?.village
        : ""
    }`,
  }));

  if (isLoading) return <h1>Loading</h1>;
  if (error) return <ErrorWrapper />;

  const filterValues: FilterValues = {
    name: name ?? "",
    city: city ?? "",
    street: street ?? "",
    phoneNumber: phoneNumber ?? "",
    village: village ?? "",
  };

  const handleFilterReset = () => {
    setFilters({
      name: undefined,
      city: undefined,
      street: undefined,
      phoneNumber: undefined,
      village: undefined,
    });
  };

  const filterButtons: ButtonTypes[] =
    m_tableFilterData.actionButton?.map((btn) => {
      if (btn.role === "reset") {
        return {
          ...btn,
          onClick: () => {
            handleFilterReset();
          },
        };
      }

      return btn;
    }) ?? [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string)?.trim() || undefined;
    const city = (fd.get("city") as string)?.trim() || undefined;
    const street = (fd.get("street") as string)?.trim() || undefined;
    const phoneNumber = (fd.get("phoneNumber") as string)?.trim() || undefined;
    const village = (fd.get("village") as string)?.trim() || undefined;

    setFilters({ name, city, street, phoneNumber, village });
  };

  return (
    <div>
      <label className="uk-form-label uk-margin-small-right">
        Прикажи по страница
        <select
          value={limit}
          defaultValue={20}
          className="uk-select uk-margin-small-left"
          onChange={(e) =>
            setFilters({
              limit: e.target.value ? parseInt(e.target.value) : undefined,
            })
          }
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
      </label>

      {/* global search */}
      <div className="uk-margin-small-top uk-margin-small-bottom">
        {/* <Input
          {...searchCustomers}
          value={searchDraft}
          onChange={handleSearchChange}
        /> */}
      </div>

      {/* filters offcanvas trigger */}
      <div className="uk-inline uk-margin-small-right">
        <Button {...ButtonFilterOpen} />
      </div>

      {/* sort dropdown */}
      {/* <TableSort
        options={SORT_OPTIONS}
        value={selectedSortKey}
        onChange={handleSortChange}
        filtersCount={filtersCount}
      /> */}

      {/* OFFCANVAS FILTERS */}
      <div
        id="customers-filters"
        uk-offcanvas="overlay: true; flip: true; container"
      >
        <div className="uk-offcanvas-bar">
          <TableFilter
            filters={m_tableFilterData.filters}
            actionButton={filterButtons}
            values={filterValues}
            onSubmit={handleSubmit}
            onReset={handleFilterReset}
          />
        </div>
      </div>

      <Table {...m_tableData} rows={rows} />
      <Pagination
        currentPage={2}
        pageSize={10}
        totalItems={120}
        siblingCount={1}
      />
    </div>
  );
};

export default Customers;
