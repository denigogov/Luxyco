import type { OrdersListParams, YMDDateString } from "./orders.types";
const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

function toYMD(input?: string): YMDDateString | undefined {
  const v = input?.trim();
  if (!v) return undefined;
  return YMD_RE.test(v) ? (v as YMDDateString) : undefined;
}

export const normalizeOrdersListParams = (
  p: OrdersListParams,
): OrdersListParams => ({
  page: p.page ?? 1,
  limit: p.limit ?? 20,

  search: (p.search ?? "").trim() || undefined,

  phoneNumber: (p.phoneNumber ?? "").trim() || undefined,
  name: (p.name ?? "").trim() || undefined,

  qrCode: p.qrCode?.trim() || undefined,

  city: p.city?.trim() || undefined,
  village: p.village?.trim() || undefined,

  status: p.status?.trim() || undefined,
  deliveryType: p.deliveryType?.trim() || undefined,

  scheduledFrom: toYMD(p.scheduledFrom),
  scheduledTo: toYMD(p.scheduledTo),

  createdFrom: toYMD(p.createdFrom),
  createdTo: toYMD(p.createdTo),

  sortBy: p.sortBy || undefined,
  sortDir: p.sortDir || undefined,
});

// keys
export const ordersKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  list: (params: OrdersListParams) => [...ordersKeys.lists(), params] as const,
  references: () => [...ordersKeys.all, "references"],
  details: () => [...ordersKeys.all, "detail"] as const,
  detail: (identifier: number | string) =>
    [...ordersKeys.details(), String(identifier)] as const,

  mutations: {
    create: () => ["orders", "create"] as const,
    createPiece: (orderId: number) => ["orders", orderId, "update"] as const,
    update: (orderId: number) => ["orders", orderId, "update"] as const,
    updatePiece: (identifier: number | string, qr: string) =>
      ["orders", String(identifier), "item", qr, "update"] as const,
    deleteMany: () => ["orders", "bulk-delete"] as const,
    printMany: () => ["orders", "bulk-print"] as const,
  },
};
