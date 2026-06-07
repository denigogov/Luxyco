import type { DeliveryTypeConfigEditTypes } from "./deliveryPriceConfigEdit.types";

export const deliveryPriceConfigEditData: DeliveryTypeConfigEditTypes = {
  submitButton: {
    label: "Ажурирај",
    style: "tertiary",
  },
  filedsData: [
    {
      name: "typeName",
      type: "text",
      label: "Назив на тип достава",
      placeholder: "градска...",
      width: "2",
    },

    {
      name: "price",
      type: "number",
      label: "Цена",
      width: "2",
    },
    {
      name: "isActive",
      type: "text",
      filedType: "checkbox",
      label: "Активен продукт",
      width: "1",
    },
  ],
  notification: {
    success: {
      title: "Ажурирањето е успешно",
      text: "Тип на достава е успешно ажурирана.",
    },
    error: {
      title: "Ажурирањето не беше успешно",
      text: "Не можевме да го ажурираме типот на достава во моментов. Ве молиме обидете се повторно.",
    },
  },
};

export const deliveryTypeEditMessages = {
  invalidateLinkMessage: {
    title: "Невалиден линк",
    text: "ID-то на овојт тип на достава не е валиден. Ве пренасочуваме кон листата на тип достава.",
  },

  invalidateState: {
    title: "Не може да се отвори преку споделен линк",
    text: "За да се зачуваат точни податоци, отвори ја листата со продукти и кликни 'Уреди' повторно.",
  },

  successUpdate: {
    title: "Тип на достава е успешно ажуриран",
    text: "Посакуваниот тип достава е внесен во системот.",
  },
  errorUpdate: {
    title: "Тип на достава не беше успешно додаден",
    text: "Не можевме да гп додадиме посакуваниот тип достава во моментов. Ве молиме обидете се повторно.",
  },
};
