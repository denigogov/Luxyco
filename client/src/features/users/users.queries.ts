import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { normalizeUserListParams, userKeys } from "./users.keys";
import type { UserQueryTypes } from "./users.types";
import { getUserList } from "../../api/users/users.api";

export function useUserList(params?: UserQueryTypes) {
  const normalized = normalizeUserListParams(params ?? {});

  return useQuery({
    queryKey: userKeys.list(normalized),
    queryFn: ({ signal }) => getUserList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}
