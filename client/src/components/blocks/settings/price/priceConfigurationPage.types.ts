import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableFooterPaginationTypes } from "../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";

export interface PriceConfigurationPageTypes {
  table: TableTypes;
  pagination: TableFooterPaginationTypes;
  filters: TableFilterTypes;
  createNewProductButton: ButtonTypes;
}
