import brandLogoLight from "@/assets/logo/luxyCo-Light-logo.svg";
import brandLogoDark from "@/assets/logo/luxyCo-Dark-logo.svg";
import brandLogoDark_slogan from "@/assets/logo/luxyCo-Dark.svg";
import brandLogoLight_slogan from "@/assets/logo/luxyCo-Light.svg";
import { BRAND_BUBO_ROUTE_CONFIG } from "./bubo-routes.brand.base";
import { BRAND_BUBO_ROLE_ROUTE_CONFIG } from "./bubo-routes.roleAccess.base";

export const BRAND_BUBO = {
  id: "bubo",
  name: "Бубо",
  slogan: "Тепих · Сервис · Бубо",
  logo: {
    default: brandLogoDark,
    logo_mobile: brandLogoLight,
    logoFull_dark: brandLogoDark_slogan,
    logoFull_light: brandLogoLight_slogan,
  },
  printMode: "manual", // manual /automatic

  routes: {
    ...BRAND_BUBO_ROUTE_CONFIG,
  },

  auth: {
    routeAccess: BRAND_BUBO_ROLE_ROUTE_CONFIG,
  },
};
