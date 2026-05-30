import type { CreateProductFormValues } from "../../components/blocks/settings/price/Create/priceConfigurationNew.types";
import type { EditProductFormValues } from "../../components/blocks/settings/price/Edit/priceConfigurationEdit.types";
import type {
  PriceListResponse,
  PriceQueryTypes,
} from "../../features/price/price.types";
import { apiDelete, apiGet, apiPatch, apiPost } from "../http";

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

export function createProduct(dto: CreateProductFormValues) {
  return apiPost(`/price`, dto);
}

export function updateProduct(
  productId: number | undefined,
  dto: Partial<EditProductFormValues>,
) {
  return apiPatch<void>(`/price/${productId}`, dto);
}

export function deleteProduct(productId: number, signal?: AbortSignal) {
  return apiDelete<void>(`/price/${productId}`, undefined, signal);
}
