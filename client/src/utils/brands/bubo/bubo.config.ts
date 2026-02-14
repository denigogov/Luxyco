import brandLogoLight from "@/assets/logo/luxyCo-Light-logo.svg";
import brandLogoDark from "@/assets/logo/luxyCo-Dark-logo.svg";
import brandLogoDark_slogan from "@/assets/logo/luxyCo-Dark.svg";
import brandLogoLight_slogan from "@/assets/logo/luxyCo-Light.svg";

type BrandUserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "RECEPTION"
  | "MACHINE_OPERATOR"
  | "DRIVER";

type BrandRouteAccess = Partial<Record<BrandUserRole, string[]>>;

export const BRAND_BUBO = {
  id: "bubo",
  name: "Bubo",
  slogan: "Tepih · servis · Bubo",
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
  auth: {
    routeAccess: {
      SUPER_ADMIN: [
        "/",
        "/dashboard",
        "/customers",
        "/customers/new",
        "/customers/:customerId",
        "/customers/:customerId/addresses/new",
        "/customers/:customerId/addresses/:addressId/edit",
      ],
      MANAGER: [
        "/",
        "/dashboard",
        "/orders",
        "/orders/new",
        "/orders/:id",
        "/orders/:id/edit",
        "/customers",
        "/customers/new",
        "/customers/:customerId",
        "/customers/:customerId/addresses/new",
        "/customers/:customerId/addresses/:addressId/edit",
        "/customers/:customerId/notes/add",
        "/customers/:customerId/notes/:noteId/edit",
        "/settings",
        "/settings/price",
      ],
      DRIVER: [
        "/",
        "/dashboard",
        "/orders",
        "/orders/:id",
        "/customers",
        "/customers/:customerId",
      ],
    } satisfies BrandRouteAccess,
  },
};
