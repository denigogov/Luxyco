import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import type { OrdersListParams } from "./orders.types";
import {
  createOrder,
  createOrderAdditionalPiece,
  deleteMultipleOrders,
  deleteOrderPieces,
  getOrderById,
  getOrderReferencesList,
  getOrdersList,
  printBulkOrders,
  updateOrder,
  updateOrderPieces,
} from "../../api/orders/orders.api";
import { normalizeOrdersListParams, ordersKeys } from "./orders.keys";
import type {
  CreateOrderItemsType,
  CreateOrderQueryType,
  PrintBulkOrders,
  UpdateOrderPiece,
  UpdateOrderQueryType,
} from "../../components/blocks/orders/CreateOrder/createOrder.types";

async function invalidateOrderViews(qc: QueryClient) {
  await Promise.all([
    // Details may be cached under either the numeric ID or the QR code.
    qc.invalidateQueries({ queryKey: ordersKeys.details() }),
    qc.invalidateQueries({ queryKey: ordersKeys.lists() }),
  ]);
}

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

export function usePrintBulkOrders() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.printMany(),
    mutationFn: (dto: PrintBulkOrders) => printBulkOrders(dto),
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
  const normalizedIdentifier =
    identifier === undefined ? "" : String(identifier).trim();
  const hasIdentifier =
    typeof identifier === "number"
      ? identifier > 0
      : Boolean(normalizedIdentifier);

  return useQuery({
    queryKey: ordersKeys.detail(normalizedIdentifier),
    queryFn: ({ signal }) => getOrderById(normalizedIdentifier, signal),
    enabled: hasIdentifier && enabled,
  });
}

export function useUpdateOrder(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.update(id),
    mutationFn: (dto: Partial<UpdateOrderQueryType>) => updateOrder(id, dto),
    onSuccess: () => invalidateOrderViews(qc),
  });
}

export function useCreateAdditionalPiece(id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.createPiece(id),
    mutationFn: (dto: CreateOrderItemsType) =>
      createOrderAdditionalPiece(id, dto),
    onSuccess: () => invalidateOrderViews(qc),
  });
}

export function useUpdateOrderPiece(identifier: number | string, qr: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.updatePiece(identifier, qr),
    mutationFn: (dto: UpdateOrderPiece) =>
      updateOrderPieces(identifier, qr, dto),
    onSuccess: () => invalidateOrderViews(qc),
  });
}

export function useDeleteOrderPieces() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.deletePieces(),
    mutationFn: ({
      orderId,
      piecesId,
    }: {
      orderId: number | string;
      piecesId: string;
    }) => deleteOrderPieces(orderId, piecesId),

    onSuccess: () => invalidateOrderViews(qc),
  });
}

export function useDeleteOrdersBulk() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ordersKeys.mutations.deleteMany(),
    mutationFn: (ids: number[]) => deleteMultipleOrders(ids),
    onSuccess: async () => {
      // A deleted order may have detail caches under both its ID and QR code.
      qc.removeQueries({ queryKey: ordersKeys.details() });

      await qc.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}

export const useDeletOrdersBulk = useDeleteOrdersBulk;
