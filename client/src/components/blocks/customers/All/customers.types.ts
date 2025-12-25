import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { InputTypes } from "../../../../whitelabel/src/atoms/input/a-input.types";
import type { rowTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";

export interface CustomersTypes {
  ButtonFilterOpen: ButtonTypes;
  customSelectButton: ButtonTypes;
  searchInputData: InputTypes;
}

// add new type because of the backend nested data
export type CustomerAddress = {
  formattedAddress?: string;
  village?: string;
};

// extendded because of the customerAddresses nested data from backend
export type RowWithAddress = rowTypes & {
  customerAddresses?: CustomerAddress[];
  formattedAddress: string;
  village?: string;
};
