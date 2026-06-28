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
      "/orders/:id/piece-new": true,
      "/orders/:id/item/:qr": true,
    },
    "/settings": {
      "/settings": true,

      // price route
      "/settings/price": true,
      "/settings/price/new": true,
      "/settings/price/edit/:id": true,

      // delivery type
      "/settings/delivery": true,
      "/settings/delivery/new": true,
      "/settings/delivery/edit/:id": true,

      // user route
      "/settings/user": true,
      "/settings/user/add": true,
      "/settings/user/edit/:id": true,

      // fake status nothing just example
      "/settings/status": false,
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
