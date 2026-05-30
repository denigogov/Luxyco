import type { PriceConfigEditTypes } from "./priceConfigurationEdit.types";

export const priceConfigurationEditPageData: PriceConfigEditTypes = {
  submitButton: {
    label: "Ажурирај",
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
    {
      name: "isActive",
      type: "text",
      filedType: "checkbox",
      label: "Активен продукт",
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

export const productEditMessages = {
  invalidateLinkMessage: {
    title: "Невалиден линк",
    text: "ID-то на Продуктот не е валиден. Ве пренасочуваме кон листата на продукти.",
  },

  invalidateState: {
    title: "Не може да се отвори преку споделен линк",
    text: "За да се зачуваат точни податоци, отвори ја листата со продукти и кликни 'Уреди' повторно.",
  },
};
