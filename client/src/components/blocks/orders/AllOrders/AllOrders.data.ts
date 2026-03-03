import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { TableFooterPaginationTypes } from "../../../../whitelabel/src/atoms/pagination/a-tableFooterPagination.types";
import type { ActiveTagItemTypes } from "../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { TableTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import type { TableSortTypes } from "../../../../whitelabel/src/molecules/tableSort/m-tableSort.types";
import type { AllordersTypes } from "./AllOrders.types";
const tableData: TableTypes = {
  type: "orders",
  classes: "",
  tooltipSelectAll: "селектирај ги сите",
  noResultMessage: "Нема резултати за зададените филтри",
  enableMultiSelect: true,
  striped: false,
  responsive: false,
  hover: true,
  loadingRows: 20,
  loadingVariant: "bar+skeleton",
  columns: [
    {
      header: "Статус",
      key: "status",
    },
    {
      header: "Мерење",
      key: "messurmentProgress",
    },

    {
      header: "Клиент",
      key: "firstName",
      enableSort: true,
    },
    {
      header: "Телефонски Број",
      key: "phoneNumber",
    },

    {
      header: "Тип на Испорака",
      key: "deliveryType",
      enableSort: false,
    },

    {
      header: "Закажено за",
      key: "scheduledDate",
      enableSort: true,
    },
    {
      header: "QR Код",
      key: "qrCode",
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
      qrCode: "STRESS-ORD-50028-2",
      messurmentProgress: "2/3",
      status: "Мерење",
      firstName: "Ана Петровска",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      rowMarker: {
        message: "Нарачката сè уште не е целосно измерена",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "2",
      qrCode: "STRESS-ORD-50029-1",
      messurmentProgress: "1/5",
      status: "Чека",
      firstName: "Марко Илиевски",
      deliveryType: "Подигнување",
      scheduledDate: "12.02.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасува мерење (1/5)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "3",
      qrCode: "STRESS-ORD-50030-1",
      messurmentProgress: "5/5",
      status: "Спремна за достава",
      firstName: "Елена Стојановска",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Спремна за закажување на достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "4",
      qrCode: "STRESS-ORD-50031-1",
      messurmentProgress: "5/5",
      status: "Во достава",
      firstName: "Даниел Костадинов",
      deliveryType: "Достава",
      scheduledDate: "02.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е во процес на достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "5",
      qrCode: "STRESS-ORD-50032-1",
      messurmentProgress: "1/1",
      status: "Завршена",
      firstName: "Марија Трајковска",
      deliveryType: "Подигнување",
      scheduledDate: "31.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е завршена",
        variant: "success",
        onlySideMarker: true,
      },
    },
    {
      id: "6",
      qrCode: "STRESS-ORD-50033-1",
      messurmentProgress: "0/3",
      status: "Мерење",
      firstName: "Иван Јовановски",
      deliveryType: "Подигнување",
      scheduledDate: "25.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Мерењето не е започнато (0/3)",
        variant: "danger",
        onlySideMarker: true,
      },
    },
    {
      id: "7",
      qrCode: "STRESS-ORD-50034-1",
      messurmentProgress: "2/9",
      status: "Мерење",
      firstName: "Сара Николовска",
      deliveryType: "Достава",
      scheduledDate: "11.03.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасуваат 7 парчиња за мерење (2/9)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "8",
      qrCode: "STRESS-ORD-50035-1",
      messurmentProgress: "9/9",
      status: "Спремна за достава",
      firstName: "Петар Георгиев",
      deliveryType: "Подигнување",
      scheduledDate: "22.07.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Спремна за подигнување",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "9",
      qrCode: "STRESS-ORD-50036-1",
      messurmentProgress: "3/3",
      status: "Откажана",
      firstName: "Јована Димитрова",
      deliveryType: "Достава",
      scheduledDate: "06.02.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е откажана",
        variant: "danger",
        onlySideMarker: false,
      },
    },
    {
      id: "10",
      qrCode: "STRESS-ORD-50037-1",
      messurmentProgress: "4/5",
      status: "Чека",
      firstName: "Александар Ристевски",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасува 1 парче за мерење (4/5)",
        variant: "warning",
        onlySideMarker: true,
      },
    },

    {
      id: "11",
      qrCode: "STRESS-ORD-50038-1",
      messurmentProgress: "1/3",
      status: "Мерење",
      firstName: "Тамара Поповска",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасуваат 2 парчиња за мерење (1/3)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "12",
      qrCode: "STRESS-ORD-50039-1",
      messurmentProgress: "3/3",
      status: "Спремна за достава",
      firstName: "Борис Митрев",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Спремна за достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "13",
      qrCode: "STRESS-ORD-50040-1",
      messurmentProgress: "0/1",
      status: "Чека",
      firstName: "Катарина Ангеловска",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасува мерење (0/1)",
        variant: "danger",
        onlySideMarker: true,
      },
    },
    {
      id: "14",
      qrCode: "STRESS-ORD-50041-1",
      messurmentProgress: "1/1",
      status: "Во достава",
      firstName: "Владо Тодоров",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е во процес на достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "15",
      qrCode: "STRESS-ORD-50042-1",
      messurmentProgress: "6/6",
      status: "Завршена",
      firstName: "Стефанија Наумовска",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е завршена",
        variant: "success",
        onlySideMarker: true,
      },
    },
    {
      id: "16",
      qrCode: "STRESS-ORD-50043-1",
      messurmentProgress: "2/4",
      status: "Мерење",
      firstName: "Горан Панев",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасуваат 2 парчиња за мерење (2/4)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "17",
      qrCode: "STRESS-ORD-50044-1",
      messurmentProgress: "4/4",
      status: "Спремна за достава",
      firstName: "Наташа Колевска",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Спремна за подигнување",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "18",
      qrCode: "STRESS-ORD-50045-1",
      messurmentProgress: "4/4",
      status: "Во достава",
      firstName: "Филип Савев",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е во процес на достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "19",
      qrCode: "STRESS-ORD-50046-1",
      messurmentProgress: "2/2",
      status: "Завршена",
      firstName: "Мила Лазаревска",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е завршена",
        variant: "success",
        onlySideMarker: true,
      },
    },
    {
      id: "20",
      qrCode: "STRESS-ORD-50047-1",
      messurmentProgress: "0/5",
      status: "Мерење",
      firstName: "Никола Спасов",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      rowMarker: {
        message: "Мерењето не е започнато (0/5)",
        variant: "danger",
        onlySideMarker: true,
      },
    },
    {
      id: "21",
      qrCode: "STRESS-ORD-50048-1",
      messurmentProgress: "5/5",
      status: "Спремна за достава",
      firstName: "Бојана Цветковска",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Спремна за достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "22",
      qrCode: "STRESS-ORD-50049-1",
      messurmentProgress: "3/5",
      status: "Мерење",
      firstName: "Симона Павловска",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасуваат 2 парчиња за мерење (3/5)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "23",
      qrCode: "STRESS-ORD-50050-1",
      messurmentProgress: "1/2",
      status: "Чека",
      firstName: "Дејан Стојчев",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасува мерење (1/2)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "24",
      qrCode: "STRESS-ORD-50051-1",
      messurmentProgress: "2/2",
      status: "Во достава",
      firstName: "Ирена Груевска",
      deliveryType: "Достава",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е во процес на достава",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "25",
      qrCode: "STRESS-ORD-50052-1",
      messurmentProgress: "7/7",
      status: "Завршена",
      firstName: "Виктор Манев",
      deliveryType: "Подигнување",
      scheduledDate: "22.04.2026",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е завршена",
        variant: "success",
        onlySideMarker: true,
      },
    },
    {
      id: "26",
      qrCode: "STRESS-ORD-50053-1",
      messurmentProgress: "1/9",
      status: "Мерење",
      firstName: "Лена Крстевска",
      deliveryType: "Достава",
      scheduledDate: "4.400 ден.",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасуваат 8 парчиња за мерење (1/9)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "27",
      qrCode: "STRESS-ORD-50054-1",
      messurmentProgress: "9/9",
      status: "Спремна за достава",
      firstName: "Андреј Наков",
      deliveryType: "Подигнување",
      scheduledDate: "7.200 ден.",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Спремна за подигнување",
        variant: "info",
        onlySideMarker: true,
      },
    },
    {
      id: "28",
      qrCode: "STRESS-ORD-50055-1",
      messurmentProgress: "9/9",
      status: "Откажана",
      firstName: "Валентина Деспотовска",
      deliveryType: "Достава",
      scheduledDate: "5.600 ден.",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е откажана",
        variant: "danger",
        onlySideMarker: false,
      },
    },
    {
      id: "29",
      qrCode: "STRESS-ORD-50056-1",
      messurmentProgress: "2/6",
      status: "Чека",
      firstName: "Христина Јаневска",
      deliveryType: "Подигнување",
      scheduledDate: "2.850 ден.",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Недостасуваат податоци за мерење (2/6)",
        variant: "warning",
        onlySideMarker: true,
      },
    },
    {
      id: "30",
      qrCode: "STRESS-ORD-50057-1",
      messurmentProgress: "6/6",
      status: "Завршена",
      firstName: "Мартин Тасевски",
      deliveryType: "Достава",
      scheduledDate: "4.950 ден.",
      phoneNumber: "078 231 223",
      rowMarker: {
        message: "Нарачката е завршена",
        variant: "success",
        onlySideMarker: true,
      },
    },
  ],
  enableRowClick: true,

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

      {
        label: "Принтај",
        size: "medium",
        style: "text",
        role: "details",
      },
    ],
  },
};

const tablePaginationData: TableFooterPaginationTypes = {
  meta: {
    limit: 20,
    page: 1,
    total: 52215,
    totalPages: 25,
  },
  role: "orders",
  limitOptions: [10, 20, 30],
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

const filterOpenButton: ButtonTypes = {
  label: "Филтери",
  style: "secondary",
  icon: { name: "cog", position: "right" },
  toggleTarget: "#orders-filters",
};

const sortOpenButton: TableSortTypes = {
  filtersCount: 0,
  openButton: {
    label: "Прво најново креирани",
    style: "default",
    icon: { name: "arrow-down-arrow-up", position: "right" },
  },
  options: [
    {
      key: "name_asc",
      label: "Име (А → Ш)",
      sortBy: "name",
      sortDir: "asc",
    },
    {
      key: "name_desc",
      label: "Име (Ш → А)",
      sortBy: "name",
      sortDir: "desc",
    },
    {
      key: "createdAt_desc",
      label: "Прво најново креирани",
      sortBy: "createdAt",
      sortDir: "desc",
    },
    {
      key: "createdAt_asc",
      label: "Прво најстаро креирани",
      sortBy: "createdAt",
      sortDir: "asc",
    },
  ],
};

const filterData: TableFilterTypes = {
  title: "Детално Пребарувањеи",
  filters: [
    {
      keyName: "name",
      label: "Име / Презиме",
      name: "name",
      type: "text",
      placeholder: "ex: John",
      icon: { name: "user", position: "right" },
    },

    { keyName: "street", label: "Улица", name: "street", type: "text" },

    { keyName: "city", label: "Град", name: "city", type: "text" },

    { keyName: "village", label: "Село", name: "village", type: "text" },

    { keyName: "qrCode", label: "QR Код", name: "qrCode", type: "text" },

    {
      keyName: "phoneNumber",
      label: "Телефонски Број",
      name: "phoneNumber",
      type: "tel",
    },
    {
      keyName: "status",
      label: "Статус",
      name: "status",
      type: "select",
      placeholder: "одбери статус",
      options: [
        {
          label: "Мерење",
          value: "messurment",
        },

        {
          label: "На чекање",
          value: "waiting",
        },
        {
          label: "Се чека за достава",
          value: "waitingDelivery",
        },
        {
          label: "Се доставуват",
          value: "deliverying",
        },
        {
          label: "Завршени",
          value: "done",
        },
        {
          label: "Откажени",
          value: "canceled",
        },
      ],
    },

    {
      keyName: "deliveryType",
      label: "Тип на Испорака",
      name: "status",
      type: "select",
      placeholder: "тип",
      options: [
        {
          label: "Подигнување",
          value: "pickup",
        },

        {
          label: "Достава",
          value: "delivery",
        },
      ],
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

const tags: ActiveTagItemTypes = {
  onClearAll: () => {},
  items: [
    {
      key: "Град",
      value: "Струмица",
      onRemove: () => {},
    },

    {
      key: "Клиент",
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
  },
};

export const allOrdersData: AllordersTypes = {
  table: tableData,
  pagination: tablePaginationData,
  filterOpenButton: filterOpenButton,
  filterData: filterData,
  sortData: sortOpenButton,
  tags: tags,
};
