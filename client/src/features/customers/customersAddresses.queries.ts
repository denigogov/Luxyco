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

type UpdateCustomerAddressesVars = {
  customerId: number;
  addressId: number;
  dto: Partial<CustomerAddressTypes>;
};

export function useUpdateCustomerAddresses() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customer-addresses", "update"] as const,
    mutationFn: (vars: UpdateCustomerAddressesVars) =>
      updateCustomerAddress(vars.addressId, vars.dto),

    onSuccess: (updated, vars) => {
      qc.invalidateQueries({ queryKey: customersKeys.detail(vars.customerId) });
      qc.setQueryData(customerAddressesKeys.detail(vars.addressId), updated);
    },
  });
}
