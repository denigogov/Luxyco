import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
import { customersKeys, normalizeCustomersListParams } from "./customers.keys";
import type { CustomerAddressTypes } from "../../components/blocks/customers/Details/customerDetails.types";

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
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: customersKeys.lists() });

      qc.setQueryData(customersKeys.detail(created.id), (old: any) => ({
        ...(old ?? {}),
        ...created,
      }));

      qc.invalidateQueries({ queryKey: customersKeys.detail(created.id) });
    },
  });
}

export function useCreateCustomerAddress(customerId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customer-notes", customerId, "create"] as const,
    mutationFn: (dto: CustomerAddressTypes) =>
      createCustomerAddress(customerId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersKeys.detail(customerId) });
      qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

export function useUpdateCustomer(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customers", id, "update"] as const,
    mutationFn: (dto: Partial<Customer>) => updateCustomer(id, dto),
    onSuccess: (updated) => {
      qc.setQueryData(customersKeys.detail(id), (old: any) => ({
        ...(old ?? {}),
        ...updated,
      }));
      qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customers", "delete"] as const,
    mutationFn: (id: number) => deleteSingleCustomer(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: customersKeys.detail(id) });
      qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

export function useDeleteCustomersBulk() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customers", "bulk-delete"] as const,
    mutationFn: (ids: number[]) => deleteMultiCustomers(ids),
    onSuccess: (_data, ids) => {
      ids.forEach((id) =>
        qc.removeQueries({ queryKey: customersKeys.detail(id) }),
      );

      qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

export function useRestoreInactiveCustomer() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customers", "restore"] as const,
    mutationFn: (id: number) => restoreInactiveCustomer(id),
    onSuccess: (_data) => {
      qc.invalidateQueries({ queryKey: customersKeys.restoreOne() });
    },
  });
}

export function useDeleteCustomerPermanently() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customers", "permanently"] as const,
    mutationFn: (id: number) => deletePermanentlyCustomer(id),
    onSuccess: (_data) => {
      qc.invalidateQueries({ queryKey: customersKeys.deletePermanently() });
    },
  });
}
