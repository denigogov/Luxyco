export type OrdersSortBy = "createdAt" | "scheduledDate";
export type OrdersSortDir = "asc" | "desc";

// backend validates YYYY-MM-DD for these
export type YMDDateString = string;
// export type YMDDateString =
//   `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

export type OrdersListParams = {
  page?: number;
  limit?: number;

  search?: string;
  qrCode?: string;

  phoneNumber?: string;
  name?: string;

  city?: string;
  village?: string;
  street?: string;

  status?: string;
  deliveryType?: string;

  scheduledFrom?: YMDDateString;
  scheduledTo?: YMDDateString;

  createdFrom?: YMDDateString;
  createdTo?: YMDDateString;

  sortBy?: OrdersSortBy;
  sortDir?: OrdersSortDir;
};

export type OrdersListResponse = {
  data: OrderListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type OrderStatus = {
  id: number;
  statusName: string;
};

export type OrderDeliveryType = {
  typeName: string;
};

export type OrderCustomer = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

export type MeasurementStatus = {
  progress: `${number}/${number}`; // e.g. "0/3"
  isComplete: boolean;
};

export type OrderListItem = {
  id: number;

  qrCode: string;

  // backend sends ISO datetime string like "2026-01-07T00:00:00.000Z"
  scheduledDate: string;
  createdAt: string;

  status: OrderStatus;
  deliveryType: OrderDeliveryType;

  customers: OrderCustomer;

  totalPieces: number;
  measuredPieces: number;

  measurementStatus: MeasurementStatus;

  createdTo: string;
  createdFrom: string;
};

export interface DeliveryType {
  id: number;
  typeName: string;
  price: number;
}
export interface ServiceType {
  id: number;
  serviceName: string;
}

export interface ProductType {
  id: number;
  name: string;
  basePrice: string;
  priceModelId: 1 | 2;
  priceMOdelName: "PER_PIECE" | "PER_M2";
}
export interface OrderReferences {
  deliveryTypes: DeliveryType[];
  serviceTypes: ServiceType[];
  productTypes: ProductType[];
}

interface OrderPiece {
  id: number;
  pieceIndex: number;
  labelCode: string;
  width: number | null;
  height: number | null;
  price: number;
  pieceNote: string | null;
  productTypes: Pick<ProductType, "id" | "name" | "basePrice">;
}
export interface OrderPostResponse {
  id: number;
  qrCode: string;
  scheduledDate: string;
  createdAt?: string;
  totalPieces: number;
  totalPrice: number;
  orderNote: string | null;
  customers: OrderCustomer & {
    id: number;
  };
  customerAddresses: {
    formattedAddress: string;
  } | null;
  deliveryType: DeliveryType;
  serviceType: ServiceType;
  status: OrderStatus;
  orderPieces: OrderPiece[];
}
