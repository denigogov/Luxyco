import { apiGet } from "./http";
import type {
  NormalizedCustomersListParams,
  Customer,
} from "../features/customers/customers.types";

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
  signal?: AbortSignal
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

export function getCustomerById(id: number) {
  return apiGet(`/customers/${id}`);
}
