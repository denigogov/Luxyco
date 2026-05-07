import type { BreadcrumbsTypes } from "../../../../whitelabel/src/molecules/Breadcrumbs/m-breadcrumbs.types";
import type { ButtonGroupTypes } from "../../../../whitelabel/src/molecules/buttonGroup/buttonGroup.types";
import type { ConfirmDialogTypes } from "../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { PrintActionGroupTypes } from "../../../../whitelabel/src/molecules/printActionGroup/printActionGroup.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";

export interface DetailsOrderTypes {
  table: TableTypes;
  breadcrumps: BreadcrumbsTypes;
  confirmDeleteOrderDialog: ConfirmDialogTypes;
  buttonGroup: ButtonGroupTypes;
  printActionGroup: PrintActionGroupTypes;
}
