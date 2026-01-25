import {
  notifyDanger,
  notifySuccess,
} from "../../whitelabel/src/atoms/notification/Notification";
import type { NotifyPos } from "../../whitelabel/src/atoms/notification/notification.types";

export type ToastPayload = {
  title: string;
  text: string;
  pos?: NotifyPos;
};

type NotifierOptions = {
  defaultPos?: NotifyPos;
};

export function createNotifier(opts?: NotifierOptions) {
  const DEFAULT_POS = opts?.defaultPos ?? ("bottom-right" as const);

  return {
    success: (message: ToastPayload) =>
      notifySuccess({ ...message, pos: message.pos ?? DEFAULT_POS }),

    error: (message: ToastPayload) =>
      notifyDanger({ ...message, pos: message.pos ?? DEFAULT_POS }),
  };
}

export const notificationAlert = createNotifier({ defaultPos: "bottom-right" });
