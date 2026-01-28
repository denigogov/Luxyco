import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import {
  useCustomer,
  useDeleteCustomer,
} from "../../../../features/customers/customers.queries";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import { customerDetailsData } from "./customerDetails.data";
import { timeFormat } from "../../../../utils/helpers/timeFormat";
import { useMemo, useRef, useState } from "react";
import Tabs, {
  type TabsProps,
} from "../../../../whitelabel/src/organisms/Tabs/Tabs";
import "./customersDetails.styles.scss";
import Breadcrumbs from "../../../../whitelabel/src/molecules/Breadcrumbs/M-Breadcrumbs";
import { m_breadcrumbsData } from "../../../../whitelabel/src/molecules/Breadcrumbs/m-breadcrumbs.data";
import BoxStatistic from "../../../../whitelabel/src/organisms/BoxStatistic/O-BoxStatistic";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import BoxSection from "../../../../whitelabel/src/organisms/BoxSection/O-BoxSection";
import { o_boxStatisticData } from "../../../../whitelabel/src/organisms/BoxStatistic/o-boxStatistic.data";
import type { BoxSectionTypes } from "../../../../whitelabel/src/organisms/BoxSection/o-boxSection.types";
import { phoneNumberFormat } from "../../../../utils/helpers/phoneNumberFormat";
import ConfirmDialog from "../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import type {
  CustomerAddressTypes,
  CustomerNotes,
  CustomerOrderTypes,
} from "./customerDetails.types";

import {
  mapOrdersToRows,
  buildNotesBoxSectionData,
  buildAddressesBoxSectionData,
  buildCustomerStatistic,
  buildBreadcrumbsProps,
} from "./customerDetails.helpers";

import { useDeleteCustomerAddress } from "../../../../features/customers/customersAddresses.queries";
import { notificationAlert } from "../../../../utils/hooks/notify";
import { customersDetailsMessages } from "./CustomerDetails.messages";
import { useDeleteCustomerNotes } from "../../../../features/customers/customerNotes.queries";

type deleteType = "address" | "note" | "customer";

const CustomerDetails: React.FC = () => {
  const [isMobile] = useState(window.innerWidth < 960);
  const { customerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const deleteMututation = useDeleteCustomer();
  const deleteAddress = useDeleteCustomerAddress();
  const deleteNote = useDeleteCustomerNotes();

  const modalCloseRef = useRef<null | (() => void)>(null);

  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const from = (state as any)?.from;
    navigate(from ?? "/customers", { replace: true });
  };

  const customerFromState = (state as any)?.customer;

  const cid = Number(customerFromState?.id ?? customerId ?? 0);

  const { data, isLoading, error } = useCustomer(cid);

  const customerOrders: CustomerOrderTypes[] = data?.orders ?? [];
  const customerAddresses: CustomerAddressTypes[] =
    data?.customerAddresses ?? [];
  const customerNotes: CustomerNotes[] = data?.customerNote ?? [];

  const closeModal = () => {
    modalCloseRef.current?.();
  };

  const handleSingleDelete = async (type: deleteType, id?: string) => {
    switch (type) {
      case "address":
        if (!customerId || !id) return;

        try {
          await deleteAddress.mutateAsync({
            customerId: Number(customerId),
            addressId: Number(id),
          });
          notificationAlert.success(
            customersDetailsMessages.deleteAddress.success,
          );
          closeModal();
        } catch (error) {
          notificationAlert.error(customersDetailsMessages.deleteAddress.error);
          console.error(error);
        }

        break;

      case "customer":
        {
          try {
            await deleteMututation.mutateAsync(Number(id));
            navigate("../");
            notificationAlert.success(
              customersDetailsMessages.deleteCustomer.success,
            );
          } catch (err) {
            notificationAlert.error(
              customersDetailsMessages.deleteCustomer.error,
            );
          }
        }
        break;

      case "note":
        if (!customerId || !id) return;
        try {
          await deleteNote.mutateAsync({
            noteId: Number(id),
            customerId: Number(customerId),
          });
          notificationAlert.success(
            customersDetailsMessages.deleteNote.success,
          );
          closeModal();
        } catch (error) {
          notificationAlert.error(customersDetailsMessages.deleteNote.error);
          console.error(error);
        }
        break;

      default:
        break;
    }
    // closeModal();
  };

  const buildConfirmButtons = (
    type: deleteType,
    id?: string,
  ): ButtonTypes[] => [
    {
      label: "Откажи",
      style: "default",
      onClick: closeModal,
    },
    {
      label: "Избриши",
      style: "danger",
      onClick: () => handleSingleDelete(type, id),
    },
  ];

  // Orders rows
  const rows = useMemo(() => {
    return mapOrdersToRows(customerOrders, timeFormat);
  }, [customerOrders]);

  // Notes section
  const notesBoxSectionData = useMemo<BoxSectionTypes>(() => {
    const cid = String(customerId ?? "");
    return buildNotesBoxSectionData({
      notes: customerNotes,
      timeFormat,
      onEditNote: (noteId, noteObj) =>
        navigate(`/customers/${cid}/notes/${noteId}/edit`, { state: noteObj }),
      buildDeleteModals: (noteId) => {
        const noteID = String(noteId);
        const modals: ModalTypes[] = [
          {
            openButton: { label: "избриши", style: "link" },
            children: (
              <ConfirmDialog
                {...customerDetailsData.confirmDeleteNoteDialog}
                buttons={buildConfirmButtons("note", noteID)}
              />
            ),
            onClose: (close) => (modalCloseRef.current = close),
          },
        ];
        return modals;
      },
    });
  }, [customerNotes, customerId, navigate]);

  // Addresses section
  const addressesBoxSectionData = useMemo<BoxSectionTypes>(() => {
    const cid = String(customerId ?? "");
    return buildAddressesBoxSectionData({
      addresses: customerAddresses,
      customerId: cid,
      onEditAddress: (address) =>
        navigate(`/customers/${cid}/addresses/${address.id}/edit`, {
          state: address,
        }),
      buildDeleteModals: (address) => {
        const addressId = String(address?.id ?? "");
        const modals: ModalTypes[] = [
          {
            openButton: { label: "избриши", style: "link" },
            children: (
              <ConfirmDialog
                {...customerDetailsData.confirmDeleteAddressDialog}
                buttons={buildConfirmButtons("address", addressId)}
              />
            ),
            onClose: (close) => (modalCloseRef.current = close),
          },
        ];
        return modals;
      },
    });
  }, [customerAddresses, customerId, navigate]);

  // header dropdown options buttons
  const handleDropdownClick = (name: string, stateData = {}) => {
    const cid = String(customerId ?? "");

    switch (name) {
      case "editCustomer":
        navigate(`/customers/${cid}/edit`);
        return;

      case "newAddress":
        navigate(`/customers/${cid}/addresses/new`, { state: stateData });
        return;

      case "newNote":
        navigate(`/customers/${cid}/notes/add`);
        return;

      case "deactivateCustomer":
        alert(`delete user ${data?.firstName ?? ""}`);
        return;

      default:
        console.warn("Unknown dropdown role:", name);
        return;
    }
  };

  // Breadcrumbs props (buttons + modal)
  const breadcrumbsProps = useMemo(() => {
    return buildBreadcrumbsProps({
      base: m_breadcrumbsData,
      onBack,
      data,
      onDropdownClick: handleDropdownClick,
      modalChildren: (
        <ConfirmDialog
          {...customerDetailsData.confirmDeleteCustomerDialog}
          buttons={buildConfirmButtons("customer", String(customerId ?? ""))}
        />
      ),
      setModalClose: (closeFn) => (modalCloseRef.current = closeFn),
    });
  }, [onBack, data, customerId]);

  // Statistic
  const customerStatistic = useMemo(() => {
    return buildCustomerStatistic({
      templateItems: o_boxStatisticData.item,
      stats: data?.stats,
      timeFormat,
    });
  }, [data?.stats]);

  const handleCall = async () => {
    const tel = `tel:${data?.phoneNumber.replace(/\s+/g, "")}`;
    window.location.href = tel;
  };

  const defaultAddress = data?.customerAddresses?.find((a) => a.isDefault);

  const tabsData: TabsProps = useMemo(
    () => ({
      tabData: {
        tabID: "Orders",
        items: [
          {
            tabName: "Нарачки",
            active: true,
            component: (
              <Table {...customerDetailsData.orderTable} rows={rows} />
            ),
          },
          {
            tabName: "Адреси",
            component: <BoxSection {...addressesBoxSectionData} />,
          },
          {
            tabName: "Забелешки",
            component: <BoxSection {...notesBoxSectionData} />,
          },
        ],
      },
    }),
    [rows, addressesBoxSectionData, notesBoxSectionData],
  );

  if (isLoading) return <h3>Loading</h3>;
  if (error) return <h3>error</h3>;

  return (
    <div className="b-customerDetails">
      <Breadcrumbs {...breadcrumbsProps} />

      <div className="uk-card-default uk-padding-small">
        <div className="uk-flex uk-flex-middle uk-flex-between">
          {/* Left side */}
          <div className="b-customerDetails__name">
            <div className="uk-text-large uk-text-bold uk-margin-remove">
              {`${data?.firstName ?? ""} ${data?.lastName ?? ""}`}
            </div>

            <div className="uk-margin-remove">
              {phoneNumberFormat(data?.phoneNumber ?? "")}
            </div>

            <div className="uk-margin-small-top">
              {defaultAddress?.formattedAddress
                ? " Ул. " + defaultAddress?.formattedAddress
                : "Без Адреса"}{" "}
              <br />
            </div>

            <div className="uk-margin-small-top uk-text-muted">
              Клиент од: {timeFormat(data?.createdAt ?? "")}
            </div>
          </div>

          {/* Right side */}
          <div
            className="uk-flex uk-flex-middle uk-grid-small uk-flex-right"
            uk-grid="true"
          >
            {isMobile && (
              <Button
                {...customerDetailsData?.customerHeader?.callButton}
                onClick={handleCall}
              />
            )}

            <Button
              {...customerDetailsData?.customerHeader?.newOrderBtn}
              label={isMobile ? "нарачка" : "Додади нарачка"}
              onClick={() => navigate(`/orders/new?customerId=${customerId}`)}
            />
          </div>
        </div>
      </div>

      <BoxStatistic {...customerStatistic} />
      <Tabs {...tabsData} />
      <Outlet />
    </div>
  );
};

export default CustomerDetails;
