import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { DaterangeTypes } from "../../../../whitelabel/src/atoms/datepicker/a-daterange.types";
import type { InputTypes } from "../../../../whitelabel/src/atoms/input/a-input.types";
import type { TableFooterPaginationTypes } from "../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { ConfirmDialogTypes } from "../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import type { TableSortTypes } from "../../../../whitelabel/src/molecules/tableSort/m-tableSort.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";

export interface AllordersTypes {
  table: TableTypes;
  pagination: TableFooterPaginationTypes;
  filterOpenButton: ButtonTypes;
  filterData: TableFilterTypes;
  sortData: TableSortTypes;
  tags: ActiveTagItemTypes;
  searchInputData: InputTypes;
  scheduledDate: DaterangeTypes;
  newOrderButton: ButtonTypes;
  deleteOrderBtn: ModalTypes;
  confirmationDeleteDialog: ConfirmDialogTypes;
}
