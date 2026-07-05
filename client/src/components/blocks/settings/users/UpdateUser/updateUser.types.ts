import type { UpdateUserForm } from "../../../../../features/users/users.types";
import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";

export interface UpdateUserTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<UpdateUserForm>[];
}
