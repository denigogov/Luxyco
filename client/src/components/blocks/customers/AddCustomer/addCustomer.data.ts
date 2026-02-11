import type { CreateCustomerFullForm } from "./addCustomer.types";
import type { FormGroup } from "../../../organisms/accordionForm/FormBuilderAccordion.types";
import type { HeadingTypes } from "../../../../whitelabel/src/molecules/heading/m-heading.types";
import type { InactiveCustomerNoticeTypes } from "../../../../whitelabel/src/molecules/InactiveCustomerNotice/InactiveCustomerNotice.types";

export const b_addCustomerData: FormGroup<CreateCustomerFullForm>[] = [
  {
    id: "customer",
    title: "Клиенти",
    description: "Основни информации",
    defaultOpen: true,
    summary: (v) =>
      `${v.firstName ?? ""} ${v.lastName ?? ""} - ${v.phoneNumber}`.trim(),
    fields: [
      {
        name: "firstName",
        type: "text",
        label: "Име",
        placeholder: "Максим",
        defaultValue: "",
        width: "2",
        rules: {
          required: "Името е задолжително.",
          minLength: {
            value: 3,
            message: "Името мора да има најмалку 3 букви.",
          },
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
        width: "2",
      },
      {
        name: "phoneNumber",
        type: "tel",
        label: "Телефонски број",
        placeholder: "+389 70 123 456",
        defaultValue: "077777777",
        rules: {
          required: "Телефонскиот број е задолжителен.",
          minLength: {
            value: 7,
            message: "Телефонскиот број мора да има најмалку 7 цифри.",
          },
        },
        width: "1",
      },
    ],
  },

  {
    id: "address",
    title: "Адреса",
    description: "Адресата на клиентот",
    summary: (v) =>
      `${v.street ?? ""}, ${v.postalCode ?? ""} ${v.city ?? ""} `.trim(),
    fields: [
      {
        name: "street",
        type: "text",
        label: "Адреса",
        placeholder: "Климент Охридски 82",
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
      {
        name: "isDefault",
        type: "text",
        label: "Активна Адреса",
        filedType: "checkbox",
        width: "1",
      },
    ],
  },

  {
    id: "note",
    title: "Забелешка",
    description: "Забелешка за Клиентот",
    summary: (v) => `${v.noteText?.trim()}`,
    fields: [
      {
        filedType: "textarea",
        name: "noteText",
        type: "text",
        label: "Забелешка",
        placeholder: "Напишете важни детали: договор, услови, проблем...",
        rules: {
          minLength: { value: 3, message: "Забелешката е премногу кратка" },
          maxLength: { value: 2000, message: "Забелешката е премногу долга" },
        },
        autoFocus: true,
        textareaProps: { rows: 4, maxLength: 300 },
      },
    ],
  },
];

export const test: HeadingTypes = {
  headline: {
    text: "Нов Клиент",
    position: "left",
    size: "h1",
  },

  subline: {
    text: " Креирај клиент + адреса + забелешка",
    style: "meta",
  },
};

export const createCustomerMessages = {
  componentTitle: {},

  notification: {
    success: {
      title: "Успешно  додаден нов клиент",
      text: "Податоците за клиентот се внесени во системот.",
    },
    error: {
      title: "Креирањето не беше успешно",
      text: "Се случи грешка. Ве молиме обидете се повторно.",
    },

    errorInactive: {
      title: "Постои деактивиран клиент",
      text: "Овој телефонски број е поврзан со деактивиран клиент.",
    },

    errorActive: {
      title: "Постои активен клиент",
      text: "Веќе постои активен клиент со овој телефонски број.",
    },
  },

  restoreNotification: {
    success: {
      title: "Клиентот е реактивиран",
      text: "Успешно го реактивиравте овој клиент.",
    },
    error: {
      title: "Активирањето не успеа",
      text: "Се случи грешка при активирање на клиентот. Обидете се повторно.",
    },
  },

  permanentlyDelete: {
    success: {
      title: "Клиентот е трајно избришан",
      text: "Сите податоци за овој клиент се трајно отстранети од системот.",
    },
    error: {
      title: "Бришењето не успеа",
      text: "Се случи грешка при трајно бришење на клиентот. Обидете се повторно.",
    },
  },
};

export const inactiveConflictDataActive: InactiveCustomerNoticeTypes = {
  title: "Постоечки клиент",
  data: {
    id: 722,
    first_name: "Dummy Data",
    last_name: "Гогов ",
    phone_number: "078252100",
    customer_addresses: [
      {
        formatted_address: "Mhj 12 Strumica",
      },
    ],
  },

  actionButtons: [
    {
      label: "Види Детали",
      style: "text",
      role: "details",
    },
    {
      label: "игноирај",
      style: "text",
      role: "cancel",
    },
  ],
};

export const inactiveConflictBase: InactiveCustomerNoticeTypes = {
  title: "Постоечки клиент",
  data: {
    id: 722,
    first_name: "Дејан",
    last_name: "Гогов ",
    phone_number: "078252100",
    customer_addresses: [
      {
        formatted_address: "Mhj 12 Strumica",
      },
    ],
  },
  modals: [
    {
      openButton: {
        label: "Активирај клиент",
        style: "text",
        role: "cancel",
        name: "active",
      },
      options: {
        initialOpen: false,
        returnBack: false,
      },
    },
    {
      openButton: {
        label: "Избриши трајно",
        style: "text",
      },
      options: {
        initialOpen: false,
        returnBack: false,
      },
    },
  ],
  actionButtons: [
    {
      label: "Игнорирај",
      style: "text",
      role: "cancel",
    },
  ],
  confirmActivate: {
    type: "warning",
    title: "Активирај Клиент",
    message: "Овој Клиент ке биде повторно активен. Дали сакате да продолжите?",
    buttons: [
      {
        label: "Откажи",
        style: "default",
      },
      {
        label: "Активирај",
        style: "tertiary",
        role: "cancel",
      },
    ],
  },
  confirmDelete: {
    type: "danger",
    title: "Трајно бришење",
    message:
      "Сите информации за овој клиент ќе бидат трајно избришани и нема да можат да се повратат. Оваа акција е неповратна.",
    buttons: [
      {
        label: "Откажи",
        style: "default",
      },
      {
        label: "Избриши трајно",
        style: "danger",
        role: "cancel",
      },
    ],
  },
};
