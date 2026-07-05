import type { UpdateUserTypes } from "./UpdateUser.types";

export const updateUserData: UpdateUserTypes = {
  submitButton: {
    label: "Ажурирај",
    style: "tertiary",
  },

  filedsData: [
    {
      name: "firstName",
      type: "text",
      label: "Име",
      width: "2",
      rules: {
        required: "Името на корисникот е задолжително",
        minLength: {
          value: 2,
          message: "Името треба да биде минимум 2 карактери",
        },
      },
    },

    {
      name: "lastName",
      type: "text",
      label: "Презиме",
      width: "2",
      rules: {
        required: "Презимето на корисникот е задолжително",
        minLength: {
          value: 2,
          message: "Презимето треба да биде минимум 2 карактери",
        },
      },
    },

    {
      name: "phoneNumber",
      type: "text",
      label: "Телефон",
      width: "2",
      rules: {
        required: "Телефонскиот број на корисникот е задолжителен",
        pattern: {
          value: /^\+?(?=.*\d)[0-9\s-]{6,20}$/,
          message: "Телефонскиот број не е валиден",
        },
      },
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
      width: "2",
      rules: {
        required: "Видот на профил е задолжителен",
      },
    },

    {
      name: "username",
      type: "text",
      label: "Корисничко име",
      width: "1",
      rules: {
        required: "Корисничкото име е задолжително",
        minLength: {
          value: 3,
          message: "Корисничкото име треба да биде минимум 3 карактери",
        },
      },
    },

    {
      name: "password",
      type: "password",
      label: "Нова лозинка",
      width: "2",
      rules: {
        validate: (value) => {
          if (!value) return true;

          if (!/^(?=.*(?:\d|[^A-Za-z0-9\s])).{6,64}$/.test(String(value))) {
            return "Лозинката мора да содржи барем еден број или специјален карактер";
          }

          return true;
        },
      },
    },

    {
      name: "confirmPassword",
      type: "password",
      label: "Повтори нова лозинка",
      width: "2",
      rules: {
        validate: (value, formValues) => {
          if (!formValues.password) return true;

          if (!value) {
            return "Повторувањето на лозинката е задолжително";
          }

          return value === formValues.password || "Лозинките не се совпаѓаат";
        },
      },
    },
  ],
};

export const userEditMessages = {
  invalidLinkMessage: {
    title: "Невалиден линк",
    text: "ID-то на овој корисник не е валидно. Ве пренасочуваме кон листата на корисници.",
  },

  invalidState: {
    title: "Не може да се отвори преку споделен линк",
    text: "За да се зачуваат точни податоци, отворете ја листата со корисници и кликнете 'Уреди' повторно.",
  },

  success: {
    title: "Корисникот е успешно ажуриран",
    text: "Промените на корисничкиот профил се успешно зачувани.",
  },

  error: {
    title: "Корисникот не беше ажуриран",
    text: "Не можевме да ги зачуваме промените во моментов. Ве молиме обидете се повторно.",
  },
};
