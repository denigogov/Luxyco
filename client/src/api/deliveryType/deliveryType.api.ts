import type {
  DeliveryQueryTypes,
  DeliveryTypeListResponse,
} from "../../components/blocks/settings/delivery/all/deliveryPriceConfig.types";

import { apiGet } from "../http";

export function getDeliveryTypeList(
  params: DeliveryQueryTypes,
  signal?: AbortSignal,
): Promise<DeliveryTypeListResponse> {
  const sp = new URLSearchParams();

  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.active != null) sp.set("active", String(params.active));

  const query = sp.toString();
  const path = query ? `/delivery-type?${query}` : "/delivery-type";

  return apiGet<any>(path, signal);
}
