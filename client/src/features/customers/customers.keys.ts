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
  listOrder: (params: NormalizedCustomersListParams) =>
    [...customersKeys.lists(), params] as const,
  details: () => [...customersKeys.all, "detail"] as const,
  detail: (id: number) => [...customersKeys.details(), id] as const,

  mutations: {
    create: () => ["customers", "create"] as const,
    createAddress: (customerId: number) =>
      ["customers", customerId, "addresses", "create"] as const,
  },
  deleteOne: () => ["customers", "delete"] as const,
  deleteMany: () => ["customers", "bulk-delete"] as const,

  restoreOne: () => ["customers", "restore"] as const,
  deletePermanently: () => ["customers", "permanently"] as const,
};

export const customerAddressesKeys = {
  all: ["customer-addresses"] as const,
  detail: (addressId: number) =>
    [...customerAddressesKeys.all, "detail", addressId] as const,
  listByCustomer: (customerId: number) =>
    [...customerAddressesKeys.all, "list", { customerId }] as const,

  mutations: {
    update: (addressId: number) =>
      ["customer-addresses", addressId, "update"] as const,
  },
};

export const customerNotesKeys = {
  all: ["customer-notes"] as const,
  detail: (customerId: number) =>
    [...customerNotesKeys.all, "detail", customerId] as const,
  listByCustomer: (customerId: number) =>
    [...customerNotesKeys.all, "list", { customerId }] as const,

  mutations: {
    update: (noteId: number) => ["customer-notes", noteId, "update"] as const,
  },
};
