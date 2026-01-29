import type { Customer } from "../../../../features/customers/customers.types";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";
import type { NotificationAlert } from "../Notes/customersNote.types";

export type UpdateCustomerFormValues = Pick<
  Customer,
  "firstName" | "lastName" | "phoneNumber"
>;

export interface UpdateCustomerTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<UpdateCustomerFormValues>[];
  notification: NotificationAlert;
}
