export const BRAND_BRANDB = {
  id: "brandB",
  name: "brandB",
  logo: "/brandB/logo.svg",
  slogan: "Test · Analyze · Test",
  routes: {
    includeGroups: ["settings", "dashboard", "order"],
    includePaths: [
      "/",
      "/order/new-order",
      "/customers",
      "/delivery",
      "/settings",
      "/settings/price",
      "/settings/status",
    ],
  },
  features: {
    inventory: false,
    reports: true,
  },
};
