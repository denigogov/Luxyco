import { ACCOUNT_TYPES_OPTIONS } from "../../../../../utils/helpers/hardcodedDataImportant";
import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { SelectTypes } from "../../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { TableFooterPaginationTypes } from "../../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { ConfirmDialogTypes } from "../../../../../whitelabel/src/molecules/confirmDialog/m-confirmDialog.types";
import type { TableTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { AllUsersTypes } from "./AllUsers.types";
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
  basePath: "/settings/user/edit/",
  columns: [
    {
      header: "Креирано",
      key: "createdAt",
      enableSort: true,
    },
    {
      header: "Име и Презиме",
      key: "fullName",
      enableSort: true,
    },
    {
      header: "Корисничко име",
      key: "username",
      enableSort: true,
    },
    {
      header: "Ниво",
      key: "accountType",
    },
    {
      header: "Телефон",
      key: "phoneNumber",
    },
    {
      header: "Ажурирано",
      key: "updatedAt",
      enableSort: true,
    },

    {
      header: "Статус",
      key: "status",
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
      fullName: "Дејан Гогов",
      username: "deni.superadmin",
      accountType: "Admin",
      phoneNumber: "078 221 123",
      updatedAt: "22.05.2026, 21:38",
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
  role: "user",
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

const filterByType: SelectTypes = {
  placeholder: "Тип Корисник",
  options: ACCOUNT_TYPES_OPTIONS,
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
const createUserBtn: ButtonTypes = {
  label: "Додади нов корисник",
  icon: {
    name: "user",
    position: "right",
  },
  style: "default",
};

const confirmationDeleteDialog: ConfirmDialogTypes = {
  type: "danger",
  title: "Деактивирај корисник ?",
  message:
    "Оваа акција ќе го деактивира овој корисник, Дали сакате да продолжите?",
  buttons: [
    {
      label: "избриши",
      style: "danger",
      role: "submit",
    },
    {
      label: "Откажи",
      style: "default",
      role: "cancel",
    },
  ],
};

export const userPrompDeleteMessages = {
  deleteOne: {
    success: {
      title: "Корисникот е успешно отстранет",
      text: "Корисникот е отстранет од системот.",
    },
    error: {
      title: "Бришењето не беше успешно",
      text: "Не можевме да го отстраниме овој корисникот во моментов. Ве молиме обидете се повторно.",
    },
  },
};

export const allUsersData: AllUsersTypes = {
  filterByType,
  tableData,
  pagination,
  tags,
  createUserBtn,
  confirmationDeleteDialog,
};
