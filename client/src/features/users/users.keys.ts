import type { UserQueryTypes } from "./users.types";

export const userKeys = {
  all: ["userlist"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserQueryTypes) => [...userKeys.lists(), params] as const,
  mutations: {
    create: () => ["userlist", "create"] as const,
    update: (productID: number | undefined) =>
      ["userlist", "update", productID] as const,
    deleteOne: () => ["userlist", "delete"] as const,
  },
};

export const normalizeUserListParams = (p: UserQueryTypes): UserQueryTypes => ({
  page: p.page ?? 1,
  limit: p.limit ?? 10,
  active: p.active ?? undefined,
  userType: p.userType ?? undefined,
});
