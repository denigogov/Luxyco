import {
  Activity,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useDeletOrdersBulk,
  useOrderReferencesList,
  useOrdersList,
} from "../../../../features/orders/orders.queries";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import TableFooterPagination from "../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import TableFilter from "../../../../whitelabel/src/molecules/tableFilter/M_tableFilter";
import TableSort from "../../../../whitelabel/src/molecules/tableSort/M_tableSort";
import {
  allOrdersData,
  cancelButtonModalGeneral,
  deleteButtonModalGeneral,
} from "./AllOrders.data";
import ErrorWrapper from "../../ErrorWrapper";
import {
  buildOrdersFilterData,
  canDeleteSelectedOrders,
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
import Datepicker from "../../../../whitelabel/src/atoms/datepicker/Datepicker";
import { daterangeData } from "../../../../whitelabel/src/atoms/datepicker/a-daterange.data";
import type { DaterangeTypes } from "../../../../whitelabel/src/atoms/datepicker/a-daterange.types";
import { useNavigate } from "react-router";
import Modal from "../../../../whitelabel/src/organisms/Modal/Modal";
import ConfirmDialog from "../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";
import "./allOrders.styles.scss";
import type { RowTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";
import { notificationAlert } from "../../../../utils/hooks/notify";
import { PERMISSIONS } from "../../../../utils/brands/permisionKeys";
import useUserPermissions from "../../../../utils/hooks/useUserPermissions";

const toApiDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseApiDate = (value?: string) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const AllOrders: React.FC = () => {
  // const [resetSelection, setResetSelection] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [resetLocalSort, setResetLocalSort] = useState<boolean>(false);
  const navigate = useNavigate();

  const { allowedPermitions } = useUserPermissions();
  const canUserDeleteOrder = allowedPermitions(PERMISSIONS.ORDERS_DELETE);

  const modalCloseRef = useRef<null | (() => void)>(null);
  const deleteOrderMutation = useDeletOrdersBulk();
  const closeDeleteOrderModal = () => {
    modalCloseRef.current?.();
  };

  const handleDeleteOrder = async (row: RowTypes) => {
    if (!row.id) return;

    try {
      await deleteOrderMutation.mutateAsync([Number(row.id)]);
      closeDeleteOrderModal();
      notificationAlert.success({
        title: "Успешно избришено",
        text: `нарачка e успешно избришена}.`,
      });
    } catch (error) {
      notificationAlert.error({
        title: "Грешка",
        text: "Неуспешен обид, Обидете се повторно.",
      });
    }
  };

  const handleDeleteBulkOrders = async () => {
    try {
      console.log("selected orders ID for builk delete", selectedOrders);
      await deleteOrderMutation.mutateAsync(selectedOrders);
      closeDeleteOrderModal();
      notificationAlert.success({
        title: "Успешно избришено",
        text: `${selectedOrders.length} нарачк${selectedOrders.length === 1 ? "а" : "и"} успешно избришен${selectedOrders.length === 1 ? "а" : "и"}.`,
      });
    } catch (error) {
      notificationAlert.error({
        title: "Грешка",
        text: "Неуспешен обид, Обидете се повторно.",
      });
    }
  };

  const { data: referencesData, error: referencesError } =
    useOrderReferencesList();

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

  const [range, setRange] = useState<DaterangeTypes["range"]>({
    start: parseApiDate(createdFrom),
    end: parseApiDate(createdTo),
  });

  const [scheduleRange, setScheduleRange] = useState<DaterangeTypes["range"]>({
    start: parseApiDate(scheduledFrom),
    end: parseApiDate(scheduledTo),
  });

  const [searchInput, setSearchInput] = useState(search ?? "");
  const debouncedSearch = useDebouncer<string>(searchInput, 400);

  const handleCreatedRangeChange = (next: DaterangeTypes["range"]) => {
    setRange(next);
    setFilters({
      createdFrom: next.start ? toApiDate(next.start) : undefined,
      createdTo: next.end ? toApiDate(next.end) : undefined,
      page: 1,
    });
  };

  const handleScheduledRangeChange = (next: DaterangeTypes["range"]) => {
    setScheduleRange(next);
    setFilters({
      scheduledFrom: next.start ? toApiDate(next.start) : undefined,
      scheduledTo: next.end ? toApiDate(next.end) : undefined,
      page: 1,
    });
  };

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

  // cancel button on modal when delete diaolog is open
  const tableActionButton: ModalTypes[] = [
    {
      openButton: { label: "Избриши", style: "link" },
      onClose: (close) => (modalCloseRef.current = close),
    },
  ];

  // table delete button
  const renderDeleteOrderDialog = useCallback(
    (row: RowTypes) => (
      <ConfirmDialog
        {...allOrdersData.confirmationDeleteDialog}
        buttons={[
          { ...cancelButtonModalGeneral, onClick: closeDeleteOrderModal },
          {
            ...deleteButtonModalGeneral,
            onClick: () => {
              handleDeleteOrder(row);
            },
          },
        ]}
      />
    ),
    [closeDeleteOrderModal, handleDeleteOrder],
  );

  const confirmDeleteBulklButtons: ButtonTypes[] = [
    { ...cancelButtonModalGeneral, onClick: closeDeleteOrderModal },
    {
      ...deleteButtonModalGeneral,
      onClick: () => {
        handleDeleteBulkOrders();
      },
    },
  ];

  const { data, isLoading, error, isFetching, refetch } = useOrdersList(params);
  const tableListData = data?.data ?? [];

  const rows = useMemo(() => tableListData.map(mapOrderToRow), [tableListData]);

  const deliveryTypesData = referencesData?.deliveryTypes ?? [];
  const canDeleteSelected = useMemo(
    () =>
      canDeleteSelectedOrders(
        selectedOrders,
        tableListData,
        canUserDeleteOrder,
      ),
    [selectedOrders, tableListData],
  );
  const filterData = useMemo(
    () =>
      buildOrdersFilterData({
        deliveryTypes: deliveryTypesData,
      }),
    [referencesData],
  );

  if (isLoading) return <h1>Loading</h1>;
  if (error || referencesError) return <ErrorWrapper />;

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
    setResetLocalSort((prev) => !prev);
    setSearchInput("");
    setRange({ start: null, end: null });
    setScheduleRange({ end: null, start: null });

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
      createdFrom: undefined,
      createdTo: undefined,
      scheduledFrom: undefined,
      scheduledTo: undefined,
    });
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
    filterData,
    setFilters,
    setSearchInput,
    setResetLocalSort,
    setRange,
    setScheduleRange,
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
    createdFrom,
    createdTo,
    scheduledFrom,
    scheduledTo,
  });

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  const navigateToCreateNewOrder = () => {
    navigate("new");
  };

  return (
    <div className="b-orders">
      <div className="b-orders-toolbar">
        <Input
          {...allOrdersData.searchInputData}
          onChange={(e) => handleGlobalSearch(e)}
          value={searchInput ?? ""}
          className="b-orders-search"
        />

        <Button
          {...allOrdersData.newOrderButton}
          onClick={navigateToCreateNewOrder}
          className="b-orders-new"
        />

        <Button
          {...allOrdersData.filterOpenButton}
          className="b-orders-filter"
        />

        <div className="b-orders-created-date">
          <Datepicker
            {...daterangeData}
            range={range}
            onChange={handleCreatedRangeChange}
            placeholder="креирани нарачки период"
          />
        </div>

        <div className="b-orders-scheduled-date">
          <Datepicker
            {...allOrdersData.scheduledDate}
            range={scheduleRange}
            onChange={handleScheduledRangeChange}
          />
        </div>

        <div className="b-orders-sort">
          <TableSort
            {...allOrdersData.sortData}
            value={sortKey}
            onChange={handleSortValue}
          />
        </div>

        <div className="b-orders-refetch">
          <Button
            {...allOrdersData?.refreshDataButton}
            onClick={() => refetch()}
            disabled={isFetching}
          />
        </div>

        {canDeleteSelected && (
          <div className="b-orders-delete">
            <Activity mode="visible">
              <Modal
                {...allOrdersData.deleteOrderBtn}
                onClose={(close) => (modalCloseRef.current = close)}
              >
                <ConfirmDialog
                  {...allOrdersData.confirmationDeleteDialog}
                  buttons={confirmDeleteBulklButtons}
                  title={
                    selectedOrders.length > 1
                      ? `Избриши ${selectedOrders.length} Нарачки`
                      : "Избриши Нарачка"
                  }
                />
              </Modal>
            </Activity>
          </div>
        )}

        <ActiveTag
          {...allOrdersData.tags}
          items={tags}
          onClearAll={clearAllFilterTags}
          className="b-orders-tags"
        />
      </div>

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
            {...filterData}
            onSubmit={handleSubmit}
            actionButton={tableFilterActionButton}
            onReset={handleFilterReset}
            values={filterValues}
          />
        </div>
      </div>

      <div className="uk-overflow-auto uk-margin-small-top">
        <Table
          {...allOrdersData.table}
          actionButtons={{
            buttons: [...(allOrdersData.table.actionButtons?.buttons ?? [])],
            modals: [...(canUserDeleteOrder ? tableActionButton : [])],
          }}
          rows={rows}
          loading={isFetching}
          loadingVariant="bar+skeleton"
          loadingRows={limit ?? 20}
          setSelectedCustomers={setSelectedOrders}
          renderActionModalChildren={renderDeleteOrderDialog}
          resetTable={resetLocalSort}
        />
      </div>

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
