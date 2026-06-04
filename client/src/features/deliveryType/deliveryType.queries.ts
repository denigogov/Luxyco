import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  deliveryTypeKeys,
  normalizeDeliveryListTypesParams,
} from "./deliveryType.keys";
import { getDeliveryTypeList } from "../../api/deliveryType/deliveryType.api";
import type { DeliveryQueryTypes } from "../../components/blocks/settings/delivery/all/deliveryPriceConfig.types";

export function useDeliveryTypeList(params?: DeliveryQueryTypes) {
  const normalized = normalizeDeliveryListTypesParams(params ?? {});

  return useQuery({
    queryKey: deliveryTypeKeys.list(normalized),
    queryFn: ({ signal }) => getDeliveryTypeList(normalized, signal),
    placeholderData: keepPreviousData,
    //   staleTime: 5 * 60 * 1000,
  });
}
