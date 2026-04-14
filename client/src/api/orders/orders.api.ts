import type { CreateOrderQueryType } from "../../components/blocks/orders/CreateOrder/createOrder.types";
import type {
  OrderPostResponse,
  OrderReferences,
  OrdersListParams,
  OrdersListResponse,
} from "../../features/orders/orders.types";
import { apiGet, apiPost } from "../http";

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
