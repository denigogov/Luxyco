import { normalizeOrdersListParams } from "../../../../features/orders/orders.keys";
import type {
  OrderListItem,
  OrdersListParams,
  OrdersSortBy,
  OrdersSortDir,
} from "../../../../features/orders/orders.types";
import { phoneNumberFormat } from "../../../../utils/helpers/phoneNumberFormat";
import { timeFormat } from "../../../../utils/helpers/timeFormat";
import type {
  RowMarker,
  RowTypes,
} from "../../../../whitelabel/src/molecules/table/m-table.types";
import type { TableFilterTypes } from "../../../../whitelabel/src/molecules/tableFilter/m-tableFitler.types";
import { filterData } from "./AllOrders.data";

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
    createdAt: timeFormat(o.createdAt, { showTime: true }),
    status: o.status?.statusName ?? "-",
    messurmentProgress:
      o.measurementStatus?.progress ?? `${o.measuredPieces}/${o.totalPieces}`,
    firstName:
      `${o.customers?.firstName ?? ""} ${o.customers?.lastName ?? ""}`.trim() ||
      "-",
    phoneNumber: phoneNumberFormat(o.customers?.phoneNumber ?? "-"),
    deliveryType: o.deliveryType?.typeName ?? "-",
    scheduledDate: timeFormat(o.scheduledDate),
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

export const buildOrdersFilterData = (params: {
  deliveryTypes?: { id: number; typeName: string }[];
}): TableFilterTypes => ({
  ...filterData,
  filters: [
    ...filterData.filters,
    {
      keyName: "deliveryType",
      label: "Тип на Испорака",
      name: "deliveryType",
      type: "select",
      options: [
        { label: "сите", value: "" },
        ...(params.deliveryTypes ?? []).map((d) => ({
          label: d.typeName,
          value: String(d.id),
        })),
      ],
    },
  ],
});

export function canDeleteSelectedOrders(
  selectedOrders: number[],
  tableListData: any[],
): boolean {
  if (selectedOrders.length === 0) return false;

  const selectedOrdersData = tableListData.filter((order) =>
    selectedOrders.includes(order.id),
  );

  const hasRestrictedStatus = selectedOrdersData.some(
    (order) => order.status.id === 1 || order.status.id === 6,
  );

  return hasRestrictedStatus;
}
