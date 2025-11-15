import brand_logo from "../../assets/icons/luxycoLogo-Black.png";

export const BRAND_LUXYCO = {
  id: "luxyco",
  name: "Luxyco",
  slogan: "Manage · Analyze · Optimize",
  logo: brand_logo,

  routes: {
    includeGroups: ["/", "dashboard", "order", "settings"],
    includePaths: {
      "/": true,

      "/order": {
        "/order/all-orders": true,
        "/order/new-order": false,
      },
      "/settings": {
        "/settings": true,
        "/settings/price": true,
        "/settings/status": true,
      },

      "/customers": true,
      "/delivery": true,
      "/personal": true,
    },
  },
  //   features: {
  //     inventory: true,
  //     reports: false,
  //   },
};
