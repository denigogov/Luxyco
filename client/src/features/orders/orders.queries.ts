import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { OrdersListParams } from "./orders.types";
import {
  getOrderReferencesList,
  getOrdersList,
} from "../../api/orders/orders.api";
import { normalizeOrdersListParams, ordersKeys } from "./orders.keys";

export function useOrdersList(params?: OrdersListParams) {
  const normalized = normalizeOrdersListParams(params ?? {});

  return useQuery({
    queryKey: ordersKeys.list(normalized),
    queryFn: ({ signal }) => getOrdersList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}

export function useOrderReferencesList() {
  return useQuery({
    queryKey: ordersKeys.references(),
    queryFn: ({ signal }) =>
      getOrderReferencesList("orders/references", signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
