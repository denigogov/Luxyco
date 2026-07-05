import type { AccountNameType } from "../../features/users/users.types";

export const ORDER_STATUS_OPTIONS = [
  {
    value: "1",
    label: "Во Обработка",
  },
  {
    value: "2",
    label: "Се мери",
  },
  {
    value: "3",
    label: "Подготвено за достава",
  },
  {
    value: "4",
    label: "Се доставува",
  },
  {
    value: "5",
    label: "Завршено",
  },
  {
    value: "6",
    label: "Откажано",
  },
];

export const ORDER_STATUS = {
  PROCESSING: 1,
  MEASURING: 2,
  READY_FOR_DELIVERY: 3,
  DELIVERING: 4,
  FINISHED: 5,
  CANCELLED: 6,
};

export const ACCOUNT_TYPES_OPTIONS = [
  {
    label: "Сите",
    value: "all",
  },
  {
    label: "Супер Администратор",
    value: "SUPER_ADMIN",
  },

  {
    label: "Администратор",
    value: "ADMIN",
  },

  { value: "MANAGER", label: "Менаџер" },

  {
    value: "RECEPTION",
    label: "Рецепција",
  },

  { value: "MACHINE_OPERATOR", label: "Оператор" },

  {
    value: "DRIVER",
    label: "Возач",
  },
];

export const formatAccountNames = (type: AccountNameType | string) => {
  switch (type) {
    case "SUPER_ADMIN":
      return "Супер Администратор";

    case "ADMIN":
      return "Администратор";

    case "MANAGER":
      return "Менаџер";

    case "RECEPTION":
      return "Рецепција";

    case "MACHINE_OPERATOR":
      return "Оператор";

    case "DRIVER":
      return "Возач";

    default:
      "-";
  }
};
