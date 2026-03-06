import { useEffect, useMemo, useState } from "react";
import { useOrdersList } from "../../../../features/orders/orders.queries";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import TableFooterPagination from "../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import TableFilter from "../../../../whitelabel/src/molecules/tableFilter/M_tableFilter";
import TableSort from "../../../../whitelabel/src/molecules/tableSort/M_tableSort";
import { allOrdersData } from "./AllOrders.data";
import ErrorWrapper from "../../ErrorWrapper";
import {
  mapOrderToRow,
  toOrdersSortBy,
  toOrdersSortDir,
} from "./allOrders.helpers";
import { useDataFilters } from "../../../../utils/hooks/useDataFilters";
import { useDebouncer } from "../../../../utils/helpers/debouncer";
import type { SortOption } from "../../../../whitelabel/src/molecules/tableSort/m-tableSort.types";
import Input from "../../../../whitelabel/src/atoms/input/a-input";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import { m_tableFilterData } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFilter.data";
import { CreateOrderTags, setFilterValues } from "./OrdersTags";
import ActiveTag from "../../../../whitelabel/src/molecules/activeTag/ActiveTag";

const AllOrders: React.FC = () => {
  // const [resetSelection, setResetSelection] = useState(false);
  const [resetLocalSort, setResetLocalSort] = useState<boolean>(false);

  const {
    setFilters,
    page,
    limit,
    search,
    city,
    village,
    qrCode,
    status,
    deliveryType,
    scheduledFrom,
    scheduledTo,
    createdFrom,
    createdTo,
    sortBy,
    sortDir,
    phoneNumber,
    name,
    street,
  } = useDataFilters();

  const params = useMemo(
    () => ({
      page: page ?? 1,
      limit,
      search,
      city,
      village,
      qrCode,
      status,
      deliveryType,
      scheduledFrom,
      scheduledTo,
      createdFrom,
      createdTo,
      phoneNumber,
      name,
      street,

      sortBy: toOrdersSortBy(sortBy),
      sortDir: toOrdersSortDir(sortDir),
    }),
    [
      page,
      limit,
      search,
      city,
      village,
      qrCode,
      status,
      deliveryType,
      scheduledFrom,
      scheduledTo,
      createdFrom,
      createdTo,
      sortBy,
      sortDir,
      phoneNumber,
      name,
      street,
    ],
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

    const opt = allOrdersData.sortData.options.find(
      (o) => o.sortBy === sortBy && o.sortDir === sortDir,
    );

    return opt?.key ?? null;
  }, [sortBy, sortDir]);

  const { data, isLoading, error, isFetching } = useOrdersList(params);
  const tableListData = data?.data ?? [];

  const rows = useMemo(() => tableListData.map(mapOrderToRow), [tableListData]);

  if (isLoading) return <h1>Loading</h1>;
  if (error) return <ErrorWrapper />;

  // values that are selected and after refresh the inputs are still with value
  const filterValues = setFilterValues({
    name,
    city,
    street,
    phoneNumber,
    village,
    qrCode,
    status,
    deliveryType,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string)?.trim() || undefined;
    const city = (fd.get("city") as string)?.trim() || undefined;
    const street = (fd.get("street") as string)?.trim() || undefined;
    const phoneNumber = (fd.get("phoneNumber") as string)?.trim() || undefined;
    const village = (fd.get("village") as string)?.trim() || undefined;
    const qrCode = (fd.get("qrCode") as string)?.trim() || undefined;
    const status = (fd.get("status") as string)?.trim() || undefined;
    const deliveryType =
      (fd.get("deliveryType") as string)?.trim() || undefined;

    setFilters({
      name,
      city,
      street,
      phoneNumber,
      village,
      qrCode,
      status,
      deliveryType,
    });
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
      qrCode: undefined,
      status: undefined,
      deliveryType: undefined,
      limit: undefined,
      search: undefined,
      page: undefined,
    });

    setResetLocalSort((prev) => !prev);
    setSearchInput("");
  };

  const tableFilterActionButton: ButtonTypes[] =
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

  const tags = CreateOrderTags({
    setFilters,
    setSearchInput,
    setResetLocalSort,
    name,
    city,
    street,
    phoneNumber,
    qrCode,
    status,
    deliveryType,
    village,
    searchInput,
    limit,
    page,
    sortBy,
    sortDir,
  });

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  return (
    <div>
      <input type="date" />

      <Input
        {...allOrdersData.searchInputData}
        onChange={(e) => handleGlobalSearch(e)}
        value={searchInput ?? ""}
      />

      <div
        id="orders-filters"
        uk-offcanvas="overlay: true; flip: true; container"
      >
        <button
          className="uk-offcanvas-close"
          type="button"
          data-uk-close
        ></button>
        <div className="uk-offcanvas-bar">
          <TableFilter
            {...allOrdersData.filterData}
            onSubmit={handleSubmit}
            actionButton={tableFilterActionButton}
            onReset={handleFilterReset}
            values={filterValues}
          />
        </div>
      </div>

      <TableSort
        {...allOrdersData.sortData}
        value={sortKey}
        onChange={handleSortValue}
      />
      <Button {...allOrdersData.filterOpenButton} />
      <ActiveTag
        {...allOrdersData.tags}
        items={tags}
        onClearAll={clearAllFilterTags}
      />
      <Table
        {...allOrdersData.table}
        rows={rows}
        loading={isFetching}
        loadingVariant="bar+skeleton"
        loadingRows={limit ?? 20}
      />
      <TableFooterPagination
        {...allOrdersData.pagination}
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
      />
    </div>
  );
};

export default AllOrders;
