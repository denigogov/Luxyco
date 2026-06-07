import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { ConfirmDialogTypes } from "../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { BoxSectionTypes } from "../../../../whitelabel/src/organisms/BoxSection/o-boxSection.types";

const CustomerOrderTable: TableTypes = {
  classes: "",
  tooltipSelectAll: "Избери ги сите",
  noResultMessage: "Корисникот нема нарачки",
  enableMultiSelect: false,
  striped: false,
  responsive: false,
  hover: false,
  enableRowClick: true,
  type: "orders",
  columns: [
    {
      header: "Бр. нарачка",
      key: "qrCode",
      enableSort: false,
      truncate: {
        enabled: true,
        length: 12,
      },
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

  actionButtons: {
    buttons: [
      {
        label: "Преглед",
        size: "medium",
        style: "text",
        role: "details",
      },
    ],
  },
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

const refreshDataButton: ButtonTypes = {
  label: "освежи податоци",
  icon: { name: "refresh" },
  style: "link",
  size: "large",
  onlyIcon: true,
  tooltip: "освежи податоци",
};

const addressesBox: BoxSectionTypes = {
  noItemsMessage: {
    text: "Корисникот нема додадено адреса",
    button: {
      label: "Додади Нов",
      icon: {
        name: "plus",
      },
      style: "link",
      href: "addresses/new",
    },
  },
  items: [],
};

const confirmDeleteCustomerDialog: ConfirmDialogTypes = {
  type: "danger",
  title: "Избриши Клиент",
  message:
    "Оваа акција ќе го избрише клиентот и сите поврзани податоци. Дали сакате да продолжите?",
  buttons: [
    {
      label: "Откажи",
      style: "default",
      className: "uk-modal-close",
    },
    {
      label: "Избриши",
      style: "danger",
      role: "cancel",
    },
  ],
};

const confirmDeleteAddressDialog: ConfirmDialogTypes = {
  type: "danger",
  title: "Избриши Адреса",
  message:
    "Со бришење на адресата може да влијае на идни испораки/нарачки. Дали сакате да продолжите?",
  buttons: [
    {
      label: "Откажи",
      style: "default",
      className: "uk-modal-close",
    },
    {
      label: "Избриши",
      style: "danger",
      role: "cancel",
    },
  ],
};

const confirmDeleteNoteDialog: ConfirmDialogTypes = {
  type: "danger",
  title: "Избриши забелешка",
  message:
    "Оваа забелешка ќе биде отстранета од системот. Дали сакате да продолжите?",
  buttons: [
    {
      label: "Откажи",
      style: "default",
      className: "uk-modal-close",
    },
    {
      label: "Избриши",
      style: "danger",
      role: "cancel",
    },
  ],
};

export const customerDetailsData = {
  orderTable: CustomerOrderTable,
  customerHeader: {
    callButton,
    newOrderBtn,
    refreshDataButton,
  },
  addressesBox,
  confirmDeleteAddressDialog,
  confirmDeleteCustomerDialog,
  confirmDeleteNoteDialog,
};
