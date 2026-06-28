import type { CreateUserTypes } from "./createUsers.types";

export const createUserData: CreateUserTypes = {
  submitButton: {
    label: "Додади",
    style: "tertiary",
  },
  filedsData: [
    {
      name: "firstName",
      type: "text",
      label: "Име",
      width: "2",
      rules: {
        required: "Име На корисникот е задолжителено",
        minLength: {
          message: "Името треба да биде минимум 2 карактери",
          value: 2,
        },
      },
    },

    {
      name: "lastName",
      type: "text",
      label: "Презиме",
      rules: {
        required: "Презиме на корисникот е задолжителено",
        minLength: {
          message: "Презимето треба да биде минимум 2 карактери",
          value: 2,
        },
      },
      width: "2",
    },

    {
      name: "phoneNumber",
      type: "text",
      label: "Телефон",
      rules: {
        required: "Телефонски број На корисникот е задолжителено",
        pattern: {
          value: /^\+?(?=.*\d)[0-9\s-]{6,20}$/,
          message: "Телефонскиот број не е валиден",
        },
      },
      width: "2",
    },

    {
      name: "accountTypes.id",
      type: "text",
      filedType: "select",
      label: "Вид на профил",
      selectPlaceholder: "Тип корисник",
      selectValueType: "number",
      options: [
        {
          label: "Супер Администратор",
          value: 1,
        },

        {
          label: "Администратор",
          value: 2,
        },

        { value: 3, label: "Менаџер" },

        {
          value: 4,
          label: "Рецепција",
        },

        { value: 5, label: "Оператор" },

        {
          value: 6,
          label: "Возач",
        },
      ],
      rules: {
        required: "Вид Профил е задолжителен",
      },
      width: "2",
    },

    {
      name: "username",
      type: "text",
      label: "Корисничо име",
      rules: {
        required: "корисничо име е задолжителено",
        minLength: {
          message: "корисничото име треба да биде минимум 3 карактери",
          value: 3,
        },
      },
      width: "1",
    },

    {
      name: "password",
      type: "password",
      label: "Лозинка",
      rules: {
        required: "Лозинката е задолжителна",
        minLength: {
          value: 6,
          message: "Лозинката мора да има најмалку 6 карактери",
        },
        pattern: {
          value: /^(?=.*(?:\d|[^A-Za-z0-9\s])).{6,64}$/,
          message:
            "Лозинката мора да содржи барем еден број или специјален карактер",
        },
      },
      width: "1",
    },

    {
      name: "confirmPassword",
      label: "Повтори лозинка",
      type: "password",
      rules: {
        required: "Повторувањето на лозинката е задолжително",
        validate: (value, formValues) => {
          return value === formValues.password || "Лозинките не се совпаѓаат";
        },
      },
    },
  ],
  notification: {
    success: {
      title: "Корисникот е успешно додаден",
      text: "Новиот кориснички профил е креиран и подготвен за користење.",
    },
    error: {
      title: "Корисникот не беше додаден",
      text: "Не можевме да го креираме корисникот во моментов. Ве молиме обидете се повторно.",
    },
  },
};
