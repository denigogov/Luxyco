import type { CustomerAddressTypes } from "../../components/blocks/customers/Details/customerDetails.types";
import { apiDelete, apiPatch } from "../http";

export function deleteSingleAddress(
  customerId: number,
  addressId: number,
  signal?: AbortSignal,
) {
  return apiDelete<void>(
    `/customer-addresses/${customerId}/${addressId}`,
    undefined,
    signal,
  );
}

export function updateCustomerAddress(
  addressesId: number,
  dto: Partial<CustomerAddressTypes>,
) {
  return apiPatch<CustomerAddressTypes>(
    `/customer-addresses/${addressesId}`,
    dto,
  );
}
