import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { OrdersListParams } from "./orders.types";
import {
  createOrder,
  createOrderAdditionalPiece,
  deleteMultipleOrders,
  deleteOrderPieces,
  getOrderById,
  getOrderReferencesList,
  getOrdersList,
  updateOrder,
  updateOrderPieces,
} from "../../api/orders/orders.api";
import { normalizeOrdersListParams, ordersKeys } from "./orders.keys";
import type {
  CreateOrderItemsType,
  CreateOrderQueryType,
  UpdateOrderPiece,
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
    onSuccess: async () => {
      await qc.invalidateQueries({
        queryKey: ordersKeys.lists(),
      });
    },
  });
}

export function useOrderDetail(
  identifier: number | string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ordersKeys.detail(identifier ?? ""),
    queryFn: ({ signal }) => getOrderById(identifier!, signal),
    enabled: Boolean(identifier) && enabled,
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

export function useCreateAdditionalPiece(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.createPiece(id),
    mutationFn: (dto: CreateOrderItemsType) =>
      createOrderAdditionalPiece(id, dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ordersKeys.detail(id) }),
        qc.invalidateQueries({ queryKey: ordersKeys.lists() }),
      ]);
    },
  });
}

export function useUpdateOrderPiece(identifier: number | string, qr: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.updatePiece(identifier, qr),
    mutationFn: (dto: UpdateOrderPiece) =>
      updateOrderPieces(identifier, qr, dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: ordersKeys.detail(identifier),
        }),
        qc.invalidateQueries({
          queryKey: ordersKeys.lists(),
        }),
      ]);
    },
  });
}

export function useDeleteOrderPieces() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["orders", "delete"] as const,
    mutationFn: ({
      orderId,
      piecesId,
    }: {
      orderId: number | string;
      piecesId: string;
    }) => deleteOrderPieces(orderId, piecesId),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: ordersKeys.detail(variables.orderId),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.lists(),
        }),
      ]);
    },
  });
}

export function useDeletOrdersBulk() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["orders", "bulk-delete"] as const,
    mutationFn: (ids: number[]) => deleteMultipleOrders(ids),
    onSuccess: (_data, ids) => {
      ids.forEach((id) =>
        qc.removeQueries({ queryKey: ordersKeys.detail(id) }),
      );

      qc.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}
