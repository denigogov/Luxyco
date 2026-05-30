import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";

export type CreateProductFormValues = {
  name: string;
  basePrice: number;
  status: number | "";
  priceModelId: number | "";
};

export interface PriceConfigNewTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<CreateProductFormValues>[];
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
