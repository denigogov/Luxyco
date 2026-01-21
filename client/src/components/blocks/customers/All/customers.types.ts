import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { InputTypes } from "../../../../whitelabel/src/atoms/input/a-input.types";
import type { ConfirmDialogTypes } from "../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { RowTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";

export interface CustomersTypes {
  ButtonFilterOpen: ButtonTypes;
  customSelectButton: ButtonTypes;
  searchInputData: InputTypes;
  buttonAddCustomer: ButtonTypes;
  buttonDeleteCustomersBuld?: ButtonTypes;
  confirmationDeleteDialog?: ConfirmDialogTypes;
  modalDeleteCustomerBulk?: ModalTypes;
}

// add new type because of the backend nested data
export type CustomerAddress = {
  formattedAddress?: string;
  village?: string;
};

// extendded because of the customerAddresses nested data from backend
export type RowWithAddress = RowTypes & {
  customerAddresses?: CustomerAddress[];
  formattedAddress: string;
  village?: string;
};
