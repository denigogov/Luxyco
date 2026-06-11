import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { detailsOrderData, notificationMessages } from "./detailsOrder.data";
import Breadcrumbs from "../../../../whitelabel/src/molecules/Breadcrumbs/M-Breadcrumbs";
import OrderStepper from "../../../../whitelabel/src/organisms/orderStepper/OrderStepper";
import OrderItemsDetails from "../../../../whitelabel/src/organisms/orderItemsDetails/OrderItemsDetails";
import { useMemo, useRef, useState } from "react";
import { buildOrderBreadcrumbsProps } from "./detailsOrder.helpers";
import ConfirmDialog from "../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import {
  useDeleteOrderPieces,
  useDeletOrdersBulk,
  useOrderDetail,
  useUpdateOrder,
} from "../../../../features/orders/orders.queries";
import ButtonGroup from "../../../../whitelabel/src/molecules/buttonGroup/ButtonGroup";
import { OrderCard } from "../../../../whitelabel/src/organisms/orderCard/orderCard";
import { QrScanner } from "../../../../whitelabel/src/molecules/qrScanner/QrScanner";
import { timeFormat } from "../../../../utils/helpers/timeFormat";
import "./detailsOrder.styles.scss";

import { useReactToPrint } from "react-to-print";
import PrintActionGroup from "../../../../whitelabel/src/molecules/printActionGroup/PrintActionGroup";
import { OrderPrintTemplate } from "../../../organisms/orderPrintTemplates/OrderPrintTemplates";
import OrderItemsPrintTemplate from "../../../organisms/orderPrintTemplates/orderItemsPrint/OrderItemsPrintTemplate";
import OrderCustomerBillPrintTemplate from "../../../organisms/orderPrintTemplates/orderCustomerBillPrintTemplate/OrderCustomerBillPrintTemplate";
import Modal from "../../../../whitelabel/src/organisms/Modal/Modal";
import ASelect from "../../../../whitelabel/src/atoms/formComponents/select/A-select";
import { notificationAlert } from "../../../../utils/hooks/notify";
import ErrorWrapper from "../../ErrorWrapper";
import { PERMISSIONS } from "../../../../utils/brands/permisionKeys";
import useUserPermissions from "../../../../utils/hooks/useUserPermissions";
import { ORDER_STATUS } from "../../../../utils/helpers/hardcodedDataImportant";

const DetailsOrder: React.FC = () => {
  const { id } = useParams();
  const isQrCodeParam = !/^\d+$/.test(String(id));
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");

  const modalCloseRef = useRef<null | (() => void)>(null);
  const statusModalCloseRef = useRef<null | (() => void)>(null);
  const mainTicketRef = useRef<HTMLDivElement>(null);
  const itemLabelsRef = useRef<HTMLDivElement>(null);
  const customerBillRef = useRef<HTMLDivElement>(null);

  const { allowedPermitions } = useUserPermissions();
  const canUserDeleteOrder = allowedPermitions(PERMISSIONS.ORDERS_DELETE);
  const canUserDeleteOrderPieces = allowedPermitions(
    PERMISSIONS.ORDERS_PIECES_DELETE,
  );
  const canUserOrderUpdate = allowedPermitions(PERMISSIONS.ORDERS_UPDATE);
  const canUserOrderPiecesUpdate = allowedPermitions(
    PERMISSIONS.ORDERS_PIECES_UPDATE,
  );

  const deleteOrderPiecesMutation = useDeleteOrderPieces();
  const deleteOrderMutation = useDeletOrdersBulk();

  const returnToPrevRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const from = (state as any)?.from;
    navigate(from ?? "/orders", { replace: true });
  };

  const closeModal = () => {
    modalCloseRef.current?.();
  };

  const handlePrintMainTicket = useReactToPrint({
    contentRef: mainTicketRef,
  });

  const handlePrintItemLabels = useReactToPrint({
    contentRef: itemLabelsRef,
  });

  const handleDeleteOrder = async () => {
    if (!id || !canUserDeleteOrder) {
      if (!canUserDeleteOrder) {
        notificationAlert.error(notificationMessages.notAllowed);
      }
      closeModal();
      return;
    }

    try {
      await deleteOrderMutation.mutateAsync([Number(id)]);
      closeModal();
      navigate("/orders", { replace: true });
    } catch (error) {
      console.error(error);
      notificationAlert.error(notificationMessages.error);
    }
  };

  const handleDeleteOrderPiece = async (item: any) => {
    if (!id || !item?.qrCode || !canUserDeleteOrderPieces) {
      if (!canUserDeleteOrderPieces) {
        notificationAlert.error(notificationMessages.notAllowedPieces);
      }
      closeModal();
      return;
    }
    try {
      await deleteOrderPiecesMutation.mutateAsync({
        orderId: id,
        piecesId: item.qrCode,
      });

      notificationAlert.success(notificationMessages.success);
    } catch (error) {
      notificationAlert.error(notificationMessages.error);
      console.error(error);
    }
  };

  const buildConfirmButtons = (): ButtonTypes[] => [
    {
      label: "Откажи",
      style: "default",
      onClick: closeModal,
    },
    {
      label: "Избриши",
      style: "danger",
      onClick: handleDeleteOrder,
    },
  ];

  const handlePrintCustomerBill = useReactToPrint({
    contentRef: customerBillRef,
  });

  // enable to send or qr-code | the customer ID depend from where its scan
  const { data, isLoading, error, isPending, refetch } = useOrderDetail(
    isQrCodeParam ? id : Number(id),
  );
  const updateOrderMutattion = useUpdateOrder(data?.id);
  const status = data?.status;

  const handleBreadCrumbNavigation = (name: string, orderData = {}) => {
    switch (name) {
      case "editOrder":
        if (status.id === ORDER_STATUS.FINISHED || !canUserOrderUpdate) {
          notificationAlert.error(notificationMessages.notAllowedUpdate);
          return;
        }
        navigate(`/orders/${id}/edit`, { state: orderData });
        return;

      default:
        console.warn("Unknown dropdown role:", name);
        return;
    }
  };

  const breadcrumbsProps = useMemo(() => {
    return buildOrderBreadcrumbsProps({
      base: detailsOrderData.breadcrumps,
      returnToPrevRoute,
      order: data,
      onDropdownClick: handleBreadCrumbNavigation,
      modalChildren: (
        <ConfirmDialog
          {...detailsOrderData.confirmDeleteOrderDialog}
          buttons={buildConfirmButtons()}
        />
      ),
      setModalClose: (closeFn) => (modalCloseRef.current = closeFn),
      allowDeleteOrder:
        Boolean(
          status?.id !== ORDER_STATUS.PROCESSING ||
          status?.id === ORDER_STATUS.CANCELLED,
        ) && canUserDeleteOrder,
      notAllowedPemision: !canUserDeleteOrder && !canUserOrderUpdate,
    });
  }, [id, data]);

  const currentPrice = useMemo(() => {
    return Number(data?.totalPrice ?? 0);
  }, [data]);

  const isTotalFinal = useMemo(() => {
    return (data?.orderPieces ?? []).every((piece: any) => {
      const priceModel = piece.productTypes?.priceModel?.name;
      const hasDimension = Boolean(piece.width && piece.height);

      return priceModel === "PER_PIECE" || hasDimension;
    });
  }, [data]);

  const buttonGroupProps = useMemo(() => {
    const buttons = detailsOrderData.buttonGroup.buttons
      .filter((button) => {
        // hide customer bill button until all prices are final
        if (button.role === "bill") {
          return isTotalFinal;
        }

        return true;
      })
      .map((button) => {
        if (button.label === "Скенирај парче") {
          return {
            ...button,
            onClick: () => setIsQrScannerOpen(true),
          };
        }

        if (button.role === "print") {
          return {
            ...button,
            onClick: () => setIsPrintModalOpen(true),
          };
        }

        if (button.role === "bill") {
          return {
            ...button,
            onClick: () => handlePrintCustomerBill(),
          };
        }

        return button;
      });

    return {
      ...detailsOrderData.buttonGroup,
      buttons,
    };
  }, [isTotalFinal, handlePrintCustomerBill]);

  const tableRows = useMemo(() => {
    return (data?.orderPieces ?? []).map((piece: any) => {
      const customerData = piece?.orders?.customers;
      const status = data?.status?.id;

      const priceModel = piece.productTypes?.priceModel?.name;
      const hasDimension = Boolean(piece.width && piece.height);
      const needsMeasurement = priceModel === "PER_M2" && !hasDimension;
      const customer = `${customerData.firstName} ${customerData.lastName}`;

      const measuredBy = piece.users
        ? `${piece.users.firstName ?? ""} ${piece.users.lastName ?? ""}`.trim()
        : "";

      const isReady = !needsMeasurement;

      return {
        id: String(piece.id),
        qrCode: piece.labelCode,
        product: piece.productTypes?.name ?? "/",
        dimension: hasDimension
          ? `${piece.width} * ${piece.height} (${(
              Number(piece.width) * Number(piece.height)
            ).toFixed(2)} m²)`
          : "-",
        price: `${piece.price ?? 0}`,
        note: piece.pieceNote ?? "",
        measuredBy,
        index: `${piece.pieceIndex}/${data?.totalPieces ?? 0}`,
        isReady,
        needsMeasurement,
        customer,
        width: piece.width,
        height: piece.height,
        status,
      };
    });
  }, [data]);

  if (isLoading || isPending) {
    return <h1>Loading</h1>;
  }
  if (error) {
    return <ErrorWrapper />;
  }

  const handleScan = (qrCode: string) => {
    const isPieceQr = /-P\d+$/.test(qrCode);

    if (!isPieceQr) {
      navigate(`/orders/${encodeURIComponent(qrCode)}`, { replace: true });
      return;
    }

    navigate(`item/${encodeURIComponent(qrCode)}`);
  };
  const handleUpdateOrderStatus = () => {
    setSelectedStatusId(String(data?.status?.id ?? ""));
    setIsStatusModalOpen(true);
  };

  const handleConfirmUpdateOrderStatus = async () => {
    if (!data?.id || !selectedStatusId) return;
    try {
      await updateOrderMutattion.mutateAsync({
        orderStatusId: Number(selectedStatusId),
      });
      notificationAlert.success(detailsOrderData.notification.success);
      statusModalCloseRef.current?.();
      setIsStatusModalOpen(false);
    } catch (err) {
      notificationAlert.error(detailsOrderData.notification.error);
      console.error(err);
    }
  };

  const createdDateFormatedString = `${timeFormat(data?.createdAt, { showTime: true })} / ${data?.users?.firstName}`;

  return (
    <div className="detailsOrder">
      <Breadcrumbs {...breadcrumbsProps} />

      <div className="order-card__row uk-padding-small uk-flex  uk-flex-right uk-visible@m">
        <span uk-icon="history"> </span>
        <span className=" uk-text-small">
          Ажурирано: {timeFormat(data?.updatedAt, { showTime: true })}
        </span>
      </div>
      <div>
        <QrScanner
          isOpen={isQrScannerOpen}
          onClose={() => setIsQrScannerOpen(false)}
          onScan={handleScan}
          onError={(error) => console.error(error)}
        />
      </div>

      {data && (
        <OrderCard
          orderId={data.id}
          qrCode={data.qrCode}
          statusLabel={data.status?.statusName ?? "/"}
          customerName={`${data.customers?.firstName ?? ""} ${
            data.customers?.lastName ?? ""
          }`.trim()}
          phoneNumber={data.customers?.phoneNumber ?? "/"}
          address={data.customerAddresses?.formattedAddress ?? "/"}
          scheduledDate={timeFormat(data?.scheduledDate)}
          createdDate={createdDateFormatedString}
          updateDate={timeFormat(data?.updatedAt, { showTime: true })}
          deliveryLabel={data.deliveryType?.typeName ?? "/"}
          totalPrice={currentPrice}
          measuredPieces={data.measuredPieces ?? 0}
          totalPieces={data.totalPieces ?? 0}
          isTotalFinal={isTotalFinal}
          navigateToCustomer={() =>
            navigate(`/customers/${data?.customers?.id}`)
          }
          updateOrderStatus={handleUpdateOrderStatus}
          onRefetchData={() => refetch()}
        />
      )}
      {data?.orderNote && (
        <div className="detailsOrder__note">{data?.orderNote}</div>
      )}
      <OrderStepper currentStatusId={status?.id ?? ORDER_STATUS.PROCESSING} />
      <ButtonGroup {...buttonGroupProps} />
      <OrderItemsDetails
        items={tableRows}
        onDelete={handleDeleteOrderPiece}
        onMeasure={(pieces) =>
          canUserOrderPiecesUpdate &&
          navigate(`item/${pieces.qrCode}`, { state: pieces })
        }
        onEditPiece={(pieces) =>
          canUserOrderPiecesUpdate &&
          navigate(`item/${pieces.qrCode}`, { state: pieces })
        }
      />
      {isPrintModalOpen && data && (
        <div className="detailsOrder__printOverlay">
          <div className="detailsOrder__printModal">
            {detailsOrderData.printActionGroup && (
              <PrintActionGroup
                {...detailsOrderData.printActionGroup}
                closeButton={{
                  ...detailsOrderData.printActionGroup.closeButton!,
                  label: "Затвори",
                  onClick: () => setIsPrintModalOpen(false),
                }}
                buttons={detailsOrderData.printActionGroup.buttons?.map(
                  (btn) => ({
                    ...btn,
                    onClick: () => {
                      if (btn.role === "print") {
                        handlePrintMainTicket();
                      } else {
                        handlePrintItemLabels();
                      }

                      setIsPrintModalOpen(false);
                    },
                  }),
                )}
              />
            )}
          </div>
        </div>
      )}
      {isStatusModalOpen && (
        <Modal
          classes="detailsOrder__modal"
          options={{
            initialOpen: true,
          }}
          onClose={(close) => {
            statusModalCloseRef.current = close;
          }}
          onAfterClose={() => {
            setIsStatusModalOpen(false);
          }}
          actionButtons={[
            {
              label: "Откажи",
              type: "button",
              role: "cancel",
              style: "default",
              onClick: () => {
                statusModalCloseRef.current?.();
              },
            },
            {
              label: "Промени статус",
              type: "button",
              role: "submit",
              style: "tertiary",
              disabled:
                !selectedStatusId ||
                selectedStatusId === String(data?.status?.id),
              onClick: handleConfirmUpdateOrderStatus,
            },
          ]}
        >
          <div className="detailsOrder__statusModal">
            <h3>Промени статус</h3>
            <p>Изберете нов статус за оваа нарачка.</p>

            <ASelect
              {...detailsOrderData?.orderStatusSelect}
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(e.target.value)}
            />
          </div>
        </Modal>
      )}
      {data && (
        <>
          <div style={{ display: "none" }}>
            <OrderPrintTemplate ref={mainTicketRef} order={data} />
          </div>

          <div style={{ display: "none" }}>
            <OrderItemsPrintTemplate ref={itemLabelsRef} order={data} />
          </div>

          <div style={{ display: "none" }}>
            <OrderCustomerBillPrintTemplate
              ref={customerBillRef}
              order={data}
            />
          </div>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default DetailsOrder;
