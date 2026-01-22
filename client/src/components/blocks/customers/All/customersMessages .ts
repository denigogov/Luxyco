import {
  notifyDanger,
  notifySuccess,
} from "../../../../whitelabel/src/atoms/notification/Notification";
import type { NotifyPos } from "../../../../whitelabel/src/atoms/notification/notification.types";

type ToastPayload = {
  title: string;
  text: string;
  pos?: NotifyPos;
};

export const customersMessages = {
  deleteOne: {
    success: {
      title: "Успешно избришан клиент",
      text: "Клиентот е успешно избришан.",
    },
    error: {
      title: "Неуспешно бришење",
      text: "Се случи грешка при бришење на клиентот. Обидете се повторно.",
    },
  },
  deleteBulk: (count: number) => ({
    success: {
      title: `Успешно избришани ${count > 1 ? "клиенти." : "клиент."}`,
      text: `Избришани се ${count} ${count > 1 ? "клиенти." : "клиент."}`,
    },
    error: {
      title: "Неуспешно бришење",
      text: "Се случи грешка при бришење на клиентите. Обидете се повторно.",
    },
  }),
} as const;

const DEFAULT_POS = "bottom-right" as const;

export const notificationAlert = {
  success: (m: ToastPayload) =>
    notifySuccess({ ...m, pos: m.pos ?? DEFAULT_POS }),
  error: (m: ToastPayload) => notifyDanger({ ...m, pos: m.pos ?? DEFAULT_POS }),
};
