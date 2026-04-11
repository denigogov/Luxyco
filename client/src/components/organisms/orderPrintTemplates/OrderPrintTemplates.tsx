import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./orderPrintTemplate.styles.scss";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderPiece {
  id: number;
  pieceIndex: number;
  labelCode: string;
  width: number | null;
  height: number | null;
  price: number;
  pieceNote: string | null;
  productTypes: {
    id: number;
    name: string;
    basePrice: number;
  };
}

interface OrderData {
  id: number;
  qrCode: string;
  scheduledDate: string;
  createdAt?: string;
  totalPieces: number;
  totalPrice: number;
  orderNote: string | null;
  customers: {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  customerAddresses: {
    formattedAddress: string;
  } | null;
  deliveryType: {
    id: number;
    typeName: string;
    price: number;
  };
  serviceType: {
    id: number;
    serviceName?: string;
  };
  status: {
    id: number;
    statusName: string;
  };
  orderPieces: OrderPiece[];
}

interface PrintProps {
  order: OrderData | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

export const OrderPrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ order }, ref) => {
    if (!order) return null;

    const total = order.totalPieces;

    return (
      <div ref={ref} className="print-wrapper">
        {/* ══════════════════════════════
            MAIN TICKET
        ══════════════════════════════ */}
        <section className="t-ticket">
          {/* Header */}
          <div className="t-header">
            <p className="t-header__company">L U X Y C O</p>
            <p className="t-header__tagline">перачница на килими</p>
          </div>

          <Divider />

          {/* QR */}
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

          {/* Order meta */}
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

          {/* Customer */}
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

          {/* Delivery */}
          <div className="t-section">
            <div className="t-row">
              <span className="t-row__label">Услуга</span>
              <span className="t-row__value">
                {order.serviceType?.serviceName ?? ""}
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

          {/* Pieces table — each piece as own row with counter + note */}
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

          {/* Total */}
          <div className="t-total">
            <span>Вкупно парчиња</span>
            <strong>{total}</strong>
          </div>

          {/* Order note */}
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

          <div className="page-break" />
        </section>

        {/* ══════════════════════════════
            PIECE LABELS — one per piece
        ══════════════════════════════ */}
        {order.orderPieces.map((piece) => (
          <section key={piece.id} className="t-label">
            <div className="t-label__top">
              <span className="t-label__company">LUXYCO</span>
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
  },
);

OrderPrintTemplate.displayName = "OrderPrintTemplate";
