import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deliveryTypeKeys,
  normalizeDeliveryListTypesParams,
} from "./deliveryType.keys";
import {
  createDeliveryType,
  deleteDeliveryType,
  getDeliveryTypeList,
  updateDeliveryType,
} from "../../api/deliveryType/deliveryType.api";
import type { DeliveryQueryTypes } from "../../components/blocks/settings/delivery/all/deliveryPriceConfig.types";
import type { EditDeliveryTypeFormValues } from "../../components/blocks/settings/delivery/edit/deliveryPriceConfigEdit.types";
import type { CreateDeliveryTypeFormValues } from "../../components/blocks/settings/delivery/create/deliveryPriceConfigCreate.types";
import { ordersKeys } from "../orders/orders.keys";

export function useDeliveryTypeList(params?: DeliveryQueryTypes) {
  const normalized = normalizeDeliveryListTypesParams(params ?? {});

  return useQuery({
    queryKey: deliveryTypeKeys.list(normalized),
    queryFn: ({ signal }) => getDeliveryTypeList(normalized, signal),
    placeholderData: keepPreviousData,
    //   staleTime: 5 * 60 * 1000,
  });
}

export function useDeliveryTypeUpdate(id?: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: deliveryTypeKeys.mutations.update(id),

    mutationFn: ({
      deliveryID,
      ...dto
    }: Partial<EditDeliveryTypeFormValues>) => {
      const resolvedID = id ?? deliveryID;

      if (!resolvedID) {
        throw new Error("Delivery type ID is required");
      }

      return updateDeliveryType(resolvedID, dto);
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: deliveryTypeKeys.lists(),
        }),
        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}

export function useCreateDeliveryType() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: deliveryTypeKeys.mutations.create(),
    mutationFn: (dto: CreateDeliveryTypeFormValues) => createDeliveryType(dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: deliveryTypeKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}

export function useDeleteDelivetyType() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: deliveryTypeKeys.mutations.deleteOne(),
    mutationFn: (id: number) => deleteDeliveryType(id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: deliveryTypeKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}
