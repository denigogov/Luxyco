import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";

const CustomerOrderTable: TableTypes = {
  classes: "",
  tooltipSelectAll: "Избери ги сите",
  noResultMessage: "Корисникот нема нарачки",
  enableMultiSelect: false,
  striped: false,
  responsive: false,
  hover: false,
  type: "order",
  columns: [
    {
      header: "Бр. нарачка",
      key: "qrCode",
      enableSort: false,
    },

    {
      header: "Креирано",
      key: "createdAt",
      enableSort: true,
    },

    {
      header: "Закажано за",
      key: "scheduledDate",
      enableSort: true,
    },
    {
      header: "Статус",
      key: "status",
      enableSort: true,
    },
    {
      header: "Достава",
      key: "deliveryType",
      enableSort: false,
    },

    {
      header: "Вкупна цена",
      key: "totalPrice",
      enableSort: true,
    },

    {
      header: "Вкупна м2",
      key: "totalM2",
      enableSort: true,
    },

    {
      header: "Мерени парчиња",
      key: "messuredPieces",
      enableSort: true,
    },

    {
      header: "Акција",
      key: "action",
      classes: "uk-table-shrink uk-text-nowrap",
    },
  ],

  rows: [
    {
      id: "1",
      createdAt: "20.12.2025",
      scheduledDate: "21.12.2025",
      status: "Завршено",
      deliveryType: "Курирска достава",
      qrCode: "ORD-0001",
      totalPrice: "1.250 ден.",
      messuredPieces: "2/3",
    },
    {
      id: "2",
      createdAt: "21.12.2025",
      scheduledDate: "21.12.2025",
      status: "Завршено",
      deliveryType: "Лично подигање",
      qrCode: "ORD-0002",
      totalPrice: "890 ден.",
      messuredPieces: "2/2",
    },
  ],

  actionButtons: [
    {
      label: "Преглед",
      size: "medium",
      style: "text",
      role: "details",
    },
  ],
};

const callButton: ButtonTypes = {
  label: "Повикај",
  style: "secondary",
  icon: {
    name: "receiver",
  },
};

const newOrderBtn: ButtonTypes = {
  label: "Додади нарачка",
  icon: { name: "plus" },
  style: "secondary",
};

export const customerDetailsData = {
  orderTable: CustomerOrderTable,
  customerHeader: {
    callButton,
    newOrderBtn,
  },
};
