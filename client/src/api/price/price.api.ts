import type { OrdersListResponse } from "../../features/orders/orders.types";
import type {
  PriceListResponse,
  PriceQueryTypes,
} from "../../features/price/price.types";
import { apiGet } from "../http";

export function getPriceList(
  params: PriceQueryTypes,
  signal?: AbortSignal,
): Promise<PriceListResponse> {
  const sp = new URLSearchParams();

  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));

  const query = sp.toString();
  const path = query ? `/price?${query}` : "/price";

  return apiGet<any>(path, signal);
}
