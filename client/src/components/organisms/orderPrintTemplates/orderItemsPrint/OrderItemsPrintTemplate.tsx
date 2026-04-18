import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

import "./orderItemPrintTemplate.styles.scss";
import { brandConfig } from "../../../../utils/brands";
import type { OrderPostResponse } from "../../../../features/orders/orders.types";

interface OrderItemsPrintTemplateProps {
  order: OrderPostResponse | null;
}

const OrderItemsPrintTemplate = forwardRef<
  HTMLDivElement,
  OrderItemsPrintTemplateProps
>(({ order }, ref) => {
  if (!order) return null;

  const total = order.totalPieces;
  const brandName = brandConfig.name;

  return (
    <div ref={ref} className="print-wrapper">
      {order.orderPieces.map((piece) => (
        <section key={piece.id} className="t-label">
          <div className="t-label__top">
            <span className="t-label__company">{brandName}</span>
            <span className="t-label__counter">
              {piece.pieceIndex}/{total}
            </span>
          </div>

          <div className="t-label__body">
            <div className="t-label__qr">
              <QRCodeSVG
                value={piece.labelCode}
                size={70}
                level="M"
                style={{ display: "block" }}
              />
            </div>
            <div className="t-label__info">
              <p className="t-label__customer">
                {order.customers.firstName} {order.customers.lastName}
              </p>
              <p className="t-label__phone">{order.customers.phoneNumber}</p>
              <p className="t-label__product">{piece.productTypes?.name}</p>
              <p className="t-label__code">{piece.labelCode}</p>
              {piece.pieceNote && (
                <p className="t-label__note">★ {piece.pieceNote}</p>
              )}
            </div>
          </div>

          <div className="page-break" />
        </section>
      ))}
    </div>
  );
});

OrderItemsPrintTemplate.displayName = "OrderItemsPrintTemplate";

export default OrderItemsPrintTemplate;
