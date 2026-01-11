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
  buttonDeleteCustomersBuld: {
    label: "Избриши",
    style: "danger",
    icon: { name: "trash", position: "right" },
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
      position: "right",
    },
    placeholder: "име/ презиме/ улица/ град/ село/ телефон",
  },
};
