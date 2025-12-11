// src/api/customers.api.ts
import { apiGet } from "./http";
import type { NormalizedCustomersListParams } from "../features/customers/customers.types";

export function getCustomersList(
  params: NormalizedCustomersListParams,
  signal?: AbortSignal
) {
  const qs = new URLSearchParams();

  // always include
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));

  if (params.limit !== 20) {
    qs.set("limit", String(params.limit));
  }

  // only include if non-empty
  if (params.search) qs.set("search", params.search);

  if (params.name) qs.set("name", params.name);
  if (params.phoneNumber) qs.set("phoneNumber", params.phoneNumber);
  if (params.city) qs.set("city", params.city);
  if (params.street) qs.set("street", params.street);

  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortDir) qs.set("sortDir", params.sortDir);

  return apiGet(`/customers?${qs.toString()}`, signal);
}

export function getCustomerById(id: number) {
  return apiGet(`/customers/${id}`);
}
