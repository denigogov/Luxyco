import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";

export type EditDeliveryTypeFormValues = {
  typeName: string;
  price: string | number;
  isActive: boolean;
  status?: string;
  type?: string;
  deliveryID?: number;
};

export interface DeliveryTypeConfigEditTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<Partial<EditDeliveryTypeFormValues>>[];
  notification: {
    success: {
      title: string;
      text: string;
    };
    error: {
      title: string;
      text: string;
    };
  };
}
