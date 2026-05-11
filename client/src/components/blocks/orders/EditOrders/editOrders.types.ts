import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";

export type EditOrderFormValues = {
  scheduledDate: string;
  orderNote: string;
  status: number | "";
  deliveryType: number | "";
  customerAddress: string;
};

export type EditOrderTypes = {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<EditOrderFormValues>[];
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
};
