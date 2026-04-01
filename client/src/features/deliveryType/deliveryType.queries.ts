import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { deliveryTypeKeys } from "./deliveryType.keys";
import { getDeliveryTypeList } from "../../api/deliveryType/deliveryType.api";

export function useDeliveryTypeList() {
  return useQuery({
    queryKey: deliveryTypeKeys.list(),
    queryFn: ({ signal }) => getDeliveryTypeList("delivery-type", signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
