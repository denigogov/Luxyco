export const statusKeys = {
  all: ["status"] as const,
  list: () => [...statusKeys.all, "list"] as const,
};
