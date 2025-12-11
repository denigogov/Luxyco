import type {
  CustomersListParams,
  NormalizedCustomersListParams,
} from "./customers.types";

export const normalizeCustomersListParams = (
  p: CustomersListParams
): NormalizedCustomersListParams => ({
  page: p.page ?? 1,
  limit: p.limit ?? 20,

  search: (p.search ?? "").trim(),

  name: p.name?.trim() || undefined,
  phoneNumber: p.phoneNumber?.trim() || undefined,
  city: p.city?.trim() || undefined,
  street: p.street?.trim() || undefined,

  // keep optional so initial URL stays short
  sortBy: p.sortBy?.trim() || undefined,
  sortDir: p.sortDir || undefined,
});

export const customersKeys = {
  all: ["customers"] as const,
  lists: () => [...customersKeys.all, "list"] as const,
  list: (params: NormalizedCustomersListParams) =>
    [...customersKeys.lists(), params] as const,
  details: () => [...customersKeys.all, "detail"] as const,
  detail: (id: number) => [...customersKeys.details(), id] as const,
};
