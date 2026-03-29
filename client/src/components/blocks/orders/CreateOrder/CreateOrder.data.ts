import type { CreateOrderTyeps } from "./createOrder.types";

export const createOrderData: CreateOrderTyeps = {
  createCustomerModal: {
    openButton: {
      label: "додади нов",
      style: "text",
    },
    options: {
      initialOpen: false,
      returnBack: false,
    },
  },
};
