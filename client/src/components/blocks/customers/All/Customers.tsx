// Customers.tsx

import { useEffect, useMemo, useState } from "react";

import { useCustomersList } from "../../../../features/customers/customers.queries";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import { m_tableData } from "../../../../whitelabel/src/molecules/table/m-table.data";
import TableFilter from "../../../../whitelabel/src/molecules/tableFilter/M_tableFilter";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import ErrorWrapper from "../../ErrorWrapper";
import { useDataFilters } from "../../../../utils/hooks/useDataFilters";
import { m_tableFilterData } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFilter.data";
import type { FilterValues } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import TableSort from "../../../../whitelabel/src/molecules/tableSort/M_tableSort";
import { m_tableSortData } from "../../../../whitelabel/src/molecules/tableSort/m-tableSort.data";
import type { SortOption } from "../../../../whitelabel/src/molecules/tableSort/m-tableSort.types";
import Input from "../../../../whitelabel/src/atoms/input/a-input";
import { useDebouncer } from "../../../../utils/helpers/debouncer";
import type { ActiveTagItem } from "../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import ActiveTag from "../../../../whitelabel/src/molecules/activeTag/ActiveTag";
import { m_activeTagData } from "../../../../whitelabel/src/molecules/activeTag/m-activeTag.data";
import TableFooterPagination from "../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import { customersData } from "./customers.data";
import type { RowWithAddress } from "./customers.types";

// add new type because of the backend nested data

const Customers: React.FC = () => {
  const [resetLocalSort, setResetLocalSort] = useState<boolean>(false);

  const {
    name,
    city,
    phoneNumber,
    street,
    setFilters,
    limit,
    village,
    sortBy,
    sortDir,
    page,
    search,
  } = useDataFilters();

  const params = useMemo(
    () => ({
      name,
      city,
      phoneNumber,
      street,
      limit,
      village,
      sortBy,
      sortDir,
      page,
      search,
    }),
    [
      name,
      city,
      phoneNumber,
      street,
      limit,
      village,
      sortBy,
      sortDir,
      page,
      search,
    ]
  );

  const [searchInput, setSearchInput] = useState(search ?? "");
  const debouncedSearch = useDebouncer<string>(searchInput, 400);

  useEffect(() => {
    setFilters({
      search: debouncedSearch || undefined,
      page: page ?? 1,
    });
  }, [debouncedSearch]);

  const sortKey = useMemo(() => {
    if (!sortBy || !sortDir) return null;

    const opt = m_tableSortData.options.find(
      (o) => o.sortBy === sortBy && o.sortDir === sortDir
    );

    return opt?.key ?? null;
  }, [sortBy, sortDir]);

  const { data, isLoading, error } = useCustomersList(params);
  const rawRows: RowWithAddress[] = (data as any)?.data ?? [];

  const rows = useMemo(() => {
    return rawRows.map((c) => ({
      ...c,
      formattedAddress: `${
        c.customerAddresses?.[0]?.formattedAddress ?? "Клиентот нема адреса"
      }${
        c.customerAddresses?.[0]?.village
          ? "/" + c.customerAddresses?.[0]?.village
          : ""
      }`,
    }));
  }, [rawRows]);

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
      sortBy: undefined,
      sortDir: undefined,
      limit: undefined,
      search: undefined,
      page: undefined,
    });

    setResetLocalSort((prev) => !prev);
    setSearchInput("");
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

  // filters in modal window
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

  const handleSortValue = (opt: SortOption | null) => {
    if (!opt) {
      setFilters({ sortBy: undefined, sortDir: undefined });
      return;
    }

    setFilters({
      sortBy: opt.sortBy,
      sortDir: opt.sortDir,
    });
  };

  const handleGlobalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    setSearchInput(value);
  };

  const tags: ActiveTagItem[] = [
    name
      ? {
          key: "Име",
          value: name,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ name: undefined });
          },
        }
      : null,

    city
      ? {
          key: "Град",
          value: city,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ city: undefined });
          },
        }
      : null,

    street
      ? {
          key: "Улица",
          value: street,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ street: undefined });
          },
        }
      : null,

    phoneNumber
      ? {
          key: "Тел",
          value: phoneNumber,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ phoneNumber: undefined });
          },
        }
      : null,

    village
      ? {
          key: "Село",
          value: village,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ village: undefined });
          },
        }
      : null,

    searchInput?.trim()
      ? {
          key: "Барај",
          value: searchInput.trim(),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ search: undefined });
            setSearchInput("");
          },
        }
      : null,

    page && page > 1
      ? {
          key: "Страница",
          value: page,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ page: undefined });
          },
        }
      : null,

    sortBy && sortDir
      ? {
          key: "Сортирање",
          value: sortBy || sortDir,
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({ sortBy: undefined, sortDir: undefined });
            setResetLocalSort((prev) => !prev);
          },
        }
      : null,
  ].filter(Boolean) as ActiveTagItem[];

  const onClearAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    handleFilterReset();
  };

  return (
    <div>
      {/* global search */}
      <div className="uk-margin-small-top uk-margin-small-bottom ">
        <Input
          {...customersData.searchInputData}
          onChange={(e) => handleGlobalSearch(e)}
          value={searchInput ?? ""}
        />
      </div>

      {/* TOP BAR (filters + sort) */}
      <div
        className="uk-flex uk-flex-between uk-flex-middle uk-margin-small-bottom uk-grid-small"
        uk-grid="true"
      >
        {/* filters offcanvas trigger */}
        <div className="uk-inline">
          <Button {...customersData.ButtonFilterOpen} />
        </div>

        {/* sort dropdown */}
        <div>
          <TableSort
            {...m_tableSortData}
            value={sortKey} // string | null
            onChange={handleSortValue}
          />
        </div>
      </div>

      <ActiveTag
        items={tags}
        onClearAll={onClearAll}
        className="uk-margin-small-top"
        clearButton={m_activeTagData.clearButton}
      />

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
            title="Филтери"
          />
        </div>
      </div>

      <Table {...m_tableData} rows={rows} resetTable={resetLocalSort} />
      {/* FILTER TABLE FOOTER   */}
      <TableFooterPagination
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
        customSelectButton={customersData.customSelectButton}
        role="customers"
      />
    </div>
  );
};

export default Customers;
