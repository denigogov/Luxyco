import type { AccountNameType } from "../../../../../features/users/users.types";
import { ACCOUNT_TYPES_OPTIONS } from "../../../../../utils/helpers/hardcodedDataImportant";
import type { SelectTypes } from "../../../../../whitelabel/src/atoms/formComponents/select/a-select.types";
import type { TableFooterPaginationTypes } from "../../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
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
  basePath: "/settings/users/edit/",
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
          label: "уреди",
          size: "medium",
          style: "text",
          role: "edit",
        },
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
  role: "orders",
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

export const allUsersData: AllUsersTypes = {
  filterByType,
  tableData,
  pagination,
  tags,
};
