import type { CustomerNotesTypes } from "./customersNote.types";

export const CustomerNotesAdd: CustomerNotesTypes = {
  submitButton: {
    label: "Додади Забелешка",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "noteText",
      type: "text",
      label: "Забелешка",
      placeholder: "Напишете важни детали: договор, услови, проблем...",
      rules: {
        required: "Забелешката е задолжителна",
        minLength: { value: 3, message: "Забелешката е премногу кратка" },
        maxLength: { value: 2000, message: "Забелешката е премногу долга" },
      },
      autoFocus: true,

      className: "b-newCustomerNote-createInput",
    },
  ],

  notification: {
    success: {
      title: "Забелешката е успешно креирена",
      text: "Забелешката за клиентот е креирена во системот.",
    },
    error: {
      title: "Забелешката не беше успешно додадена",
      text: "Не можевме да ја додадиме забелешката во моментов. Ве молиме обидете се повторно.",
    },
  },
};
