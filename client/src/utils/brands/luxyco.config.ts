import brandLogoLight from "../../assets/logo/luxyCo-Light-logo.svg";
import brandLogoDark from "../../assets/logo/luxyCo-Dark-logo.svg";
import brandLogoDark_slogan from "../../assets/logo/luxyCo-Dark.svg";
import brandLogoLight_slogan from "../../assets/logo/luxyCo-Light.svg";

export const BRAND_LUXYCO = {
  id: "luxyco",
  name: "Luxyco",
  slogan: "Manage · Analyze · Optimize",
  logo: {
    default: brandLogoDark,
    logo_mobile: brandLogoLight,
    logoFull_dark: brandLogoDark_slogan,
    logoFull_light: brandLogoLight_slogan,
  },

  routes: {
    includeGroups: ["/", "dashboard", "orders", "settings", "customers"],
    includePaths: {
      "/": true,

      "/orders": {
        "/orders": true,
        "/orders/new": true,
        "/orders/:id": true,
        "/orders/:id/edit": true,
      },
      "/settings": {
        "/settings": true,
        "/settings/price": true,
        "/settings/status": true,
      },

      "/customers": {
        "/customers": true,
        "/customers/new": true,
        "/customers/:customerId": true,

        // addresses
        "/customers/:customerId/addresses/:addressId/edit": true,
        "/customers/:customerId/addresses/new": true,

        // notes
        "/customers/:customerId/notes/:noteId/edit": true,
        "/customers/:customerId/notes/add": true,
      },
      "/delivery": true,
      "/personal": true,
    },
  },
  //   features: {
  //     inventory: true,
  //     reports: false,
  //   },
};
