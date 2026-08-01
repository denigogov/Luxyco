import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSingleAddress,
  updateCustomerAddress,
} from "../../api/customers/addresses.api";
import { customerAddressesKeys, customersKeys } from "./customers.keys";
import type { CustomerAddressTypes } from "../../components/blocks/customers/Details/customerDetails.types";

export function useDeleteCustomerAddress() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customerAddressesKeys.mutations.deleteOne(),
    mutationFn: ({
      customerId,
      addressId,
    }: {
      customerId: number;
      addressId: number;
    }) => deleteSingleAddress(customerId, addressId),

    onSuccess: async (_data, ids) => {
      qc.removeQueries({
        queryKey: customerAddressesKeys.detail(ids.addressId),
        exact: true,
      });

      await Promise.all([
        qc.invalidateQueries({
          queryKey: customersKeys.detail(ids.customerId),
        }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
        qc.invalidateQueries({
          queryKey: customerAddressesKeys.listByCustomer(ids.customerId),
        }),
      ]);
    },
  });
}

type UpdateCustomerAddressesVars = {
  customerId: number;
  addressId: number;
  dto: Partial<CustomerAddressTypes>;
};

export function useUpdateCustomerAddresses() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customerAddressesKeys.mutations.update(),
    mutationFn: (vars: UpdateCustomerAddressesVars) =>
      updateCustomerAddress(vars.addressId, vars.dto),

    onSuccess: async (updated, vars) => {
      qc.setQueryData(customerAddressesKeys.detail(vars.addressId), updated);

      await Promise.all([
        qc.invalidateQueries({
          queryKey: customersKeys.detail(vars.customerId),
        }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
        qc.invalidateQueries({
          queryKey: customerAddressesKeys.listByCustomer(vars.customerId),
        }),
      ]);
    },
  });
}
