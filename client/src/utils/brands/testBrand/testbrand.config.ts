import brandLogoLight from "@/assets/logo/luxyCo-Light-logo.svg";
import brandLogoDark from "@/assets/logo/luxyCo-Dark-logo.svg";
import brandLogoDark_slogan from "@/assets/logo/luxyCo-Dark.svg";
import brandLogoLight_slogan from "@/assets/logo/luxyCo-Light.svg";

export const BRAND_BRANDB = {
  id: "brandB",
  name: "brandB",
  slogan: "Test · Analyze · Test",
  logo: {
    default: brandLogoDark,
    logo_mobile: brandLogoLight,
    logoFull_dark: brandLogoDark_slogan,
    logoFull_light: brandLogoLight_slogan,
  },
  printMode: "remote", // manual /remote
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
