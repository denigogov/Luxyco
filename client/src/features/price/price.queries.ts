import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { normalizePriceListParams, priceKeys } from "./price.keys";
import type { PriceQueryTypes } from "./price.types";
import { getPriceList } from "../../api/price/price.api";

export function usePriceList(params?: PriceQueryTypes) {
  const normalized = normalizePriceListParams(params ?? {});

  return useQuery({
    queryKey: priceKeys.list(normalized),
    queryFn: ({ signal }) => getPriceList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}
