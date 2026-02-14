// routes.brand.base.ts
export const BRAND_LUXYCO_ROUTE_CONFIG = {
  includeGroups: ["/", "dashboard", "orders", "customers", "settings"],
  includePaths: {
    "/": true,

    "/orders": {
      "/orders": true,
      "/orders/new": true,
      "/orders/:id": true,
      "/orders/:id/edit": true,
    },
    "/settings": {
      "/settings": true,
      "/settings/price": true,
      "/settings/status": true,
    },

    "/customers": {
      "/customers": true,
      "/customers/new": true,
      "/customers/:customerId": true,

      // addresses
      "/customers/:customerId/addresses/:addressId/edit": true,
      "/customers/:customerId/addresses/new": true,

      // notes
      "/customers/:customerId/notes/:noteId/edit": true,
      "/customers/:customerId/notes/add": true,
    },
    "/delivery": true,
    "/personal": true,
  },
};
