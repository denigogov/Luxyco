import brand_logo from "../../assets/icons/luxycoLogo-Black.png";

export const BRAND_BUBO = {
  id: "bubo",
  name: "Bubo Company",
  slogan: "Manage · Analyze · Optimize",
  logo: brand_logo,
  routes: {
    includeGroups: ["/", "dashboard", "order"],
    includePaths: {
      "/": true,

      "/order": {
        "/order/all-orders": true,
        "/order/new-order": true,
      },
      "/settings": {
        "/settings": false,
        "/settings/price": false,
        "/settings/status": false,
      },

      "/customers": false,
      "/delivery": false,
      "/personal": false,
    },
  },
  features: {
    inventory: true,
    reports: false,
  },
};
