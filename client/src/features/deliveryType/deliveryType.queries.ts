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
  getDeliveryTypeList,
  updateDeliveryType,
} from "../../api/deliveryType/deliveryType.api";
import type { DeliveryQueryTypes } from "../../components/blocks/settings/delivery/all/deliveryPriceConfig.types";
import type { EditDeliveryTypeFormValues } from "../../components/blocks/settings/delivery/edit/deliveryPriceConfigEdit.types";
import type { CreateDeliveryTypeFormValues } from "../../components/blocks/settings/delivery/create/deliveryPriceConfigCreate.types";

export function useDeliveryTypeList(params?: DeliveryQueryTypes) {
  const normalized = normalizeDeliveryListTypesParams(params ?? {});

  return useQuery({
    queryKey: deliveryTypeKeys.list(normalized),
    queryFn: ({ signal }) => getDeliveryTypeList(normalized, signal),
    placeholderData: keepPreviousData,
    //   staleTime: 5 * 60 * 1000,
  });
}

export function useDeliveryTypeUpdate(id: number | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: deliveryTypeKeys.mutations.update(id),
    mutationFn: (dto: Partial<EditDeliveryTypeFormValues>) =>
      updateDeliveryType(id, dto),
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: deliveryTypeKeys.lists(),
      });
    },
  });
}

export function useCreateDeliveryType() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: deliveryTypeKeys.mutations.create(),
    mutationFn: (dto: CreateDeliveryTypeFormValues) => createDeliveryType(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: deliveryTypeKeys.lists() });
    },
  });
}
