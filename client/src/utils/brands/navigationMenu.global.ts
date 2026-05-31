import type { NavItemsTypes } from "../../whitelabel/src/molecules/navItems/m-navItems.types";

export const navigationMenuData: NavItemsTypes[] = [
  {
    categoryName: "Работни Панели",
    menu: [
      {
        title: "Преглед",
        icon: "grid",
        path: "/",
      },
      {
        title: "Налози",
        icon: "file-text",
        activeParrentPath: false,
        path: "/orders",
        subChildren: [
          {
            label: "Сите Налози",
            icon: "file-edit",

            path: "/orders",
          },
          {
            label: "Креирај Налог",
            icon: "file",

            path: "/orders/new",
          },
        ],
      },
      {
        title: "Клиенти",
        icon: "users",

        path: "/customers",
      },
      {
        title: "Достава",
        icon: "calendar",

        path: "/delivery",
      },
    ],
  },

  {
    categoryName: "Персонал",
    menu: [
      {
        title: "Работници",
        icon: "lifesaver",

        path: "/personal",
      },
    ],
  },

  {
    categoryName: "Финансии",
    menu: [
      {
        title: "Анализи",
        icon: "settings",

        path: "/personal",
      },
      {
        title: "Фактури",
        icon: "bolt",

        path: "/personal",
      },
      {
        title: "Извештаи",
        icon: "file-text",

        path: "/personal",
      },
    ],
  },
  {
    categoryName: "Систем и Поставки",
    menu: [
      {
        title: "Основни Поставки",
        icon: "cog",
        path: "/settings",
      },
      {
        title: "Ценовник",
        icon: "tag",
        path: "/settings/price",
      },
      {
        title: "Достава",
        icon: "location",
        path: "/settings/delivery",
      },
      // {
      //   title: "Статуси",
      //   icon: "bookmark",
      //   path: "/settings/status",
      // },
      {
        title: "Безбедност",
        icon: "lock",
        path: "/personal",
      },
      {
        title: "Корисници",
        icon: "users",

        path: "/personal",
      },
      {
        title: "Помош и Поддршка",
        icon: "flag",

        path: "/personal",
      },
    ],
  },
];
