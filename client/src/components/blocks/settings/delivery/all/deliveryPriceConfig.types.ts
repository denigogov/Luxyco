import type { DeliveryTypeInterface } from "../../../../../features/deliveryType/deliveryType.types";
import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableFooterPaginationTypes } from "../../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { ConfirmDialogTypes } from "../../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { TableTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";

type SetFilters = (patch: Record<string, unknown>) => void;

export interface CreateDeliveryListTypesTagsArgs {
  setFilters: SetFilters;
  limit?: number;
  page?: number;
  active?: string;
}

export interface DeliveryQueryTypes {
  page?: number;
  limit?: number;
  active?: string;
}

export type DeliveryTypeListResponse = {
  data: DeliveryTypeInterface[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface deliveryPriceConfigTypes {
  table: TableTypes;
  pagination: TableFooterPaginationTypes;
  filters: TableFilterTypes;
  createNewProductButton: ButtonTypes;
  tags: ActiveTagItemTypes;
  confirmationDeleteDialog: ConfirmDialogTypes;
}
