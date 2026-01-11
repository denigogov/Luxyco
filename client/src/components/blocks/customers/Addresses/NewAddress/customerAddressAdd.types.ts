import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { BreadcrumbsTypes } from "../../../../../whitelabel/src/molecules/Breadcrumbs/m-breadcrumbs.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";
import type { CustomerAddressTypes } from "../../Details/customerDetails.types";

export interface customerAddAddressesTypes {
  submitButton: ButtonTypes;
  cancelButton?: ButtonTypes;
  breadcrumbs: BreadcrumbsTypes;
  filedsData: RHFInputProps<CustomerAddressTypes>[];
}
