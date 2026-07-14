import type { SelectTypes } from "../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { PrintActionGroupTypes } from "../../../../whitelabel/src/molecules/printActionGroup/printActionGroup.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";

export interface CreateOrderTyeps {
  createCustomerModal: ModalTypes;
  createCustomerAddressModal: ModalTypes;
  selectServiceTypeOpt: SelectTypes;
  selecetDeliveryOpt: SelectTypes;
  printActionGroup: PrintActionGroupTypes;
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

export interface PrintBulkOrders {
  orderIds: number[];
}

export interface UpdateOrderQueryType {
  orderStatusId?: number;
  customerId?: number;
  deliveryAddressId?: number;
  deliveryTypeId?: number;
  serviceTypeId?: number;
  scheduledDate?: string;
  orderNote?: string | null;
}
export interface UpdateOrderPiece {
  width: number;
  height: number;
  pieceNote?: string | null;
}
