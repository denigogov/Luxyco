import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { brandConfig } from "../../../../utils/brands";
import type { OrderPostResponse } from "../../../../features/orders/orders.types";
import "./orderCustomerBillPrintTemplate.styles.scss";

interface OrderCustomerBillPrintTemplateProps {
  order: OrderPostResponse | null;
}

const formatDate = (isoDate?: string): string => {
  if (!isoDate) return "—";

  return new Date(isoDate).toLocaleDateString("mk-MK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (isoDate?: string): string => {
  if (!isoDate) return "—";

  return new Date(isoDate).toLocaleString("mk-MK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (value?: string | number): string => {
  const amount = Number(value ?? 0);
  return `${amount.toFixed(2)} ден.`;
};

const Divider = () => <div className="c-bill-divider">{"- ".repeat(21)}</div>;

const OrderCustomerBillPrintTemplate = forwardRef<
  HTMLDivElement,
  OrderCustomerBillPrintTemplateProps
>(({ order }, ref) => {
  if (!order) return null;

  const brandName = brandConfig.name;
  const slogan = brandConfig.slogan;

  const piecesTotal = order.orderPieces.reduce((sum, piece) => {
    return sum + Number(piece.price ?? 0);
  }, 0);

  const deliveryPrice = Number(order.deliveryType?.price ?? 0);

  const finalTotal = Number(order.totalPrice ?? piecesTotal + deliveryPrice);

  return (
    <div ref={ref} className="print-wrapper">
      <section className="c-bill">
        <header className="c-bill-header">
          <p className="c-bill-header__company">{brandName}</p>
          {slogan && <p className="c-bill-header__tagline">{slogan}</p>}
          <p className="c-bill-header__title">СМЕТКА / ПОТВРДА ЗА НАРАЧКА</p>
        </header>

        <Divider />

        <section className="c-bill-section">
          <div className="c-bill-row">
            <span className="c-bill-row__label">Клиент</span>
            <span className="c-bill-row__value">
              {order.customers?.firstName} {order.customers?.lastName}
            </span>
          </div>

          <div className="c-bill-row">
            <span className="c-bill-row__label">Телефон</span>
            <span className="c-bill-row__value">
              {order.customers?.phoneNumber ?? "—"}
            </span>
          </div>

          {order.customerAddresses && (
            <div className="c-bill-row">
              <span className="c-bill-row__label">Адреса</span>
              <span className="c-bill-row__value">
                {order.customerAddresses.formattedAddress}
              </span>
            </div>
          )}
        </section>

        <Divider />

        <section className="c-bill-section">
          <div className="c-bill-row">
            <span className="c-bill-row__label">Нарачка</span>
            <span className="c-bill-row__value">#{order.id}</span>
          </div>

          <div className="c-bill-row">
            <span className="c-bill-row__label">Код</span>
            <span className="c-bill-row__value c-bill-row__value--code">
              {order.qrCode}
            </span>
          </div>

          <div className="c-bill-row">
            <span className="c-bill-row__label">Закажано</span>
            <span className="c-bill-row__value">
              {formatDate(order.scheduledDate)}
            </span>
          </div>

          <div className="c-bill-row">
            <span className="c-bill-row__label">Креирано</span>
            <span className="c-bill-row__value">
              {formatDateTime(order.createdAt)}
            </span>
          </div>
        </section>

        <Divider />

        <section className="c-bill-section">
          <p className="c-bill-section__title">ПРОИЗВОДИ</p>

          <table className="c-bill-table">
            <thead>
              <tr>
                <th>Производ</th>
                <th>Димензија</th>
                <th className="c-bill-table__price">Цена</th>
              </tr>
            </thead>

            <tbody>
              {order.orderPieces.map((piece) => {
                const width = Number(piece.width ?? 0);
                const height = Number(piece.height ?? 0);
                const hasDimension = width > 0 && height > 0;

                return (
                  <tr key={piece.id}>
                    <td>{piece.productTypes?.name ?? "—"}</td>

                    <td>
                      {hasDimension
                        ? `${piece.width} x ${piece.height} m`
                        : "—"}
                    </td>

                    <td className="c-bill-table__price">
                      {formatMoney(piece.price)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <Divider />

        <section className="c-bill-summary">
          <div className="c-bill-summary__row">
            <span>Парчиња</span>
            <strong>{formatMoney(piecesTotal)}</strong>
          </div>

          <div className="c-bill-summary__row">
            <span>Достава ({order.deliveryType?.typeName ?? "—"})</span>
            <strong>{formatMoney(deliveryPrice)}</strong>
          </div>

          <div className="c-bill-summary__row c-bill-summary__row--total">
            <span>ВКУПНО</span>
            <strong>{formatMoney(finalTotal)}</strong>
          </div>
        </section>

        <Divider />

        <section className="c-bill-qr">
          <QRCodeSVG
            value={order.qrCode}
            size={92}
            level="H"
            style={{ display: "block", margin: "0 auto" }}
          />
          <p className="c-bill-qr__code">{order.qrCode}</p>
        </section>

        <p className="c-bill-footer">Ви благодариме на довербата</p>
      </section>
    </div>
  );
});

OrderCustomerBillPrintTemplate.displayName = "OrderCustomerBillPrintTemplate";

export default OrderCustomerBillPrintTemplate;
