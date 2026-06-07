import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";

export type CreateDeliveryTypeFormValues = {
  typeName: string;
  price: number;
};

export interface DeliveryTypeNewTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<CreateDeliveryTypeFormValues>[];
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
