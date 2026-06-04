import type { DeliveryQueryTypes } from "../../components/blocks/settings/delivery/all/deliveryPriceConfig.types";

export const deliveryTypeKeys = {
  all: ["deliveryType"] as const,
  lists: () => [...deliveryTypeKeys.all, "list"] as const,
  list: (params: DeliveryQueryTypes) =>
    [...deliveryTypeKeys.lists(), params] as const,
  mutations: {
    create: () => ["deliveryTypelist", "create"] as const,
    update: (deliveryTypeID: number | undefined) =>
      ["deliveryTypelist", "update", deliveryTypeID] as const,
    deleteOne: () => ["deliveryTypelist", "delete"] as const,
  },
};

export const normalizeDeliveryListTypesParams = (
  p: DeliveryQueryTypes,
): DeliveryQueryTypes => ({
  page: p.page ?? 1,
  limit: p.limit ?? 10,
  active: p.active ?? undefined,
});
