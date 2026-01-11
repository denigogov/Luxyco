export interface CustomerAddressTypes {
  id: number;
  street: string;
  city: string;
  village: string | null;
  postalCode: string;
  country: string;
  formattedAddress: string;
  isDefault: boolean;
  isActive: boolean;
  latitude: string;
  longitude: string;
  isVerifiedByProvider: boolean;
}

export interface CustomerStatsTypes {
  totalOrders: number;
  totalM2: number;
  totalMoney: number;
  avgOrderValue: number;
  lastOrderDate: string;
}

export type OrderStatusTypes =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type DeliveryTypeTypes = "PICKUP" | "DELIVERY";

export interface CustomerOrderTypes {
  qrCode: string;
  scheduledDate: string;
  status: OrderStatusTypes | string;
  deliveryType: DeliveryTypeTypes | string;
  createdBy: string;
  totalPieces: number;
  measuredPieces: number;
  totalM2: number;
  totalPrice: number;
  createdAt: string; // ISO date string
}

export interface CustomerNotes {
  createdAt: string;
  id: number;
  noteText: string;
  updatedAt: string;
  users: {
    firstName: string;
    lastName: string;
  };
}

export interface CustomerDetailsTypes {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  customerAddresses?: CustomerAddressTypes[];
  stats: CustomerStatsTypes;
  orders?: CustomerOrderTypes[];
  customerNote: CustomerNotes[];
}
