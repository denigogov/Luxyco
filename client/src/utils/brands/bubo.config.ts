import brandLogoLight from "../../assets/logo/luxyCo-Light-logo.svg";
import brandLogoDark from "../../assets/logo/luxyCo-Dark-logo.svg";
import brandLogoDark_slogan from "../../assets/logo/luxyCo-Dark.svg";
import brandLogoLight_slogan from "../../assets/logo/luxyCo-Light.svg";

export const BRAND_BUBO = {
  id: "bubo",
  name: "Bubo Company",
  slogan: "Manage · Analyze · Optimize",
  logo: {
    default: brandLogoDark,
    logo_mobile: brandLogoLight,
    logoFull_dark: brandLogoDark_slogan,
    logoFull_light: brandLogoLight_slogan,
  },
  routes: {
    includeGroups: ["/", "dashboard", "order", "customers"],
    includePaths: {
      "/": true,

      "/order": {
        "/orders/all": true,
        "/orders/new": true,
      },
      "/settings": {
        "/settings": false,
        "/settings/price": false,
        "/settings/status": false,
      },

      "/customers": {
        "/customers": true,
        "/customers/:customerId": false,

        // addresses
        "/customers/:customerId/addresses/:addressId/edit": false,
        "/customers/:customerId/addresses/new": false,

        // notes
        "/customers/:customerId/notes/:noteId/edit": false,
        "/customers/:customerId/notes/:noteId/add": false,
      },
      "/delivery": false,
      "/personal": false,
    },
  },
  features: {
    inventory: true,
    reports: false,
  },
};
