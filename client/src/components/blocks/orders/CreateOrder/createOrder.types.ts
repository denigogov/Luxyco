import type { SelectTypes } from "../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";

export interface CreateOrderTyeps {
  createCustomerModal: ModalTypes;
  createCustomerAddressModal: ModalTypes;
  selectServiceTypeOpt: SelectTypes;
  selecetDeliveryOpt: SelectTypes;
}

export type CreateOrderItemsType = {
  productTypeId: string;
  quantity: number | string;
  pieceNote?: string;
};

export interface CreateOrderQueryType {
  customerId: number | null;
  deliveryAddressId: number | null;
  deliveryTypeId: string;
  serviceTypeId: string;
  scheduledDate: string;
  orderNote: string;
  items: CreateOrderItemsType[];
}
