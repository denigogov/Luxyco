import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableFooterPaginationTypes } from "../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import type { TableSortTypes } from "../../../../whitelabel/src/molecules/tableSort/m-tableSort.types";

export interface AllordersTypes {
  table: TableTypes;
  pagination: TableFooterPaginationTypes;
  filterOpenButton: ButtonTypes;
  filterData: TableFilterTypes;
  sortData: TableSortTypes;
  tags: ActiveTagItemTypes;
}
