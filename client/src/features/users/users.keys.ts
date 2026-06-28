import type { UserQueryTypes } from "./users.types";

export const userKeys = {
  all: ["userlist"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserQueryTypes) =>
    [...userKeys.lists(), normalizeUserListParams(params)] as const,
  mutations: {
    create: () => [...userKeys.all, "create"] as const,
    update: (userId: number | undefined) =>
      [...userKeys.all, "update", userId] as const,
    deleteOne: () => [...userKeys.all, "delete"] as const,
  },
};
export const normalizeUserListParams = (p: UserQueryTypes): UserQueryTypes => ({
  page: p.page ?? 1,
  limit: p.limit ?? 10,
  active: p.active ?? undefined,
  userType: p.userType ?? undefined,
});
