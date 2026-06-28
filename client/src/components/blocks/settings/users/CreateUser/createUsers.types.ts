import type { CreateUserQuery } from "../../../../../features/users/users.types";
import type { ButtonTypes } from "../../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";

export interface CreateUserTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<CreateUserQuery>[];
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
