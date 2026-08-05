import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { normalizePriceListParams, priceKeys } from "./price.keys";
import type { PriceQueryTypes } from "./price.types";
import {
  createProduct,
  deleteProduct,
  deleteProductPermanent,
  getPriceList,
  updateProduct,
} from "../../api/price/price.api";
import type { CreateProductFormValues } from "../../components/blocks/settings/price/Create/priceConfigurationNew.types";
import type { EditProductFormValues } from "../../components/blocks/settings/price/Edit/priceConfigurationEdit.types";
import { ordersKeys } from "../orders/orders.keys";

export function usePriceList(params?: PriceQueryTypes) {
  const normalized = normalizePriceListParams(params ?? {});

  return useQuery({
    queryKey: priceKeys.list(normalized),
    queryFn: ({ signal }) => getPriceList(normalized, signal),
    placeholderData: keepPreviousData,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: priceKeys.mutations.create(),
    mutationFn: (dto: CreateProductFormValues) => createProduct(dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: priceKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: priceKeys.mutations.deleteOne(),
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: priceKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}

export function useProductUpdate(id?: number | undefined) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: priceKeys.mutations.update(id),
    mutationFn: ({ priceID, ...dto }: Partial<EditProductFormValues>) => {
      const resolvedID = id ?? priceID;

      if (!resolvedID) {
        throw new Error("Price Type ID is required");
      }
      return updateProduct(resolvedID, dto);
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: priceKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}

export function useDeletePermanentProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: priceKeys.mutations.deleteOne(),
    mutationFn: (id: number) => deleteProductPermanent(id),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({
          queryKey: priceKeys.lists(),
        }),

        qc.invalidateQueries({
          queryKey: ordersKeys.references(),
        }),
      ]);
    },
  });
}
