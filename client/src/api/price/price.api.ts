import type { CreateProductFormValues } from "../../components/blocks/settings/price/Create/priceConfigurationNew.types";
import type { EditProductFormValues } from "../../components/blocks/settings/price/Edit/priceConfigurationEdit.types";
import type {
  PriceListResponse,
  PriceQueryTypes,
} from "../../features/price/price.types";
import { apiDelete, apiGet, apiPatch, apiPost } from "../http";

const PRICE_BASE_URL = "/price";

export function getPriceList(
  params: PriceQueryTypes,
  signal?: AbortSignal,
): Promise<PriceListResponse> {
  const sp = new URLSearchParams();

  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));

  const query = sp.toString();
  const path = query ? `${PRICE_BASE_URL}?${query}` : `${PRICE_BASE_URL}`;

  return apiGet<any>(path, signal);
}

export function createProduct(dto: CreateProductFormValues) {
  return apiPost(`${PRICE_BASE_URL}`, dto);
}

export function updateProduct(
  productId: number | undefined,
  dto: Partial<EditProductFormValues>,
) {
  return apiPatch<void>(`${PRICE_BASE_URL}/${productId}`, dto);
}

export function deleteProduct(productId: number, signal?: AbortSignal) {
  return apiDelete<void>(`${PRICE_BASE_URL}/${productId}`, undefined, signal);
}

export function deleteProductPermanent(
  productId: number,
  signal?: AbortSignal,
) {
  return apiDelete<void>(
    `${PRICE_BASE_URL}/permanent/${productId}`,
    undefined,
    signal,
  );
}
