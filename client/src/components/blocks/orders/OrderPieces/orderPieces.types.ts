import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";
import type { NotificationAlert } from "../../customers/Notes/customersNote.types";

export type OrderPieceFormValues = {
  width: string;
  height: string;
  pieceNote: string;
};

export type OrderPieceState = {
  id: string | number;
  qrCode: string;
  product: string;
  dimension?: string;
  price?: string;
  note?: string;
  measuredBy?: string;
  index?: string;
  isReady?: boolean;
  needsMeasurement?: boolean;
  width?: number;
  height?: number;
  customer?: string;
};

export type OrderPieceUpdateTypes = {
  submitButton: ButtonTypes;
  filedsData: RHFInputProps<OrderPieceFormValues>[];
  notification: NotificationAlert;
};
