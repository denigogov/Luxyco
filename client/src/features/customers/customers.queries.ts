import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  createCustomerAddress,
  deleteMultiCustomers,
  deletePermanentlyCustomer,
  deleteSingleCustomer,
  getCustomerById,
  getCustomersList,
  getCustomersOrderList,
  restoreInactiveCustomer,
  updateCustomer,
} from "../../api/customers/customers.api";
import type {
  CreateCustomer,
  Customer,
  CustomersListParams,
} from "./customers.types";
import {
  customerAddressesKeys,
  customerNotesKeys,
  customersKeys,
  normalizeCustomersListParams,
} from "./customers.keys";
import type { CustomerAddressTypes } from "../../components/blocks/customers/Details/customerDetails.types";

function removeCustomerScopedQueries(qc: QueryClient, customerId: number) {
  qc.removeQueries({
    queryKey: customersKeys.detail(customerId),
    exact: true,
  });
  qc.removeQueries({
    queryKey: customerAddressesKeys.listByCustomer(customerId),
    exact: true,
  });
  qc.removeQueries({
    queryKey: customerNotesKeys.listByCustomer(customerId),
    exact: true,
  });
}

export function useCustomersList(
  params?: CustomersListParams,
  enabled: boolean = true,
) {
  const normalized = normalizeCustomersListParams(params ?? {});

  return useQuery({
    queryKey: customersKeys.list(normalized),
    queryFn: ({ signal }) => getCustomersList(normalized, signal),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useCustomersOrderList(
  params?: CustomersListParams,
  enabled: boolean = true,
) {
  const normalized = normalizeCustomersListParams(params ?? {});

  return useQuery({
    queryKey: customersKeys.listOrder(normalized),
    queryFn: ({ signal }) => getCustomersOrderList(normalized, signal),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: customersKeys.detail(id),
    queryFn: ({ signal }) => getCustomerById(id, signal),
    enabled: id > 0,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.create(),
    mutationFn: (dto: CreateCustomer) => createCustomer(dto),

    onSuccess: async (created) => {
      qc.setQueryData(customersKeys.detail(created.id), created);

      await Promise.all([
        qc.invalidateQueries({ queryKey: customersKeys.detail(created.id) }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
      ]);
    },
  });
}

export function useCreateCustomerAddress(customerId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customerAddressesKeys.mutations.create(customerId),

    mutationFn: (dto: CustomerAddressTypes) =>
      createCustomerAddress(customerId, dto),

    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: customersKeys.detail(customerId),
        }),

        qc.invalidateQueries({
          queryKey: customersKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: customerAddressesKeys.listByCustomer(customerId),
        }),
      ]);
    },
  });
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.update(id),
    mutationFn: (dto: Partial<Customer>) => updateCustomer(id, dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: customersKeys.detail(id),
        }),

        qc.invalidateQueries({
          queryKey: customersKeys.lists(),
        }),
      ]);
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.deleteOne(),
    mutationFn: (id: number) => deleteSingleCustomer(id),
    onSuccess: async (_data, id) => {
      removeCustomerScopedQueries(qc, id);

      await qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

export function useDeleteCustomersBulk() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.deleteMany(),
    mutationFn: (ids: number[]) => deleteMultiCustomers(ids),
    onSuccess: async (_data, ids) => {
      ids.forEach((id) => removeCustomerScopedQueries(qc, id));

      await qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

export function useRestoreInactiveCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.restoreOne(),
    mutationFn: (id: number) => restoreInactiveCustomer(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: customersKeys.detail(id) }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
      ]);
    },
  });
}

export function useDeleteCustomerPermanently() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.deletePermanently(),
    mutationFn: (id: number) => deletePermanentlyCustomer(id),
    onSuccess: async (_data, id) => {
      removeCustomerScopedQueries(qc, id);

      await qc.invalidateQueries({
        queryKey: customersKeys.lists(),
      });
    },
  });
}
