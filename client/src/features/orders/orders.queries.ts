import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { OrdersListParams } from "./orders.types";
import { getOrdersList } from "../../api/orders/orders.api";
import { normalizeOrdersListParams, ordersKeys } from "./orders.keys";

export function useOrdersList(params?: OrdersListParams) {
  const normalized = normalizeOrdersListParams(params ?? {});

  return useQuery({
    queryKey: ordersKeys.list(normalized),
    queryFn: ({ signal }) => getOrdersList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}
