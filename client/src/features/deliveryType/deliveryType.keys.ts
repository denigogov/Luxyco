export const deliveryTypeKeys = {
  all: ["deliveryType"] as const,
  list: () => [...deliveryTypeKeys.all, "list"] as const,
};
