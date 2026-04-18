import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./orderPrintTemplate.styles.scss";
import type { OrderPostResponse } from "../../../features/orders/orders.types";
import { brandConfig } from "../../../utils/brands";

interface PrintProps {
  order: OrderPostResponse | null;
}

const formatDate = (isoDate: string): string =>
  new Date(isoDate).toLocaleDateString("mk-MK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatDateTime = (isoDate: string): string =>
  new Date(isoDate).toLocaleString("mk-MK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const Divider = () => <div className="t-divider">{"- ".repeat(21)}</div>;

export const OrderPrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ order }, ref) => {
    if (!order) return null;

    const total = order.totalPieces;
    const brandName = brandConfig.name;
    const slogan = brandConfig.slogan;

    return (
      <div ref={ref} className="print-wrapper">
        <section className="t-ticket">
          <div className="t-header">
            <p className="t-header__company">{brandName}</p>
            <p className="t-header__tagline">{slogan}</p>
          </div>

          <Divider />

          <div className="t-qr">
            <QRCodeSVG
              value={order.qrCode}
              size={108}
              level="H"
              style={{ display: "block", margin: "0 auto" }}
            />
            <p className="t-qr__code">{order.qrCode}</p>
          </div>

          <Divider />

          <div className="t-section">
            <div className="t-row">
              <span className="t-row__label">Статус</span>
              <span className="t-row__value">{order.status.statusName}</span>
            </div>
            <div className="t-row">
              <span className="t-row__label">Закажано</span>
              <span className="t-row__value">
                {formatDate(order.scheduledDate)}
              </span>
            </div>
            {order.createdAt && (
              <div className="t-row">
                <span className="t-row__label">Креирано</span>
                <span className="t-row__value">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
            )}
          </div>

          <Divider />

          <div className="t-section">
            <div className="t-row">
              <span className="t-row__label">Клиент</span>
              <span className="t-row__value">
                {order.customers.firstName} {order.customers.lastName}
              </span>
            </div>
            <div className="t-row">
              <span className="t-row__label">Тел</span>
              <span className="t-row__value">
                {order.customers.phoneNumber}
              </span>
            </div>
          </div>

          <Divider />

          <div className="t-section">
            <div className="t-row">
              <span className="t-row__label">Услуга</span>
              <span className="t-row__value">
                {order.serviceType?.serviceName ?? "—"}
              </span>
            </div>
            <div className="t-row">
              <span className="t-row__label">Достава</span>
              <span className="t-row__value">
                {order.deliveryType.typeName}
              </span>
            </div>
            {order.customerAddresses && (
              <div className="t-row">
                <span className="t-row__label">Адреса</span>
                <span className="t-row__value">
                  {order.customerAddresses.formattedAddress}
                </span>
              </div>
            )}
          </div>

          <Divider />

          <div className="t-section">
            <p className="t-section__title">С Т А В К И</p>
            <table className="t-table">
              <thead>
                <tr>
                  <th className="t-table__th--num">#</th>
                  <th>Производ</th>
                  <th className="t-table__th--note">Забелешка</th>
                </tr>
              </thead>
              <tbody>
                {order.orderPieces.map((piece) => (
                  <tr key={piece.id}>
                    <td className="t-table__td--num">
                      {piece.pieceIndex}/{total}
                    </td>
                    <td>{piece.productTypes?.name ?? "—"}</td>
                    <td className="t-table__td--note">
                      {piece.pieceNote ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Divider />

          <div className="t-total">
            <span>Вкупно парчиња</span>
            <strong>{total}</strong>
          </div>

          {order.orderNote && (
            <>
              <Divider />
              <div className="t-note">
                <p className="t-section__title">ЗАБЕЛЕШКА</p>
                <p className="t-note__text">{order.orderNote}</p>
              </div>
            </>
          )}

          <Divider />

          <p className="t-footer">hvala · благодарам · thank you</p>
        </section>
      </div>
    );
  },
);

OrderPrintTemplate.displayName = "OrderPrintTemplate";
