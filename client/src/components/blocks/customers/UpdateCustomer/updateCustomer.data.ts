import type { UpdateCustomerTypes } from "./updateCustomer.types";

export const CustomerUpdate: UpdateCustomerTypes = {
  submitButton: {
    label: "Ажурирај",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "firstName",
      type: "text",
      label: "Име",
      placeholder: "Максим",
      rules: {
        required: "Името е задолжително.",
        minLength: { value: 3, message: "Името мора да има најмалку 3 букви." },
      },
    },
    {
      name: "lastName",
      type: "text",
      label: "Презиме",
      placeholder: "Димитриевски",
      rules: {
        required: "Презимето е задолжително.",
        minLength: {
          value: 3,
          message: "Презимето мора да има најмалку 3 букви.",
        },
      },
    },
    {
      name: "phoneNumber",
      type: "tel",
      label: "Телефонски број",
      placeholder: "+389 70 123 456",
      rules: {
        required: "Телефонскиот број е задолжителен.",
        minLength: {
          value: 7,
          message: "Телефонскиот број мора да има најмалку 7 цифри.",
        },
      },
    },
  ],

  notification: {
    success: {
      title: "Ажурирањето е успешно",
      text: "Податоците за корисникот се ажурирани во системот.",
    },
    error: {
      title: "Ажурирањето не беше успешно",
      text: "Не можевме да ја ажурираме корисникот во моментов. Ве молиме обидете се повторно.",
    },
  },
};
