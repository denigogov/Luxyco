export const BRAND_BRANDB = {
  id: "brandB",
  name: "brandB",
  logo: "/brandB/logo.svg",
  slogan: "Test · Analyze · Test",
  routes: {
    includeGroups: ["settings", "dashboard", "order"],
    includePaths: {
      "/": true,

      "/order": {
        "/order/all-orders": true,
        "/order/new-order": true,
      },
      "/settings": {
        "/settings": true,
        "/settings/price": true,
        "/settings/status": false,
      },

      "/customers": false,
      "/delivery": false,
      "/personal": false,
    },
  },
  features: {
    inventory: false,
    reports: true,
  },
};
