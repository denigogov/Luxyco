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
      selectPlaceholder: "Избери тип наплата",
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
      title: "Продуктот е додаден",
      text: "Продуктот е успешно додаден во системот.",
    },
    error: {
      title: "Неуспешен обид да се додаде нов продукт",
      text: "Не можевме да го додадиме продуктот во моментов. Ве молиме обидете се повторно.",
    },
  },
};
