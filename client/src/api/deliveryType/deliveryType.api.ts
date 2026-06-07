import type {
  DeliveryQueryTypes,
  DeliveryTypeListResponse,
} from "../../components/blocks/settings/delivery/all/deliveryPriceConfig.types";
import type { CreateDeliveryTypeFormValues } from "../../components/blocks/settings/delivery/create/deliveryPriceConfigCreate.types";
import type { EditDeliveryTypeFormValues } from "../../components/blocks/settings/delivery/edit/deliveryPriceConfigEdit.types";

import { apiGet, apiPatch, apiPost } from "../http";

const DELIVERY_TYPE_URL = "/delivery-type";

export function getDeliveryTypeList(
  params: DeliveryQueryTypes,
  signal?: AbortSignal,
): Promise<DeliveryTypeListResponse> {
  const sp = new URLSearchParams();

  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.active != null) sp.set("active", String(params.active));

  const query = sp.toString();
  const path = query ? `${DELIVERY_TYPE_URL}?${query}` : `${DELIVERY_TYPE_URL}`;

  return apiGet<any>(path, signal);
}

export function updateDeliveryType(
  productId: number | undefined,
  dto: Partial<EditDeliveryTypeFormValues>,
) {
  return apiPatch<void>(`${DELIVERY_TYPE_URL}/${productId}`, dto);
}

export function createDeliveryType(dto: CreateDeliveryTypeFormValues) {
  return apiPost(`${DELIVERY_TYPE_URL}`, dto);
}
