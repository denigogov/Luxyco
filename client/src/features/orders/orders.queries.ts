import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { OrdersListParams } from "./orders.types";
import {
  createOrder,
  getOrderReferencesList,
  getOrdersList,
} from "../../api/orders/orders.api";
import { normalizeOrdersListParams, ordersKeys } from "./orders.keys";
import type { CreateOrderQueryType } from "../../components/blocks/orders/CreateOrder/createOrder.types";

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

export function useCreateOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.create(),
    mutationFn: (dto: CreateOrderQueryType) => createOrder(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}
