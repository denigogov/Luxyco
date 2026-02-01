import type { EditCustomerAddressesTypes } from "./editAddresses.types";

export const CustomerAddressesUpdate: EditCustomerAddressesTypes = {
  submitButton: {
    label: "Ажурирај",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "street",
      type: "text",
      label: "Адреса",
      placeholder: "Климент Охридски 82",
      rules: {
        required: "Адресата е задолжителна",
        minLength: { value: 3, message: "Адресата е премногу кратка" },
        maxLength: { value: 100, message: "Адресата е премногу долга" },
      },
      width: "1",
    },
    {
      name: "city",
      type: "text",
      label: "Град",
      placeholder: "Струмица",
      defaultValue: "Струмица",
      rules: {
        required: "Град е задолжително",
        minLength: { value: 3, message: "Името на Градот е премногу краткот" },
        maxLength: { value: 50, message: "Името на Градот е премногу долг" },
      },
      width: "2",
    },
    {
      name: "village",
      type: "text",
      label: "Село (опционално)",
      placeholder: "—",
      rules: {
        maxLength: {
          value: 25,
          message: "полето не смее да содржи повеќе од 25 букви",
        },
      },
      width: "2",
    },
    {
      name: "postalCode",
      type: "text",
      label: "Поштенски Број",
      placeholder: "2400",
      defaultValue: "2400",
      rules: {
        required: "Поштенскиот број е задолжителен",
        minLength: { value: 2, message: "Поштенски Број е премногу краткот" },
        maxLength: { value: 20, message: "Поштенски Број е премногу долг" },
      },

      width: "2",
    },
    {
      name: "country",
      type: "text",
      label: "Држава",
      placeholder: "Македонија",
      defaultValue: "Македонија",
      rules: {
        required: "Државата е задолжителна",
        minLength: { value: 2, message: "Полето е премногу кратко" },
        maxLength: { value: 20, message: "Полето е премногу долг" },
      },
      width: "2",
    },
    {
      name: "isDefault",
      type: "text",
      label: "Активна Адреса",
      filedType: "checkbox",
    },
  ],
  notification: {
    success: {
      title: "Ажурирањето е успешно",
      text: "Податоците за адресата се ажурирани во системот.",
    },
    error: {
      title: "Ажурирањето не беше успешно",
      text: "Не можевме да ја ажурираме адресата во моментов. Ве молиме обидете се повторно.",
    },
  },
};
