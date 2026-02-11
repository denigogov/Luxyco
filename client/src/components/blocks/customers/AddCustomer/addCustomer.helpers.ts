// src/.../Add/addCustomer.helpers.ts
import { notificationAlert } from "../../../../utils/hooks/notify";
import type { InactiveCustomerNoticeTypes } from "../../../../whitelabel/src/molecules/InactiveCustomerNotice/InactiveCustomerNotice.types";
import { createCustomerMessages } from "./addCustomer.data";
import type { InactiveConflict } from "./addCustomer.types";

type restoreCustomerFn = (id: number) => Promise<unknown>;
type deletePermanentlyCustomerFn = (id: number) => Promise<unknown>;
/**
 * Builds confirmActivate + confirmDelete config
 * for an INACTIVE customer conflict.
 *
 */
export function buildInactiveNoticeConfig(args: {
  base: InactiveCustomerNoticeTypes;
  conflict: InactiveConflict;
  closeModal: () => void;
  restoreCustomer: restoreCustomerFn;
  deletePermanentlyCustomer: deletePermanentlyCustomerFn;
  deleteIsPending: boolean;
  restoreIsPending: boolean;
}): Pick<InactiveCustomerNoticeTypes, "confirmActivate" | "confirmDelete"> {
  const {
    base,
    conflict,
    closeModal,
    restoreCustomer,
    deletePermanentlyCustomer,
    deleteIsPending,
    restoreIsPending,
  } = args;

  return {
    // ACTIVATE dialog
    confirmActivate: {
      ...base.confirmActivate,
      buttons: base.confirmActivate?.buttons?.map((b, index, arr) => {
        const isLast = index === arr.length - 1; // last = "Активирај"

        if (isLast) {
          // CONFIRM ACTIVATE
          return {
            ...b,
            loading: restoreIsPending,
            onClick: async () => {
              await restoreCustomer(Number(conflict.customer.id));
            },
          };
        }

        return {
          ...b,
          onClick: () => {
            closeModal();
          },
        };
      }),
    },

    // DELETE dialog
    confirmDelete: {
      ...base.confirmDelete,
      buttons: base.confirmDelete?.buttons?.map((b, index, arr) => {
        const isLast = index === arr.length - 1; // last = "Избриши трајно"

        if (isLast) {
          return {
            ...b,
            loading: deleteIsPending,
            onClick: async () => {
              await deletePermanentlyCustomer(Number(conflict.customer.id));
            },
          };
        }

        // CANCEL DELETE
        return {
          ...b,
          onClick: () => {
            console.log("CANCEL delete modal");
            closeModal();
          },
        };
      }),
    },
  };
}
type InactiveConflictSetter = (value: any) => void;
export const sendErrorMessage = ({
  customer,
  code,
  setInactiveConflict,
  message,
}: {
  customer: any;
  code?: string;
  setInactiveConflict: InactiveConflictSetter;
  message?: string;
}) => {
  switch (code) {
    case "CUSTOMER_INACTIVE_WITH_PHONE":
      notificationAlert.error({
        title: createCustomerMessages.notification.errorInactive.title,
        text: message ?? createCustomerMessages.notification.errorInactive.text,
      });

      setInactiveConflict({ isActive: false, customer });
      break;

    case "CUSTOMER_ACTIVE_WITH_PHONE":
      notificationAlert.error({
        title: createCustomerMessages.notification.errorActive.title,
        text: message ?? createCustomerMessages.notification.errorActive.text,
      });

      setInactiveConflict({ isActive: true, customer });
      break;

    default:
      notificationAlert.error({
        title: createCustomerMessages.notification.error.title,
        text: message ?? createCustomerMessages.notification.error.text,
      });
      break;
  }
};
