export const PERMISSIONS = {
  // customers keys
  CUSTOMERS_DELETE: "perm:customers:delete",
  CUSTOMERS_ADDRESSES_DELETE: "perm:customers:addresses:delete",
  CUSTOMERS_NOTES_DELETE: "perm:customers:notes:delete",

  // orders keys
  ORDERS_DELETE: "perm:orders:delete",
  ORDERS_PIECES_DELETE: "perm:orders:pieces:delete",
  ORDERS_PIECES_UPDATE: "perm:orders:pieces:update",
  ORDERS_UPDATE: "perm:orders:update",
  ORDERS_PRINT: "perm:orders:print",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
