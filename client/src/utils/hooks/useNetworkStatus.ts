import { useEffect, useState } from "react";
import {
  notifySuccess,
  notifyWarning,
} from "../../whitelabel/src/atoms/notification/Notification";

export function useNetworkStatus() {
  const [isUserOnline, setIsUserOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const onOnline = () => {
      setIsUserOnline(true);

      notifySuccess({
        title: "Повторно сте онлајн",
        text: "Интернет конекцијата е повторно воспоставена.",
        pos: "top-center",
      });
    };

    const onOffline = () => {
      setIsUserOnline(false);

      notifyWarning({
        title: "Немате интернет конекција",
        text: "Проверете ја вашата интернет конекција. Дел од функциите може да бидат недостапни.",
        pos: "top-center",
      });
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return isUserOnline;
}
