import brand_logo from "../../assets/icons/luxycoLogo-Black.png";

const ORDER_ROUTE = ["/order/all-orders", "/order/new-order"];

export const BRAND_LUXYCO = {
  id: "luxyco",
  name: "Luxyco",
  slogan: "Manage · Analyze · Optimize",
  logo: brand_logo,

  routes: {
    includeGroups: ["/", "dashboard", "order"],
    includePaths: [
      "/",
      ...ORDER_ROUTE,
      "/customers",
      "/delivery",
      "/personal",
      "/settings",
      "/settings/price",
      "settings/status",
    ],
  },
  //   features: {
  //     inventory: true,
  //     reports: false,
  //   },
};
