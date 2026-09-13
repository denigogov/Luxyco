import type {
  NormalizedOrdersListParams,
  OrdersListParams,
  YMDDateString,
} from "./orders.types";
const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

function toYMD(input?: string): YMDDateString | undefined {
  const v = input?.trim();
  if (!v) return undefined;
  return YMD_RE.test(v) ? (v as YMDDateString) : undefined;
}

export const normalizeOrdersListParams = (
  p: OrdersListParams,
): NormalizedOrdersListParams => ({
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

export const ordersKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  list: (params: NormalizedOrdersListParams) =>
    [...ordersKeys.lists(), params] as const,
  references: () => [...ordersKeys.all, "references"] as const,
  details: () => [...ordersKeys.all, "detail"] as const,
  historys: () => [...ordersKeys.all, "historys"] as const,
  detail: (identifier: number | string) =>
    [...ordersKeys.details(), String(identifier).trim()] as const,
  history: (identifier: number | string) =>
    [...ordersKeys.historys(), String(identifier).trim()] as const,

  mutations: {
    all: () => [...ordersKeys.all, "mutation"] as const,
    create: () => [...ordersKeys.mutations.all(), "create"] as const,
    update: (orderId: number) =>
      [...ordersKeys.mutations.all(), "update", orderId] as const,
    pieces: () => [...ordersKeys.mutations.all(), "piece"] as const,
    createPiece: (orderId: number) =>
      [...ordersKeys.mutations.pieces(), "create", orderId] as const,
    updatePiece: (identifier: number | string, qr: string) =>
      [
        ...ordersKeys.mutations.pieces(),
        "update",
        String(identifier).trim(),
        qr.trim(),
      ] as const,
    deletePieces: () => [...ordersKeys.mutations.pieces(), "delete"] as const,
    deleteMany: () => [...ordersKeys.mutations.all(), "bulk-delete"] as const,
    printMany: () => [...ordersKeys.mutations.all(), "bulk-print"] as const,
  },
};
