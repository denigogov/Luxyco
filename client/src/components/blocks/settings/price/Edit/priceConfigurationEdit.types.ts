import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";

export type EditProductFormValues = {
  id?: number;
  name: string;
  basePrice: number;
  status: number | "";
  priceModelId: string | "";
  isActive: boolean;
  priceID?: number; // special case ID when reactivate the price
};

export interface PriceConfigEditTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<Partial<EditProductFormValues>>[];
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
