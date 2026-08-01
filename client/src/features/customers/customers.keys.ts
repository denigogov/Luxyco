import type {
  CustomersListParams,
  NormalizedCustomersListParams,
} from "./customers.types";

export const normalizeCustomersListParams = (
  p: CustomersListParams,
): NormalizedCustomersListParams => ({
  page: p.page ?? 1,
  limit: p.limit ?? 20,

  search: (p.search ?? "").trim(),

  name: p.name?.trim() || undefined,
  phoneNumber: p.phoneNumber?.trim() || undefined,
  city: p.city?.trim() || undefined,
  street: p.street?.trim() || undefined,
  village: p.village?.trim() || undefined,

  sortBy: p.sortBy?.trim() || undefined,
  sortDir: p.sortDir || undefined,

  id: p.id?.trim() || undefined,
});

export const customersKeys = {
  all: ["customers"] as const,
  lists: () => [...customersKeys.all, "list"] as const,
  list: (params: NormalizedCustomersListParams) =>
    [...customersKeys.lists(), params] as const,
  orderLists: () => [...customersKeys.lists(), "order"] as const,
  listOrder: (params: NormalizedCustomersListParams) =>
    [...customersKeys.orderLists(), params] as const,
  details: () => [...customersKeys.all, "detail"] as const,
  detail: (id: number) => [...customersKeys.details(), id] as const,

  mutations: {
    all: () => [...customersKeys.all, "mutation"] as const,
    create: () => [...customersKeys.mutations.all(), "create"] as const,
    update: (customerId: number) =>
      [...customersKeys.mutations.all(), "update", customerId] as const,
    deleteOne: () => [...customersKeys.mutations.all(), "delete"] as const,
    deleteMany: () =>
      [...customersKeys.mutations.all(), "bulk-delete"] as const,
    restoreOne: () => [...customersKeys.mutations.all(), "restore"] as const,
    deletePermanently: () =>
      [...customersKeys.mutations.all(), "permanently-delete"] as const,
  },
};

export const customerAddressesKeys = {
  all: ["customer-addresses"] as const,
  lists: () => [...customerAddressesKeys.all, "list"] as const,
  listByCustomer: (customerId: number) =>
    [...customerAddressesKeys.lists(), { customerId }] as const,
  details: () => [...customerAddressesKeys.all, "detail"] as const,
  detail: (addressId: number) =>
    [...customerAddressesKeys.details(), addressId] as const,

  mutations: {
    all: () => [...customerAddressesKeys.all, "mutation"] as const,
    create: (customerId: number) =>
      [...customerAddressesKeys.mutations.all(), "create", customerId] as const,
    update: () => [...customerAddressesKeys.mutations.all(), "update"] as const,
    deleteOne: () =>
      [...customerAddressesKeys.mutations.all(), "delete"] as const,
  },
};

export const customerNotesKeys = {
  all: ["customer-notes"] as const,
  lists: () => [...customerNotesKeys.all, "list"] as const,
  listByCustomer: (customerId: number) =>
    [...customerNotesKeys.lists(), { customerId }] as const,
  details: () => [...customerNotesKeys.all, "detail"] as const,
  detail: (noteId: number) => [...customerNotesKeys.details(), noteId] as const,

  mutations: {
    all: () => [...customerNotesKeys.all, "mutation"] as const,
    create: (customerId: number) =>
      [...customerNotesKeys.mutations.all(), "create", customerId] as const,
    update: () => [...customerNotesKeys.mutations.all(), "update"] as const,
    deleteOne: () => [...customerNotesKeys.mutations.all(), "delete"] as const,
  },
};
