import type { DetailsOrderTypes } from "./detailsOrder.types";

export const detailsOrderData: DetailsOrderTypes = {
  table: {
    classes: "",
    tooltipSelectAll: "селектирај ги сите",
    noResultMessage: "Нема резултати за зададените филтри",
    enableMultiSelect: true,
    striped: false,
    responsive: false,
    hover: true,
    enableRowClick: true,
    columns: [
      {
        header: "Код/QR",
        key: "qrCode",
        enableSort: true,
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
  },
};
