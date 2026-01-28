import type { CustomerNotesTypes } from "./customersNote.types";

export const CustomerNotesUpdate: CustomerNotesTypes = {
  submitButton: {
    label: "Ажурирај",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "noteText",
      type: "text",
      label: "Забелешка",
      placeholder: "Напишете важни детали: договор, услови, проблем...",
      rules: {
        required: "Внесете забелешка",
        minLength: { value: 3, message: "Забелешката е премногу кратка" },
      },
    },
  ],
  notification: {
    success: {
      title: "Забелешката е успешно ажурирана",
      text: "Забелешката за клиентот е ажурирана во системот.",
    },
    error: {
      title: "Ажурирањето не беше успешно",
      text: "Не можевме да ја ажурираме забелешката во моментов. Ве молиме обидете се повторно.",
    },
  },
};
