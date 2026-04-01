import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";

type CustomerNote = {
  id?: number;
  noteText: string;
};

type CustomerAddress = {
  id: number;
  addressName?: string;
  formattedAddress: string;
  isDefault: boolean;
  isVerifiedByProvider?: boolean;
};

export type Customer = {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  customerNotes?: CustomerNote[];
  customerAddresses?: CustomerAddress[];
};

export interface CustomerSelectionPanelProps {
  customer: Customer | null;
  selectedAddressId?: number | null;
  onAddressChange: (id: number | null) => void;
  onRemoveCustomer: () => void;
  createCustomer?: ModalTypes;
}
