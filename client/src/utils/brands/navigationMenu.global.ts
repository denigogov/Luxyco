// import type { NavItemsTypes } from "../../whitelabel/src/molecules/navItems/m-navItems.types";

import { brandConfig } from ".";
import type { NavbarTypes } from "../../whitelabel/src/organisms/navbar/o-navbar.types";
import { filterNavbarByBrand } from "../helpers/filterNavbarByBrand";

export let MAIN_NAVIGATION_MENU: NavbarTypes = {
  brandHeader: {
    brandLogo: brandConfig.logo.default,
    brandLogoMobile: brandConfig.logo.logo_mobile,
    brandName: {
      name: brandConfig?.name ?? "",
      slogan: brandConfig?.slogan ?? "",
    },
  },
  collapsLabels: {
    expandLabel: "Стандардна навигација",
    collapsLabel: "Минимална навигација",
    expandTooltipLabel: "Прошири ја навигацијата за целосен приказ",
    collapseTooltipLabel:
      "Минимизирај ја навигацијата – ќе се гледаат само иконите",
  },

  navButton: {
    label: "Navigation",
    size: "large",
    icon: {
      name: "menu",
      position: "left",
    },
    style: "secondary",
    onlyIcon: false,
    toggleTarget: "#navigationMobile",
  },

  navItems: [
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
        {
          title: "Статуси",
          icon: "bookmark",
          path: "/settings/status",
        },
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
  ],

  logoutButton: {
    label: "Одјави се",
    style: "link",
    size: "medium",
    icon: {
      name: "sign-out",
      position: "left",
    },
    className: "uk-margin",
  },
};
MAIN_NAVIGATION_MENU = filterNavbarByBrand(MAIN_NAVIGATION_MENU);
