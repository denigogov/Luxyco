import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";
import type { CustomerAddressTypes } from "../../Details/customerDetails.types";
import type { NotificationAlert } from "../../Notes/customersNote.types";

export interface EditCustomerAddressesTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<CustomerAddressTypes>[];
  notification: NotificationAlert;
}
