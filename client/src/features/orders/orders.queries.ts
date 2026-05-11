import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { OrdersListParams } from "./orders.types";
import {
  createOrder,
  getOrderById,
  getOrderReferencesList,
  getOrdersList,
  updateOrder,
} from "../../api/orders/orders.api";
import { normalizeOrdersListParams, ordersKeys } from "./orders.keys";
import type {
  CreateOrderQueryType,
  UpdateOrderQueryType,
} from "../../components/blocks/orders/CreateOrder/createOrder.types";

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

export function useOrderDetail(id: number) {
  return useQuery({
    queryKey: ordersKeys.detail(id),
    queryFn: ({ signal }) => getOrderById(id, signal),
    enabled: id > 0,
  });
}

export function useUpdateOrder(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.update(id),
    mutationFn: (dto: Partial<UpdateOrderQueryType>) => updateOrder(id, dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ordersKeys.detail(id) }),
        qc.invalidateQueries({ queryKey: ordersKeys.lists() }),
      ]);
    },
  });
}
