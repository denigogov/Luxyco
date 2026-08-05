import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableFooterPaginationTypes } from "../../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { ConfirmDialogTypes } from "../../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { TableTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import type { PriceConfigurationPageTypes } from "./priceConfigurationPage.types";

const tableData: TableTypes = {
  type: "settings",
  classes: "",
  tooltipSelectAll: "",
  noResultMessage: "Нема пронајдени резултати",
  enableMultiSelect: false,
  striped: false,
  responsive: false,
  hover: true,
  loadingRows: 5,
  loadingVariant: "bar+skeleton",
  basePath: "/settings/price/edit/",
  columns: [
    {
      header: "Креирано",
      key: "createdAt",
      enableSort: true,
    },
    {
      header: "Продук",
      key: "product",
      enableSort: true,
    },
    {
      header: "Модел",
      key: "priceModel",
      enableSort: true,
    },
    {
      header: "Цена",
      key: "price",
      enableSort: true,
    },
    {
      header: "Статус",
      key: "status",
    },
    {
      header: "Ажурирано",
      key: "updatedAt",
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
      createdAt: "22.05.2026, 21:38",
      status: "Активен",
      product: "Тепих",
      priceModel: "m2",
      price: "400",
      updatedAt: "22.05.2026, 21:38",
      rowMarker: {
        message: "Нарачката сè уште не е целосно измерена",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "2",
      createdAt: "22.05.2026, 21:38",
      status: "Активен",
      product: "Тепих",
      priceModel: "m2",
      price: "400",
      updatedAt: "22.05.2026, 21:38",
      rowMarker: {
        message: "Нарачката сè уште не е целосно измерена",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "3",
      createdAt: "22.05.2026, 21:38",
      status: "Активен",
      product: "Тепих",
      priceModel: "m2",
      price: "400",
      updatedAt: "22.05.2026, 21:38",
      rowMarker: {
        message: "Нарачката сè уште не е целосно измерена",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "4",
      createdAt: "22.05.2026, 21:38",
      status: "Неактивен",
      product: "Тепих",
      priceModel: "m2",
      price: "400",
      updatedAt: "22.05.2026, 21:38",
      rowMarker: {
        message: "Нарачката сè уште не е целосно измерена",
        variant: "warning",
        onlySideMarker: false,
      },
    },
  ],
  enableRowClick: true,

  actionButtons: {
    modals: [
      {
        openButton: {
          label: "Деактивирај",
          size: "medium",
          style: "text",
          role: "delete",
        },
      },
    ],
    buttons: [
      {
        label: "Уреди",
        size: "medium",
        style: "text",
        role: "details",
      },
    ],
  },
};

const pagination: TableFooterPaginationTypes = {
  meta: {
    limit: 20,
    page: 1,
    total: 52215,
    totalPages: 25,
  },
  role: "price",
  limitOptions: [5, 10, 20],
  customSelectButton: {
    label: "",
    style: "default",
    className: "limit_customSelect",
    icon: {
      name: "chevron-down",
      position: "right",
    },
  },
  onLimitChange: () => {},
  onPageChange: () => {},
};

const filters: TableFilterTypes = {
  title: "Филтери",
  filters: [
    {
      keyName: "name",
      label: "Име / Презиме",
      name: "name",
      type: "text",
      icon: { name: "user", position: "right" },
    },

    { keyName: "street", label: "Улица", name: "street", type: "text" },

    { keyName: "city", label: "Град", name: "city", type: "text" },

    { keyName: "village", label: "Село", name: "village", type: "text" },

    {
      keyName: "phoneNumber",
      label: "Телефонски Број",
      name: "phoneNumber",
      type: "tel",
    },
  ],
  actionButton: [
    {
      label: "Барај",
      style: "default",
      type: "submit",
      icon: { name: "search", position: "left" },
    },
    {
      label: "Ресетирај",
      style: "default",
      role: "reset",
      type: "reset",
      icon: { name: "trash", position: "left" },
    },
  ],
};

const createNewProductButton: ButtonTypes = {
  label: "Додади нов продукт",
  style: "secondary",
  icon: { name: "plus", position: "right" },
  role: "navigate",
};

const tags: ActiveTagItemTypes = {
  onClearAll: () => {},
  items: [
    {
      key: "пример-таг",
      value: "Струмица",
      onRemove: () => {},
    },

    {
      key: "пример-клиент",
      value: "Дејан Гогов",
      onRemove: () => {},
    },
  ],
  clearButton: {
    label: "Ресетирај Филтери",
    style: "default",
    role: "reset",
    icon: {
      name: "trash",
      position: "right",
    },
    onlyIcon: true,
    tooltip: "ресетирај сите филтери",
  },
};

export const productPrompDeleteMessages = {
  deleteOne: {
    success: {
      title: "Продуктот е успешно отстранет",
      text: "Продуктот е отстранет од системот.",
    },
    error: {
      title: "Бришењето не беше успешно",
      text: "Не можевме да го отстраниме продуктот во моментов. Ве молиме обидете се повторно.",
    },
  },
};

export const productPrompRestoreMessages = {
  restore: {
    success: {
      title: "Продуктот е успешно активиран",
      text: "Продуктот е активиран во системот.",
    },
    error: {
      title: "Активирањето не беше успешно",
      text: "Не можевме да го активираме продуктот во моментов. Ве молиме обидете се повторно.",
    },
  },
};

export const productPrompPermanentDeleteMessages = {
  deleteOne: {
    success: {
      title: "Продуктот е успешно трајно отстранет",
      text: "Продуктот е трајно отстранет од системот.",
    },
    error: {
      title: "Бришењето не беше успешно",
      text: "Не можевме да го отстраниме продуктот во моментов. Ве молиме обидете се повторно.",
    },
  },
};

const confirmationDeleteDialog: ConfirmDialogTypes = {
  type: "danger",
  title: "Деактивирај Продукт ?",
  message: "Оваа акција ќе го деактивира продуктор, Дали сакате да продолжите?",
  buttons: [
    {
      label: "test",
    },
  ],
};

export const PriceConfigurationPageData: PriceConfigurationPageTypes = {
  table: tableData,
  pagination,
  filters,
  createNewProductButton,
  tags,
  confirmationDeleteDialog,
};
