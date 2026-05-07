import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { detailsOrderData } from "./detailsOrder.data";
import Breadcrumbs from "../../../../whitelabel/src/molecules/Breadcrumbs/M-Breadcrumbs";
import OrderStepper from "../../../../whitelabel/src/organisms/orderStepper/OrderStepper";
import OrderItemsDetails from "../../../../whitelabel/src/organisms/orderItemsDetails/OrderItemsDetails";
import { useMemo, useRef, useState } from "react";
import { buildOrderBreadcrumbsProps } from "./detailsOrder.helpers";
import ConfirmDialog from "../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";
import type { ButtonTypes } from "../../../../whitelabel/src/atoms/button/a-button.types";
import { useOrderDetail } from "../../../../features/orders/orders.queries";
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

const DetailsOrder: React.FC = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const modalCloseRef = useRef<null | (() => void)>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const returnToPrevRoute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const from = (state as any)?.from;
    navigate(from ?? "/orders", { replace: true });
  };

  const closeModal = () => {
    modalCloseRef.current?.();
  };
  const mainTicketRef = useRef<HTMLDivElement>(null);
  const itemLabelsRef = useRef<HTMLDivElement>(null);
  const customerBillRef = useRef<HTMLDivElement>(null);

  const handlePrintMainTicket = useReactToPrint({
    contentRef: mainTicketRef,
  });

  const handlePrintItemLabels = useReactToPrint({
    contentRef: itemLabelsRef,
  });

  const handleDeleteOrder = async () => {
    if (!id) return;

    try {
      // await deleteOrder.mutateAsync(Number(id));
      closeModal();
      navigate("/orders", { replace: true });
    } catch (error) {
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

  const handleBreadCrumbNavigation = (name: string, orderData = {}) => {
    switch (name) {
      case "editOrder":
        navigate(`/orders/${id}/edit`, { state: orderData });
        return;

      case "addNote":
        navigate(`/orders/${id}/notes/add`);
        return;

      default:
        console.warn("Unknown dropdown role:", name);
        return;
    }
  };

  const handlePrintCustomerBill = useReactToPrint({
    contentRef: customerBillRef,
  });

  const breadcrumbsProps = useMemo(() => {
    return buildOrderBreadcrumbsProps({
      base: detailsOrderData.breadcrumps,
      returnToPrevRoute,
      order: {},
      onDropdownClick: handleBreadCrumbNavigation,
      modalChildren: (
        <ConfirmDialog
          {...detailsOrderData.confirmDeleteOrderDialog}
          buttons={buildConfirmButtons()}
        />
      ),
      setModalClose: (closeFn) => (modalCloseRef.current = closeFn),
      allowDeleteOrder: true,
    });
  }, [id]);

  const { data, isLoading, error } = useOrderDetail(Number(id));

  const status = data?.status;

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
        if (button.role === "delete") {
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

        if (button.role === "delete") {
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
      const priceModel = piece.productTypes?.priceModel?.name;
      const hasDimension = Boolean(piece.width && piece.height);
      const needsMeasurement = priceModel === "PER_M2" && !hasDimension;

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
      };
    });
  }, [data]);

  if (isLoading) {
    return <h1>Loading</h1>;
  }
  if (error) {
    return <h1>errortest</h1>;
  }
  const handleScan = (qrCode: string) => {
    navigate(`/orders/scan/${encodeURIComponent(qrCode)}`);
  };

  const createdDateFormatedString = `${timeFormat(data?.createdAt, { showTime: true })} / ${data?.users?.firstName}`;

  return (
    <div className="detailsOrder">
      <Breadcrumbs {...breadcrumbsProps} />
      <div className="order-card__row uk-padding-small uk-flex  uk-flex-right uk-visible@m">
        <span uk-icon="refresh"> </span>
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
        />
      )}
      {data?.orderNote && (
        <div className="detailsOrder__note">{data?.orderNote}</div>
      )}
      <OrderStepper currentStatusId={status?.id ?? 1} />

      <ButtonGroup {...buttonGroupProps} />

      <OrderItemsDetails
        items={tableRows}
        onDelete={() => console.log("test")}
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
