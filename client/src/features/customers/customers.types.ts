export type CustomersSortBy = "created_at" | "name";
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
};

export interface CustomerAdress {
  id: number;
  street: string;
  city: string;
  postal_code: number;
  country: string;
  formatted_address: string;
  is_default: boolean;
  is_active: boolean;
  latitude: number;
  longitude: number;
}

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  customer_addresses: CustomerAdress[];
};
