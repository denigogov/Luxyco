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

  printActionGroup: {
    heading: {
      headline: {
        text: "Нарачката е успешна!",
        size: "h2",
        position: "center",
      },
      subline: {
        text: "Одберете ги следните чекори за печатење",
        position: "center",
      },
    },

    closeButton: {
      label: "Затвори и креирај нова нарачка",
      type: "button",
      role: "cancel",
      style: "text",
    },
    buttons: [
      {
        label: "Печати Главен Тикет",
        icon: {
          name: "print",
        },
        type: "button",
        role: "print",
      },

      {
        label: "Печати Налепници",
        type: "button",
        icon: {
          name: "tag",
        },
      },
    ],
    navigationButtons: {
      items: [
        {
          label: "Отвори ја нарачката",
          description: "Прегледај детали за креираната нарачка",
          path: `/orders`,
          icon: "file-text",
          role: "details",
        },
        {
          label: "Детали за Клиентот",
          description: "Прегледајте ги сите детали за клиентот",
          path: "/customers/",
          icon: "users",
          role: "customer-details",
        },
        {
          label: "Сите налози",
          description: "Врати се кон листата со налози",
          path: "/orders",
          icon: "list",
        },
      ],
    },
  },
};
