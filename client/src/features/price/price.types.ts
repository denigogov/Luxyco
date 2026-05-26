type priceModelType = {
  id: number;
  name: string;
};

export interface PriceQueryTypes {
  page?: number;
  limit?: number;
}

export interface PriceListTypes {
  id: number;
  name: string;
  basePrice: number;
  pricingModelId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  priceModel: priceModelType;
}
export type PriceListResponse = {
  data: PriceListTypes[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
