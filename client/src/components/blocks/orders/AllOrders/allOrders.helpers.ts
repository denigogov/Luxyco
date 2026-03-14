import { normalizeOrdersListParams } from "../../../../features/orders/orders.keys";
import type {
  OrderListItem,
  OrdersListParams,
  OrdersSortBy,
  OrdersSortDir,
} from "../../../../features/orders/orders.types";
import type {
  RowMarker,
  RowTypes,
} from "../../../../whitelabel/src/molecules/table/m-table.types";

export function getOrderRowMarker(id?: number): RowMarker | undefined {
  switch (id) {
    case 1: // PENDING
      return {
        variant: "muted",
        message: "Се чека обработка",
        onlySideMarker: true,
      };

    case 2: // MEASURING
      return {
        variant: "info",
        message: "Се мери",
        onlySideMarker: true,
      };

    case 3: // READY_FOR_DELIVERY
      return {
        variant: "success",
        message: "Подготвена за достава",
        onlySideMarker: true,
      };

    case 4: // OUT_FOR_DELIVERY
      return {
        variant: "info",
        message: "Во достава",
        onlySideMarker: true,
      };

    case 5: // DONE
      return {
        variant: "success",
        message: "Завршена",
        onlySideMarker: true,
      };

    case 6: // CANCELED
      return {
        variant: "danger",
        message: "Откажана",
        onlySideMarker: false,
      };
    default:
      return undefined;
  }
}

// table order from the data map to keys
export function mapOrderToRow(o: OrderListItem): RowTypes {
  return {
    id: String(o.id),
    status: o.status?.statusName ?? "-",
    messurmentProgress:
      o.measurementStatus?.progress ?? `${o.measuredPieces}/${o.totalPieces}`,
    firstName:
      `${o.customers?.firstName ?? ""} ${o.customers?.lastName ?? ""}`.trim() ||
      "-",
    phoneNumber: o.customers?.phoneNumber ?? "-",
    deliveryType: o.deliveryType?.typeName ?? "-",
    scheduledDate: o.scheduledDate,
    qrCode: o.qrCode,
    rowMarker: getOrderRowMarker(o.status?.id),
  };
}

// type-guard
export function toOrdersSortBy(v: unknown): OrdersSortBy | undefined {
  return v === "createdAt" || v === "scheduledDate" ? v : undefined;
}
//type-guard
export function toOrdersSortDir(v: unknown): OrdersSortDir | undefined {
  return v === "asc" || v === "desc" ? v : undefined;
}

export function buildAllOrdersParams(
  p: Partial<OrdersListParams> = {},
): OrdersListParams {
  return normalizeOrdersListParams(p);
}
