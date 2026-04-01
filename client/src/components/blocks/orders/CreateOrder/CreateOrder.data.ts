import type { CreateOrderTyeps } from "./createOrder.types";

export const createOrderData: CreateOrderTyeps = {
  createCustomerModal: {
    openButton: {
      label: "додади нов",
      style: "text",
      icon: {
        name: "plus",
      },
    },
    options: {
      initialOpen: false,
      returnBack: false,
    },
  },

  createCustomerAddressModal: {
    openButton: {
      label: "додади нова",
      style: "text",
      icon: {
        name: "plus",
      },
    },
    options: {
      initialOpen: false,
      returnBack: false,
    },
  },

  selectOptionData: {
    label: "Избери Превоз",
    options: [
      {
        label: "За Подигнување",
        value: "doma",
      },
      {
        label: "За Достава",
        value: "domaw",
      },
    ],
  },
};
