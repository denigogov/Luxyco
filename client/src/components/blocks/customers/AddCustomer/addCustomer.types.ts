import type { customerDataType } from "../../../../whitelabel/src/molecules/InactiveCustomerNotice/InactiveCustomerNotice.types";
import type { CustomersTypes } from "../All/customers.types";

export type CreateCustomerFullForm = {
  // Group 1
  firstName: string;
  lastName: string;
  phoneNumber: string;

  // Group 2 (address)
  street: string;
  city: string;
  village?: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
  latitude: string;
  longitude: string;
  isDefault: boolean;
  isVerifiedByProvider: boolean;

  // Group 3
  noteText?: string;

  id?: number;
};

export type ApiErrorResponse = {
  statusCode?: number;
  path?: string;
  timestamp?: string;
  error?: {
    message?: string;
    code?: string;
    customer?: CustomersTypes;
  };
};

export type InactiveConflict = {
  isActive: boolean;
  customer: customerDataType;
};
