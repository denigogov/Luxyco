import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import type {
  ApiErrorResponse,
  CreateCustomerFullForm,
  InactiveConflict,
} from "../../components/blocks/customers/AddCustomer/addCustomer.types";
import {
  useCreateCustomer,
  useDeleteCustomerPermanently,
  useRestoreInactiveCustomer,
} from "../../features/customers/customers.queries";
import { notificationAlert } from "./notify";
import {
  createCustomerMessages,
  inactiveConflictDataActive,
} from "../../components/blocks/customers/AddCustomer/addCustomer.data";
import { ensureJson } from "../helpers/ensureJson";
import {
  buildInactiveNoticeConfig,
  sendErrorMessage,
} from "../../components/blocks/customers/AddCustomer/addCustomer.helpers";
import type { InactiveCustomerNoticeTypes } from "../../whitelabel/src/molecules/InactiveCustomerNotice/InactiveCustomerNotice.types";
import { inactiveCustomerNoticeData } from "../../whitelabel/src/molecules/InactiveCustomerNotice/InactiveCustomerNotice.data";

export function useAddCustomerPage() {
  const [inactiveConflict, setInactiveConflict] =
    useState<InactiveConflict | null>(null);

  const navigate = useNavigate();
  const createMut = useCreateCustomer();
  const restoreCustomer = useRestoreInactiveCustomer();
  const deletePermanentlyCustomer = useDeleteCustomerPermanently();

  const modalCloseRef = useRef<null | (() => void)>(null);

  const closeModal = () => {
    modalCloseRef.current?.();
  };

  const restoreClientApi = async (id: number): Promise<void> => {
    try {
      await restoreCustomer.mutateAsync(id);

      notificationAlert.success({
        title: createCustomerMessages.restoreNotification.success.title,
        text: createCustomerMessages.restoreNotification.success.text,
      });

      setInactiveConflict(null);
      closeModal();
      navigate(`/customers/${id}`);
    } catch (error) {
      console.error(error);
      notificationAlert.error({
        title: createCustomerMessages.restoreNotification.error.title,
        text: createCustomerMessages.restoreNotification.error.text,
      });
    }
  };

  const getApiError = (err: any): ApiErrorResponse | null => {
    const raw = err?.response?.data ?? err?.body ?? err;
    return ensureJson<ApiErrorResponse>(raw);
  };

  const removePermanentCustomer = async (id: number): Promise<void> => {
    try {
      await deletePermanentlyCustomer.mutateAsync(id);

      notificationAlert.success({
        title: createCustomerMessages.permanentlyDelete.success.title,
        text: createCustomerMessages.permanentlyDelete.success.text,
      });

      setInactiveConflict(null);
      closeModal();
    } catch (error) {
      console.error(error);
      notificationAlert.error({
        title: createCustomerMessages.permanentlyDelete.error.title,
        text: createCustomerMessages.permanentlyDelete.error.text,
      });
    }
  };

  const attachModalOnClose = (modals: any[] | undefined) =>
    (modals ?? []).map((m) => ({
      ...m,
      onClose: (closeFn: () => void) => {
        modalCloseRef.current = closeFn;
      },
    }));

  const onSubmit = async (values: CreateCustomerFullForm) => {
    const addressPayload = {
      street: values.street,
      city: values.city,
      village: values.village || undefined,
      postalCode: values.postalCode,
      country: values.country,
      formattedAddress: `${values.street}, ${values.postalCode} ${values.city} - ${
        values.village ?? ""
      }`,
      latitude: "11.1111",
      longitude: "11.1111",
      isDefault: values.isDefault ?? true,
      isVerifiedByProvider: values.isVerifiedByProvider ?? false,
    };

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      address: values.street ? addressPayload : undefined,
      noteText: values.noteText?.trim() || undefined,
    };

    try {
      await createMut.mutateAsync(payload as any);
      notificationAlert.success({
        title: createCustomerMessages.notification.success.title,
        text: createCustomerMessages.notification.success.text,
      });
      setInactiveConflict(null);
    } catch (err) {
      const apiErr = getApiError(err);
      const code = apiErr?.error?.code;
      const customer = apiErr?.error?.customer;
      const message = apiErr?.error?.message;

      sendErrorMessage({ customer, code, setInactiveConflict, message });

      if (!customer) {
        setInactiveConflict(null);
      }
    }
  };

  // VIEW MODEL for "active" conflict (already active customer)
  const activeCustomerVisitDetails: InactiveCustomerNoticeTypes | null =
    inactiveConflict && inactiveConflict.isActive
      ? {
          ...inactiveConflictDataActive,
          actionButtons: inactiveConflictDataActive.actionButtons?.map(
            (btn) => {
              if (btn.role === "details") {
                return {
                  ...btn,
                  onClick: () => {
                    navigate(`/customers/${inactiveConflict.customer.id}`);
                  },
                };
              }
              if (btn.role === "cancel") {
                return {
                  ...btn,
                  onClick: () => setInactiveConflict(null),
                };
              }
              return btn;
            },
          ),
        }
      : null;

  // VIEW MODEL for "inactive" conflict (customer needs restore / delete)
  const noticeBase = inactiveCustomerNoticeData;

  const inactiveNoticeConfig =
    inactiveConflict && !inactiveConflict.isActive
      ? buildInactiveNoticeConfig({
          base: noticeBase,
          conflict: inactiveConflict,
          closeModal,
          restoreCustomer: restoreClientApi,
          deletePermanentlyCustomer: removePermanentCustomer,
          deleteIsPending: deletePermanentlyCustomer.isPending,
          restoreIsPending: restoreCustomer.isPending,
        })
      : null;

  const deactivateCustomerPermanentDelete: InactiveCustomerNoticeTypes =
    inactiveNoticeConfig
      ? {
          ...noticeBase,
          ...inactiveNoticeConfig,
          modals: attachModalOnClose(noticeBase.modals),
          actionButtons: noticeBase.actionButtons?.map((btn) =>
            btn.role === "cancel"
              ? {
                  ...btn,
                  onClick: () => {
                    setInactiveConflict(null);
                  },
                }
              : btn,
          ),
        }
      : noticeBase;

  return {
    createMut,
    inactiveConflict,
    setInactiveConflict,

    onSubmit,

    activeCustomerVisitDetails,
    deactivateCustomerPermanentDelete,
  };
}
