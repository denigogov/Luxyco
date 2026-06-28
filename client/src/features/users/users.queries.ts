import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { normalizeUserListParams, userKeys } from "./users.keys";
import type {
  CreateUserQuery,
  UpdateUserForm,
  UserQueryTypes,
} from "./users.types";
import {
  createUser,
  deleteUser,
  getUserList,
  updateUser,
} from "../../api/users/users.api";

export function useUserList(params?: UserQueryTypes) {
  const normalized = normalizeUserListParams(params ?? {});

  return useQuery({
    queryKey: userKeys.list(normalized),
    queryFn: ({ signal }) => getUserList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: userKeys.mutations.create(),
    mutationFn: (dto: CreateUserQuery) => createUser(dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: userKeys.lists(),
        }),
      ]);
    },
  });
}

export function useUserUpdate(id: number | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: userKeys.mutations.update(id),
    mutationFn: (dto: Partial<UpdateUserForm>) => updateUser(id, dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: userKeys.lists(),
        }),
      ]);
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: userKeys.mutations.deleteOne(),
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: userKeys.lists(),
        }),
      ]);
    },
  });
}
