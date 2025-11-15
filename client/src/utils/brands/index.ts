import { flattenIncludePaths } from "../routes/routeFlattenPath";
import { BRAND_BUBO } from "./bubo.config";
import { BRAND_LUXYCO } from "./luxyco.config";
import { BRAND_BRANDB } from "./testbrand.config";

export const brands = {
  bubo: BRAND_BUBO,
  brandb: BRAND_BRANDB,
  luxyco: BRAND_LUXYCO,
} as const;

export type BrandKey = keyof typeof brands;

export const currentBrand =
  (import.meta.env.VITE_BRAND as BrandKey) || "luxyco";
export const brandConfig = brands[currentBrand];
export const allowedPaths = flattenIncludePaths(brandConfig.routes);
