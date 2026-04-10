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
  selectServiceTypeOpt: {
    label: "Тип на Услуга",
    placeholder: "Изберете Услуга",
    options: [
      {
        label: "За Подигнување",
        value: "1",
      },
      {
        label: "За Достава",
        value: "1",
      },
    ],
  },
  selecetDeliveryOpt: {
    label: "Тип на Достава",
    placeholder: "Изберете Достава",
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
