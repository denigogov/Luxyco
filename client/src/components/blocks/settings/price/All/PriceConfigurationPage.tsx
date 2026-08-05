import { useNavigate } from "react-router";
import Button from "../../../../../whitelabel/src/atoms/button/A-Button";
import TableFooterPagination from "../../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../../whitelabel/src/molecules/table/M-table";
import {
  PriceConfigurationPageData,
  productPrompDeleteMessages,
  productPrompPermanentDeleteMessages,
  productPrompRestoreMessages,
} from "./priceConfigurationPage.data";
import {
  useDeletePermanentProduct,
  useDeleteProduct,
  usePriceList,
  useProductUpdate,
} from "../../../../../features/price/price.queries";
import {
  CreateOrderTags,
  mapPriceListToRow,
} from "./priceConfigurationPage.helpers";
import { useCallback, useEffectEvent, useMemo, useRef, useState } from "react";
import { useDataFilters } from "../../../../../utils/hooks/useDataFilters";
import ActiveTag from "../../../../../whitelabel/src/molecules/activeTag/ActiveTag";
import ConfirmDialog from "../../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";
import type {
  RowTypes,
  TableActionModal,
  TableModalAction,
} from "../../../../../whitelabel/src/molecules/table/m-table.types";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import ToggleButton from "../../../../../whitelabel/src/atoms/toggle/ToggleButton";

const PriceConfigurationPage: React.FC = () => {
  const [showIsActive, setIsActive] = useState<boolean>(true);
  const navigate = useNavigate();
  const deleteProductMutation = useDeleteProduct();
  const deleteProductPermanentMutation = useDeletePermanentProduct();
  const useRestoreProductMutation = useProductUpdate();
  const canDeleteProduct = true;

  const handleNavigateCreateProduct = () => {
    navigate("new");
  };

  const modalCloseRef = useRef<null | (() => void)>(null);

  const closeModal = () => {
    modalCloseRef.current?.();
  };

  const { page, limit, setFilters } = useDataFilters();

  const params = useMemo(
    () => ({
      page: page ?? 1,
      limit,
    }),
    [page, limit],
  );

  const { data, isLoading, error, isFetching } = usePriceList(params);
  let tableListData = data?.data ?? [];

  const displayTableFilterRow = () => {
    setIsActive((e) => !e);
  };

  const rows = useMemo(() => {
    return tableListData
      .filter((item) => item.isActive === showIsActive)
      .map(mapPriceListToRow);
  }, [tableListData, showIsActive]);

  const tableActionButton: TableActionModal[] = showIsActive
    ? [
        {
          actionKey: "deactivate",
          openButton: {
            label: "Деактивирај",
            style: "link",
            role: "delete",
          },
          onClose: (close) => (modalCloseRef.current = close),
        },
      ]
    : [
        {
          actionKey: "restore",
          openButton: {
            label: "Активирај",
            style: "link",
          },
          onClose: (close) => (modalCloseRef.current = close),
        },
        {
          actionKey: "hardDelete",
          openButton: {
            label: "Избриши",
            style: "link",
            role: "delete",
          },
          onClose: (close) => (modalCloseRef.current = close),
        },
      ];

  const handleRestoreProduct = useEffectEvent(async (row: RowTypes) => {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0 || !canDeleteProduct) return;

    try {
      await useRestoreProductMutation.mutateAsync({
        priceID: id,
        isActive: true,
      });
      closeModal();
      notificationAlert.success(productPrompRestoreMessages.restore.success);
    } catch (err) {
      notificationAlert.error(productPrompRestoreMessages.restore.error);
      closeModal();
    }
  });

  const handleDeleteProduct = useEffectEvent(async (row: RowTypes) => {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0 || !canDeleteProduct) return;

    try {
      await deleteProductMutation.mutateAsync(id);
      closeModal();
      notificationAlert.success(productPrompDeleteMessages.deleteOne.success);
    } catch (err) {
      notificationAlert.error(productPrompDeleteMessages.deleteOne.error);
      closeModal();
    }
  });

  const handleHardDeleteProduct = async (row: RowTypes) => {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0 || !canDeleteProduct) return;
    console.log("test", row);

    try {
      await deleteProductPermanentMutation.mutateAsync(id);
      closeModal();
      notificationAlert.success(
        productPrompPermanentDeleteMessages.deleteOne.success,
      );
    } catch (error) {
      notificationAlert.error(
        productPrompPermanentDeleteMessages.deleteOne.error,
      );
      closeModal();
    }
  };

  const handleFilterReset = () => {
    setFilters({
      limit: undefined,
      page: undefined,
    });
  };

  const renderDeleteProductrDialog = useCallback(
    (row: RowTypes, action?: TableModalAction) => {
      if (action === "hardDelete") {
        return (
          <ConfirmDialog
            type="danger"
            title="Трајно избриши продукт?"
            message="Оваа акција е трајна и продуктот не може повторно да се врати."
            buttons={[
              {
                label: "Откажи",
                style: "default",
                onClick: closeModal,
              },
              {
                label: "Избриши",
                style: "danger",
                onClick: () => handleHardDeleteProduct(row),
              },
            ]}
          />
        );
      }

      const isDeactivate = action === "deactivate";

      return (
        <ConfirmDialog
          {...PriceConfigurationPageData.confirmationDeleteDialog}
          title={isDeactivate ? "Деактивирај продукт?" : "Активирај продукт?"}
          buttons={[
            {
              label: "Откажи",
              style: "default",
              onClick: closeModal,
            },
            {
              label: isDeactivate ? "Деактивирај" : "Активирај",
              style: isDeactivate ? "danger" : "tertiary",
              onClick: () =>
                isDeactivate
                  ? handleDeleteProduct(row)
                  : handleRestoreProduct(row),
            },
          ]}
        />
      );
    },
    [],
  );

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  const tags = CreateOrderTags({
    setFilters,
    limit,
    page,
  });

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (error) {
    return <h1>Error Batej</h1>;
  }

  return (
    <div>
      <br />
      <div className="uk-flex uk-flex-between">
        <Button
          {...PriceConfigurationPageData.createNewProductButton}
          onClick={handleNavigateCreateProduct}
        />
        <ToggleButton
          handleToggleOnClick={displayTableFilterRow}
          state={showIsActive}
          toggleText={showIsActive ? "активни продукти" : "неактивни продукти"}
        />
      </div>
      {tags.length > 0 && <br />}
      <ActiveTag
        {...PriceConfigurationPageData.tags}
        items={tags}
        onClearAll={clearAllFilterTags}
        className="b-orders-tags"
      />
      <Table
        {...PriceConfigurationPageData.table}
        rows={rows}
        loading={isFetching}
        loadingVariant="bar+skeleton"
        loadingRows={limit ?? 10}
        renderActionModalChildren={renderDeleteProductrDialog}
        onRowDelete={canDeleteProduct ? handleDeleteProduct : undefined}
        actionButtons={{
          buttons: [
            ...(PriceConfigurationPageData.table?.actionButtons?.buttons ?? []),
          ],
          modals: [...(canDeleteProduct ? tableActionButton : [])],
        }}
      />
      <TableFooterPagination
        {...PriceConfigurationPageData.pagination}
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
      />
    </div>
  );
};

export default PriceConfigurationPage;
