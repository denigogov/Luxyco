import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCustomerById, getCustomersList } from "../../api/customers.api";
import type { CustomersListParams } from "./customers.types";
import { customersKeys, normalizeCustomersListParams } from "./customers.keys";

export function useCustomersList(params?: CustomersListParams) {
  const normalized = normalizeCustomersListParams(params ?? {});

  return useQuery({
    queryKey: customersKeys.list(normalized),
    queryFn: ({ signal }) => getCustomersList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: customersKeys.detail(id),
    queryFn: ({ signal }) => getCustomerById(id, signal),
    enabled: id > 0,
  });
}
