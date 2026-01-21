import { apiDelete } from "../http";

export function deleteSingleAddress(
  customerId: number,
  addressId: number,
  signal?: AbortSignal
) {
  return apiDelete<void>(
    `/customer-addresses/${customerId}/${addressId}`,
    undefined,
    signal
  );
}
