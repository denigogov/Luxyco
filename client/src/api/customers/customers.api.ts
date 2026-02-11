import { apiDelete, apiGet, apiPatch, apiPost } from "../http";
import type {
  NormalizedCustomersListParams,
  Customer,
  CreateCustomer,
} from "../../features/customers/customers.types";
import type {
  CustomerAddressTypes,
  CustomerDetailsTypes,
} from "../../components/blocks/customers/Details/customerDetails.types";

export type CustomersListResponse = {
  data: Customer[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export function getCustomersList(
  params: NormalizedCustomersListParams,
  signal?: AbortSignal,
): Promise<CustomersListResponse> {
  const sp = new URLSearchParams();

  sp.set("page", String(params.page));
  sp.set("limit", String(params.limit));

  if (params.search) sp.set("search", params.search);
  if (params.name) sp.set("name", params.name);
  if (params.phoneNumber) sp.set("phoneNumber", params.phoneNumber);
  if (params.city) sp.set("city", params.city);
  if (params.street) sp.set("street", params.street);
  if (params.village) sp.set("village", params.village);

  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortDir) sp.set("sortDir", params.sortDir);

  const query = sp.toString();
  const path = query ? `/customers?${query}` : "/customers";

  return apiGet<CustomersListResponse>(path, signal);
}

export function getCustomerById(id: number, signal?: AbortSignal) {
  return apiGet<CustomerDetailsTypes>(`/customers/${id}`, signal);
}

export function createCustomer(body: CreateCustomer, signal?: AbortSignal) {
  return apiPost<Customer>("/customers", body, signal);
}

export function createCustomerAddress(
  customerId: number,
  dto: CustomerAddressTypes,
) {
  return apiPost(`/customer-addresses/${customerId}`, dto);
}

export function updateCustomer(id: number, dto: Partial<Customer>) {
  return apiPatch<Customer>(`/customers/${id}`, dto);
}

export function deleteSingleCustomer(id: number, signal?: AbortSignal) {
  return apiDelete<void>(`/customers/${id}`, signal);
}

export function deleteMultiCustomers(ids: number[], signal?: AbortSignal) {
  return apiDelete<void>("/customers/bulk", { ids }, signal);
}

export function restoreInactiveCustomer(id: number, signal?: AbortSignal) {
  return apiDelete<void>(`/customers/restore/${id}`, undefined, signal);
}

export function deletePermanentlyCustomer(id: number, signal?: AbortSignal) {
  return apiDelete<void>(`/customers/delete/${id}`, undefined, signal);
}
