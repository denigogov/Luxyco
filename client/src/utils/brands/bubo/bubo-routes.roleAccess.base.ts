import { PERMISSIONS } from "../permisionKeys";

// routes.roleAccess.base.ts
export type BrandUserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "RECEPTION"
  | "MACHINE_OPERATOR"
  | "DRIVER";

type BrandRouteAccess = Partial<Record<BrandUserRole, string[]>>;

const baseRouteAccess: BrandRouteAccess = {
  SUPER_ADMIN: ["*"],

  ADMIN: [
    "/",
    "/dashboard",
    "/orders",
    "/orders/new",
    "/orders/:id",
    "/orders/:id/edit",
    "/customers",
    "/customers/new",
    "/customers/:customerId",
    "/customers/:customerId/addresses/new",
    "/customers/:customerId/addresses/:addressId/edit",
    "/customers/:customerId/notes/add",
    "/customers/:customerId/notes/:noteId/edit",
    "/settings",
    "/settings/price",
  ],

  MANAGER: [
    "/",
    "/dashboard",
    "/orders",
    "/orders/new",
    "/orders/:id",
    "/orders/:id/edit",
    "/customers",
    "/customers/new",
    "/customers/:customerId",
    "/customers/:customerId/addresses/new",
    "/customers/:customerId/addresses/:addressId/edit",
    "/customers/:customerId/notes/add",
    "/customers/:customerId/notes/:noteId/edit",
    "/settings",
    "/settings/price",
  ],

  DRIVER: [
    "/",
    "/dashboard",
    "/orders",
    "/orders/:id",
    "/customers",
    "/customers/:customerId",
  ],

  RECEPTION: [
    "/",
    "/dashboard",
    "/orders",
    "/orders/new",
    "/orders/:id",
    "/orders/:id/edit",
    "/customers",
    "/customers/new",
    "/customers/:customerId",
    "/customers/:customerId/addresses/new",
    "/customers/:customerId/addresses/:addressId/edit",
    "/customers/:customerId/notes/add",
    "/customers/:customerId/notes/:noteId/edit",
  ],
  MACHINE_OPERATOR: [],
};

//  Feature / permission tokens per role
// (no real URLs here, only PERMISSIONS)
const permissionAccess: BrandRouteAccess = {
  SUPER_ADMIN: [
    PERMISSIONS.CUSTOMERS_DELETE,
    PERMISSIONS.CUSTOMERS_ADDRESSES_DELETE,
    PERMISSIONS.ORDERS_DELETE,
    PERMISSIONS.ORDERS_PRINT,
  ],
  MANAGER: [PERMISSIONS.CUSTOMERS_DELETE],
  ADMIN: [PERMISSIONS.ORDERS_PRINT],

  // DEMO ACCOUNT
  RECEPTION: [
    PERMISSIONS.CUSTOMERS_DELETE,
    PERMISSIONS.CUSTOMERS_ADDRESSES_DELETE,
    PERMISSIONS.ORDERS_DELETE,
    PERMISSIONS.ORDERS_PRINT,
    PERMISSIONS.CUSTOMERS_NOTES_DELETE,

    // orders keys
    PERMISSIONS.ORDERS_DELETE,
    PERMISSIONS.ORDERS_PIECES_DELETE,
    PERMISSIONS.ORDERS_PIECES_UPDATE,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_PRINT,
  ],
};

export const BRAND_BUBO_ROLE_ROUTE_CONFIG: BrandRouteAccess = {
  SUPER_ADMIN: [
    ...(baseRouteAccess.SUPER_ADMIN ?? []),
    ...(permissionAccess.SUPER_ADMIN ?? []),
  ],
  ADMIN: [...(baseRouteAccess.ADMIN ?? []), ...(permissionAccess.ADMIN ?? [])],
  MANAGER: [
    ...(baseRouteAccess.MANAGER ?? []),
    ...(permissionAccess.MANAGER ?? []),
  ],
  DRIVER: [
    ...(baseRouteAccess.DRIVER ?? []),
    ...(permissionAccess.DRIVER ?? []),
  ],
  RECEPTION: [
    ...(baseRouteAccess.RECEPTION ?? []),
    ...(permissionAccess.RECEPTION ?? []),
  ],
  MACHINE_OPERATOR: [
    ...(baseRouteAccess.MACHINE_OPERATOR ?? []),
    ...(permissionAccess.MACHINE_OPERATOR ?? []),
  ],
};
