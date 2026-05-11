import type { EditOrderTypes } from "./editOrders.types";

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

export const OrderUpdate: EditOrderTypes = {
  submitButton: {
    label: "Ажурирај",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "customerAddress",
      type: "text",
      label: "Адреса на клиент",
      placeholder: "Нема адреса",
      readOnly: true,
      disabled: true,
      width: "1",
    },
    {
      name: "scheduledDate",
      type: "date",
      label: "Закажан датум",
      rules: {
        required: "Датумот е задолжителен",
      },
      width: "2",
    },
    {
      name: "deliveryType",
      type: "text",
      filedType: "select",
      label: "Тип на достава",
      selectPlaceholder: "Избери тип на достава",
      selectValueType: "number",
      options: [],
      width: "2",
    },
    {
      name: "status",
      type: "text",
      filedType: "select",
      label: "Статус",
      selectPlaceholder: "Избери статус",
      selectValueType: "number",
      options: ORDER_STATUS_OPTIONS,
      rules: {
        required: "Статусот е задолжителен",
      },
      width: "1",
    },
    {
      name: "orderNote",
      type: "text",
      filedType: "textarea",
      label: "Забелешка",
      placeholder: "Внеси забелешка за нарачката",
      width: "1",
    },
  ],

  notification: {
    success: {
      title: "Ажурирањето е успешно",
      text: "Нарачката е успешно ажурирана.",
    },
    error: {
      title: "Ажурирањето не беше успешно",
      text: "Не можевме да ја ажурираме нарачката во моментов. Ве молиме обидете се повторно.",
    },
  },
};
