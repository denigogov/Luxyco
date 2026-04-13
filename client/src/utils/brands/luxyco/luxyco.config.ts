import brandLogoLight from "@/assets/logo/luxyCo-Light-logo.svg";
import brandLogoDark from "@/assets/logo/luxyCo-Dark-logo.svg";
import brandLogoDark_slogan from "@/assets/logo/luxyCo-Dark.svg";
import brandLogoLight_slogan from "@/assets/logo/luxyCo-Light.svg";
import { BRAND_LUXYCO_ROUTE_CONFIG } from "./routes.brand.base";
import { BRAND_LUXYCO_ROLE_ROUTE_CONFIG } from "./routes.roleAccess.base";

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
  printMode: "manual", // manual /remote

  routes: {
    ...BRAND_LUXYCO_ROUTE_CONFIG,
  },

  // route base user role
  auth: {
    // routes permission (pattern paths + permission tokens)
    routeAccess: BRAND_LUXYCO_ROLE_ROUTE_CONFIG,
  },
};
