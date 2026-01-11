import type { customerAddAddressesTypes } from "./customerAddressAdd.types";

export const customerAddressAdd: customerAddAddressesTypes = {
  submitButton: {
    label: "Креирам",
    style: "tertiary",
  },
  cancelButton: {
    label: "Откажи",
    style: "tertiary",
    href: "../",
  },

  breadcrumbs: {
    returnLink: {
      label: "Додади нова Адреса",
      style: "link",
      icon: { name: "chevron-left" },
      href: "../",
    },
  },

  filedsData: [
    {
      name: "street",
      type: "text",
      label: "Адреса",
      placeholder: "Климент Охридски 82",
      rules: {
        required: "Адресата е задолжителна",
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
      rules: { required: "Поштенскиот број е задолжителен" },
      width: "2",
    },
    {
      name: "country",
      type: "text",
      label: "Држава",
      placeholder: "Македонија",
      defaultValue: "Македонија",
      rules: { required: "Државата е задолжителна" },
      width: "2",
    },
    // {
    //   name: "formattedAddress",
    //   type: "text",
    //   label: "Форматирена Адреса",
    //   placeholder: "Климент Охридски 82, 2400 Струмица - Македонија",
    //   rules: { required: "Форматирена Адреса е задолжителна" },
    //   width: "2",
    // },
    // {
    //   name: "latitude",
    //   type: "string",
    //   label: "Latitude",
    //   placeholder: "41.9981",
    //   rules: { required: "Latitude е задолжиелно" },
    //   width: "2",
    //   defaultValue: "11.1111",
    // },
    // {
    //   name: "longitude",
    //   type: "string",
    //   label: "Longitude",
    //   placeholder: "21.4254",
    //   rules: { required: "Longitude  е задолжиелно" },
    //   width: "2",
    //   defaultValue: "11.1111",
    // },
  ],
};
