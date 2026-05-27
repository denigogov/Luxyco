import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableFooterPaginationTypes } from "../../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { TableTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";

type SetFilters = (patch: Record<string, unknown>) => void;
export interface CreatePriceListTagsArgs {
  setFilters: SetFilters;
  limit?: number;
  page?: number;
}

export interface PriceConfigurationPageTypes {
  table: TableTypes;
  pagination: TableFooterPaginationTypes;
  filters: TableFilterTypes;
  createNewProductButton: ButtonTypes;
  tags: ActiveTagItemTypes;
}
