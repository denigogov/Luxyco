import type { PriceQueryTypes } from "./price.types";

export const normalizePriceListParams = (
  p: PriceQueryTypes,
): PriceQueryTypes => ({
  page: p.page ?? 1,
  limit: p.limit ?? 10,
});

// keys

export const priceKeys = {
  all: ["pricelist"] as const,
  lists: () => [...priceKeys.all, "list"] as const,
  list: (params: PriceQueryTypes) => [...priceKeys.lists(), params] as const,
  mutations: {
    create: () => ["pricelist", "create"] as const,
    update: (productID: number | undefined) =>
      ["pricelist", "update", productID] as const,
    deleteOne: () => ["pricelist", "delete"] as const,
  },
};
