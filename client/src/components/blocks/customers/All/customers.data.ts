import type { CustomersTypes } from "./customers.types";

// data helpers
export const customersData: CustomersTypes = {
  ButtonFilterOpen: {
    label: "Филтери",
    style: "secondary",
    icon: { name: "gitter", position: "right" },
    toggleTarget: "#customers-filters",
  },

  buttonAddCustomer: {
    label: "Нов клиент",
    style: "secondary",
    icon: { name: "plus", position: "right" },
  },

  modalDeleteCustomerBulk: {
    openButton: {
      label: "Избриши",
      style: "danger",
      icon: { name: "trash", position: "right" },
    },
  },

  customSelectButton: {
    label: "",
    style: "default",
    className: "limit_customSelect",
    icon: {
      name: "chevron-down",
      position: "right",
    },
  },

  searchInputData: {
    type: "search",
    label: "Глобално Пребарувај Клиенти",
    icon: {
      name: "search",
      position: "left",
    },
    placeholder: "Пребарај: име • презиме • улица • град • село • телефон",
  },

  confirmationDeleteDialog: {
    type: "danger",
    title: "Избриши Клиент",
    message:
      "Оваа акција ќе го избрише клиентот и сите поврзани податоци. Дали сакате да продолжите?",
  },

  notification: {
    title: "Успешно избришани клиент",
    text: "Клиентите се успешно избришани.",
    pos: "bottom-right",
  },
};
