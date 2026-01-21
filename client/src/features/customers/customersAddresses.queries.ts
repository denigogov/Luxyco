import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSingleAddress } from "../../api/customers/addresses.api";
import { customersKeys } from "./customers.keys";

export function useDeleteCustomerAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customer-addresses", "delete"] as const,
    mutationFn: ({
      customerId,
      addressId,
    }: {
      customerId: number;
      addressId: number;
    }) => deleteSingleAddress(customerId, addressId),

    onSuccess: (_data, ids) => {
      qc.invalidateQueries({ queryKey: customersKeys.detail(ids.customerId) });
    },
  });
}
