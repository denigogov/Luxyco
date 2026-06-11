import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { SelectTypes } from "../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { BreadcrumbsTypes } from "../../../../whitelabel/src/molecules/Breadcrumbs/m-breadcrumbs.types";
import type { ButtonGroupTypes } from "../../../../whitelabel/src/molecules/buttonGroup/buttonGroup.types";
import type { ConfirmDialogTypes } from "../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { PrintActionGroupTypes } from "../../../../whitelabel/src/molecules/printActionGroup/printActionGroup.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";
import type { DetailsOrderTypes } from "./detailsOrder.types";

const table: TableTypes = {
  tooltipSelectAll: "селектирај ги сите",
  noResultMessage: "Нема резултати за зададените филтри",
  enableMultiSelect: false,
  striped: false,
  responsive: false,
  hover: true,
  enableRowClick: true,
  type: "orders/details",
  columns: [
    {
      header: "Код/QR",
      key: "qrCode",
      enableSort: true,
      truncate: {
        enabled: true,
        length: 12,
      },
    },
    {
      header: "Продукут",
      key: "product",
    },
    {
      header: "Димензија ",
      key: "dimension",
    },

    {
      header: "Цена",
      key: "price",
      enableSort: true,
    },

    {
      header: "Забелешка",
      key: "note",
      truncate: {
        enabled: true,
        length: 20,
      },
    },

    {
      header: "Измерен од",
      key: "messuredBy",
      enableSort: false,
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
      qrCode: "ORD-1776464834703-ZOW3RQ",
      product: "Тепих",
      dimension: "2.1 * 2.2 (6.2 m2)",
      price: "350",
      note: "Излочкан тепих смрдлив",
      messuredBy: "Максим Димитриевски",
    },
    {
      id: "2",
      qrCode: "ORD-1776464834703-ZOW3RQ",
      product: "Тепих",
      dimension: "2.1 * 2.2 (6.2 m2)",
      price: "350",
      note: "Излочкан тепих смрдлив",
      messuredBy: "Максим Димитриевски",
    },
    {
      id: "3",
      qrCode: "ORD-1776464834703-1776464",
      product: "Стапка",
      dimension: "22.1 * 21.2 (22.2 m2)",
      price: "350",
      note: "Излочкан  смрдлив",
      messuredBy: "Џоко Вагленаор",
    },
    {
      id: "4",
      qrCode: "ORD-1776464834703-834703",
      product: "Ќебе",
      dimension: "71.1 * 2.2 (12.2 m2)",
      price: "350",
      note: "Излочкан тепих смрдлив",
      messuredBy: "Максим Рацин",
    },
    {
      id: "5",
      qrCode: "ORD-5276464834703-OW3RQQ",
      product: "Тепих",
      dimension: "1.1 * 5.2 (3.2 m2)",
      price: "350",
      note: "Излочкан тепих смрдлив",
      messuredBy: "Кочо Рацин",
    },
  ],

  actionButtons: {
    modals: [
      {
        openButton: {
          label: "Избриши",
          size: "medium",
          style: "text",
          role: "delete",
        },
      },
    ],
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

const breadcrumps: BreadcrumbsTypes = {
  dropdown: {
    openButton: {
      label: "отвори",
      style: "link",
      icon: { name: "cog" },
      onlyIcon: true,
    },
    items: {
      buttons: [
        {
          name: "editOrder",
          label: "Уреди Налог",
          style: "link",
          icon: { name: "pencil" },
        },
      ],
      modals: [
        {
          openButton: {
            label: "Избриши налог",
            style: "link",
            icon: { name: "trash" },
          },
        },
      ],
    },
  },
  returnLink: {
    label: "Врати се назад",
    style: "link",
    icon: { name: "chevron-left" },
  },
};

const confirmDeleteOrderDialog: ConfirmDialogTypes = {
  type: "danger",
  title: "Избриши Налог",
  message:
    "Оваа акција ќе го избрише налогот и сите поврзани податоци. Дали сакате да продолжите?",
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

const buttonGroup: ButtonGroupTypes = {
  buttons: [
    {
      label: "Скенирај парче",
      icon: {
        name: "camera",
      },
      style: "default",
      className: "m-buttonGroup__item--scan",
    },
    {
      label: "Додади парче",
      icon: {
        name: "plus",
      },
      style: "default",
      className: "m-buttonGroup__item--add",
    },
    {
      label: "Сметка за Печатење",
      icon: {
        name: "print",
      },
      role: "bill",
      style: "default",
      className: "m-buttonGroup__item--bill",
    },
    {
      label: "Печати етикета / фактура",
      icon: {
        name: "print",
      },
      role: "print",
      style: "default",
      className: "m-buttonGroup__item--print",
    },
  ],
};

const printActionGroup: PrintActionGroupTypes = {
  successIcon: false,
  heading: {
    headline: {
      text: "Повторно печатење",
      size: "h2",
      position: "center",
    },
    subline: {
      text: "Изберете дали сакате повторно да го испечатите главниот тикет или налепниците за парчињата.",
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
};

const refreshDataButton: ButtonTypes = {
  label: "освежи податоци",
  icon: { name: "refresh" },
  style: "link",
  size: "large",
  onlyIcon: true,
  tooltip: "освежи податоци",
};

const orderStatusSelect: SelectTypes = {
  name: "orderStatusId",
  label: "Статус",
  options: [
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
  ],
};

const notification = {
  success: {
    title: "Ажурирањето е успешно",
    text: "Нарачката е ажурирана со новиот статус.",
  },
  error: {
    title: "Ажурирањето не беше успешно",
    text: "Не можевме да го ажурираме статусот на нарачката. Обидете се повторно.",
  },

  notAllowed: {
    title: "Пристап одбиен",
    text: "Немате дозвола за бришење нарачки.",
  },
};

export const notificationMessages = {
  error: {
    title: "Грешка",
    text: "Нарачката не беше избришана. Обидете се повторно.",
  },

  success: {
    title: "Парчето е избришано",
    text: "Парчето е успешно отстрането од нарачката.",
  },

  notAllowed: {
    title: "Пристап одбиен",
    text: "Немате дозвола за бришење нарачки.",
  },

  notAllowedPieces: {
    title: "Пристап одбиен",
    text: "Немате дозвола за бришење на парчето.",
  },

  notAllowedUpdate: {
    title: "Пристап одбиен",
    text: "Немате дозвола за уредување на нарачките.",
  },

  notAllowedStatusUpdate: {
    title: "Пристап одбиен",
    text: "Нарачката сеуште има неизмерени парчиња",
  },
};

export const deleteButtonModal: ModalTypes = {
  actionButtons: [
    {
      label: "Избриши",
      style: "link",
    },
  ],
};

export const detailsOrderData: DetailsOrderTypes = {
  table,
  breadcrumps,
  confirmDeleteOrderDialog,
  buttonGroup,
  printActionGroup,
  orderStatusSelect,
  notification,
  refreshDataButton,
};
