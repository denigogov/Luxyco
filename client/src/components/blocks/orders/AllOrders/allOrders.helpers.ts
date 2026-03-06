import { normalizeOrdersListParams } from "../../../../features/orders/orders.keys";
import type {
  OrderListItem,
  OrdersListParams,
  OrdersSortBy,
  OrdersSortDir,
} from "../../../../features/orders/orders.types";
import type { RowTypes } from "../../../../whitelabel/src/molecules/table/m-table.types";

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
