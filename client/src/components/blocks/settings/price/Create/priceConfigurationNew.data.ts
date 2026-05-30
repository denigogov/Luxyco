import type { PriceConfigNewTypes } from "./priceConfigurationNew.types";

export const priceConfigurationNewPageData: PriceConfigNewTypes = {
  submitButton: {
    label: "Додади",
    style: "tertiary",
  },
  filedsData: [
    {
      name: "name",
      type: "text",
      label: "Назив на продукот",
      placeholder: "Тепих...",
      width: "1",
      rules: {
        required: "Назив на продукот е задолжителен",
      },
    },

    {
      name: "basePrice",
      type: "number",
      label: "Цена",
      rules: {
        required: "Цената е задолжителна",
      },
      width: "2",
    },
    {
      name: "priceModelId",
      type: "text",
      filedType: "select",
      label: "Вид на цена",
      selectPlaceholder: "Избери статус",
      selectValueType: "number",
      options: [
        {
          value: "1",
          label: "По М2",
        },
        {
          value: "2",
          label: "По парче",
        },
      ],
      rules: {
        required: "Вид цена е задолжителен",
      },
      width: "2",
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
