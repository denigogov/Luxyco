import { useCallback, useEffectEvent, useMemo, useRef, useState } from "react";
import { useDeliveryTypeList } from "../../../../../features/deliveryType/deliveryType.queries";
import { useDataFilters } from "../../../../../utils/hooks/useDataFilters";
import Table from "../../../../../whitelabel/src/molecules/table/M-table";
import {
  deliveryPriceConfigData,
  deliveryTypePrompDeleteMessages,
} from "./deliveryPriceConfig.data";
import {
  CreateDeliveryTypesTags,
  mapDeliveryListTypeToRow,
} from "./deliveryPriceConfighelpers";
import TableFooterPagination from "../../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import ActiveTag from "../../../../../whitelabel/src/molecules/activeTag/ActiveTag";
import ToggleButton from "../../../../../whitelabel/src/atoms/toggle/ToggleButton";
import Button from "../../../../../whitelabel/src/atoms/button/A-Button";
import { useNavigate } from "react-router";
import type { RowTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import type { ModalTypes } from "../../../../../whitelabel/src/organisms/Modal/modal.types";
import ConfirmDialog from "../../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";

const DeliveryPriceConfig: React.FC = () => {
  const navigate = useNavigate();
  const [showActive, setShowActive] = useState<boolean>(true);
  const { page, limit, setFilters, active } = useDataFilters();

  const canDeleteProduct = true;

  const handleNavigateCreateDeliveryType = () => {
    navigate("new");
  };

  const modalCloseRef = useRef<null | (() => void)>(null);

  const closeModal = () => {
    modalCloseRef.current?.();
  };

  const handleDeleteDeliveryType = useEffectEvent(async (row: RowTypes) => {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0 || !canDeleteProduct) return;

    try {
      // await deleteProductMutation.mutateAsync(id);
      closeModal();
      notificationAlert.success(
        deliveryTypePrompDeleteMessages.deleteOne.success,
      );
    } catch (err) {
      notificationAlert.error(deliveryTypePrompDeleteMessages.deleteOne.error);
      console.error(err);
      closeModal();
    }
  });

  const params = useMemo(
    () => ({
      page: page ?? 1,
      limit,
      active,
    }),
    [page, limit, active],
  );

  const { error, isLoading, data, isFetching } = useDeliveryTypeList(params);
  const tableListData = data?.data ?? [];

  const rows = useMemo(() => {
    return tableListData.map(mapDeliveryListTypeToRow);
  }, [tableListData]);
  const handleFilterReset = () => {
    setFilters({
      limit: undefined,
      page: undefined,
      active: undefined,
    });
  };

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  const tags = CreateDeliveryTypesTags({
    setFilters,
    limit,
    page,
    active,
  });

  const toggleActiveDelivery = () => {
    const next = !showActive;

    setShowActive(next);
    setFilters({
      active: next ? undefined : "false",
    });
  };
  const tableActionButton: ModalTypes[] = [
    {
      openButton: { label: "Деактивирај", style: "link" },
      onClose: (close) => (modalCloseRef.current = close),
    },
  ];

  const renderDeleteProductrDialog = useCallback(
    (row: RowTypes) => (
      <ConfirmDialog
        {...deliveryPriceConfigData.confirmationDeleteDialog}
        buttons={[
          { label: "Откажи", style: "default", onClick: closeModal },
          {
            label: row?.status === "Активен" ? "Деактивирај" : "",
            style: "danger",
            onClick: () => {
              row?.status === "Активен"
                ? handleDeleteDeliveryType(row)
                : () => {};
            },
          },
        ]}
      />
    ),
    [closeModal, handleDeleteDeliveryType],
  );

  if (isLoading) return <h1>Loading</h1>;
  if (error) return <h1>error</h1>;

  return (
    <div>
      {" "}
      <br />
      <div className="uk-flex uk-flex-between">
        <Button
          {...deliveryPriceConfigData.createNewProductButton}
          onClick={handleNavigateCreateDeliveryType}
        />
        <ToggleButton
          handleToggleOnClick={toggleActiveDelivery}
          state={showActive}
          toggleText={
            showActive ? "активен тип достава" : "неактивни тип достава"
          }
        />
      </div>
      <ActiveTag
        {...deliveryPriceConfigData.tags}
        items={tags}
        onClearAll={clearAllFilterTags}
        className="b-orders-tags"
      />
      <Table
        {...deliveryPriceConfigData.table}
        rows={rows}
        loading={isFetching}
        loadingVariant="bar+skeleton"
        loadingRows={limit ?? 10}
        onRowDelete={canDeleteProduct ? handleDeleteDeliveryType : undefined}
        renderActionModalChildren={renderDeleteProductrDialog}
        actionButtons={{
          buttons: [
            ...(deliveryPriceConfigData.table?.actionButtons?.buttons ?? []),
          ],
          modals: [...(canDeleteProduct ? tableActionButton : [])],
        }}
      />
      <TableFooterPagination
        {...deliveryPriceConfigData.pagination}
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
      />
    </div>
  );
};

export default DeliveryPriceConfig;
