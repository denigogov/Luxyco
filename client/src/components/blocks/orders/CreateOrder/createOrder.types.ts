import type { SelectTypes } from "../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";

export interface CreateOrderTyeps {
  createCustomerModal: ModalTypes;
  createCustomerAddressModal: ModalTypes;
  selectOptionData: SelectTypes;
}
