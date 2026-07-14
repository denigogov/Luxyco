import type {
  CreateOrderItemsType,
  CreateOrderQueryType,
  PrintBulkOrders,
  UpdateOrderPiece,
  UpdateOrderQueryType,
} from "../../components/blocks/orders/CreateOrder/createOrder.types";
import type {
  OrderPostResponse,
  OrderReferences,
  OrdersListParams,
  OrdersListResponse,
} from "../../features/orders/orders.types";
import { apiDelete, apiGet, apiPatch, apiPost } from "../http";

export function getOrdersList(
  params: OrdersListParams,
  signal?: AbortSignal,
): Promise<OrdersListResponse> {
  const sp = new URLSearchParams();

  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));

  if (params.search) sp.set("search", params.search);
  if (params.qrCode) sp.set("qrCode", params.qrCode);

  if (params.phoneNumber) sp.set("phoneNumber", params.phoneNumber);
  if (params.name) sp.set("name", params.name);

  if (params.city) sp.set("city", params.city);
  if (params.village) sp.set("village", params.village);

  if (params.scheduledFrom) sp.set("scheduledFrom", params.scheduledFrom);

  if (params.status) sp.set("status", params.status);
  if (params.deliveryType) sp.set("deliveryType", params.deliveryType);

  if (params.scheduledFrom) sp.set("scheduledFrom", params.scheduledFrom);
  if (params.scheduledTo) sp.set("scheduledTo", params.scheduledTo);

  if (params.createdFrom) sp.set("createdFrom", params.createdFrom);
  if (params.createdTo) sp.set("createdTo", params.createdTo);

  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortDir) sp.set("sortDir", params.sortDir);

  const query = sp.toString();
  const path = query ? `/orders?${query}` : "/orders";

  return apiGet<OrdersListResponse>(path, signal);
}

export function getOrderReferencesList(
  path: string,
  signal?: AbortSignal,
): Promise<OrderReferences> {
  return apiGet<OrderReferences>(path, signal);
}

export function createOrder(body: CreateOrderQueryType, signal?: AbortSignal) {
  return apiPost<OrderPostResponse>("/orders", body, signal);
}

export function printBulkOrders(body: PrintBulkOrders, signal?: AbortSignal) {
  return apiPost<OrderPostResponse[]>("/orders/bulk-data", body, signal);
}

export function createOrderAdditionalPiece(
  id: number,
  dto?: CreateOrderItemsType,
) {
  return apiPost<any>(`/orders/pieces/${id}`, dto);
}

export function getOrderById(
  identifier: number | string,
  signal?: AbortSignal,
) {
  return apiGet<any>(
    `/orders/${encodeURIComponent(String(identifier))}`,
    signal,
  );
}

export function updateOrder(id: number, dto: Partial<UpdateOrderQueryType>) {
  return apiPatch<void>(`/orders/${id}`, dto);
}

export function updateOrderPieces(
  identifier: number | string,
  qr: string,
  dto: UpdateOrderPiece,
) {
  return apiPatch<void>(
    `/orders/${encodeURIComponent(String(identifier))}/item/${encodeURIComponent(qr)}`,
    dto,
  );
}

export function deleteOrderPieces(
  orderId: number | string,
  pieceQr: string,
  signal?: AbortSignal,
) {
  return apiDelete<void>(
    `/orders/${encodeURIComponent(String(orderId))}/item/${encodeURIComponent(pieceQr)}`,
    undefined,
    signal,
  );
}

export function deleteMultipleOrders(ids: number[], signal?: AbortSignal) {
  return apiDelete<void>("/orders/bulk", { ids }, signal);
}
