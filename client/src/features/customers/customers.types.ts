export type CustomersSortBy = "createdAt" | "name";
export type CustomersSortDir = "asc" | "desc";

export type CustomersListParams = {
  page?: number;
  limit?: number;
  search?: string;

  sortBy?: CustomersSortBy;
  sortDir?: CustomersSortDir;

  name?: string;
  phoneNumber?: string;
  city?: string;
  street?: string;
  village?: string;
};

export type NormalizedCustomersListParams = {
  page: number;
  limit: number;

  // sort
  sortBy?: string;
  sortDir?: CustomersSortDir;

  // search
  search: string;

  // filter
  name?: string;
  phoneNumber?: string;
  city?: string;
  street?: string;
  village?: string;
};

export interface CustomerAdress {
  id: number;
  street: string;
  city: string;
  postal_code: number;
  country: string;
  formatted_address: string;
  isDefault: boolean;
  isActive: boolean;
  latitude: number;
  longitude: number;
  village: string;
}

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  phone_number: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customerAddresses: CustomerAdress[];
};
