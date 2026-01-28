import type { ToastPayload } from "../../../../utils/hooks/notify";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";

export type NoteType = {
  noteText: string;
};

export type NotificationAlert = {
  success: ToastPayload;
  error: ToastPayload;
};

export interface CustomerNotesTypes {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<NoteType>[];
  notification: NotificationAlert;
}
