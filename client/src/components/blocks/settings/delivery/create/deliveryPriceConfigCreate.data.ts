import type { DeliveryTypeNewTypes } from "./deliveryPriceConfigCreate.types";

export const deliveryTypeNewPageData: DeliveryTypeNewTypes = {
  submitButton: {
    label: "Додади",
    style: "tertiary",
  },
  filedsData: [
    {
      name: "typeName",
      type: "text",
      label: "Назив на тип достава",
      placeholder: "Тепих...",
      width: "2",
      rules: {
        required: "Назив на тип достава е задолжителен",
        minLength: {
          value: 2,
          message: "Името мора да има најмалку 2 букви.",
        },
        maxLength: {
          value: 50,
          message: "Името мора да има најмногу 50 букви.",
        },
      },
    },
    {
      name: "price",
      type: "number",
      label: "Цена",
      rules: {
        required: "Цената е задолжителна",
        minLength: {
          value: 1,
          message: "Цена мора да има најмалку 1",
        },
      },

      width: "2",
    },
  ],
  notification: {
    success: {
      title: "Успешно додаден тип достава",
      text: "Додадениот тип на достава е внесен во системот",
    },
    error: {
      title: "Не можеме да го додадиме моментално нов тип на достава",
      text: "во моментот се случи некој проблем. Ве молиме обидете се повторно.",
    },
  },
};
