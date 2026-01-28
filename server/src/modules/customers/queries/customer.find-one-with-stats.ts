// src/modules/customers/queries/customer.find-one-with-stats.ts
import { NotFoundException } from '@nestjs/common';
import { custom } from 'joi';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

type AddressSelect = {
  id: true;
  street: true;
  city: true;
  village: true;
  postal_code: true;
  country: true;
  formatted_address: true;
  is_default: true;
  is_active: true;
  latitude: true;
  longitude: true;
};

export async function getCustomerWithStats(
  prisma: PrismaService,
  id: number,
  customerAddressSelect: AddressSelect,
  isActive: boolean,
) {
  const customer = await prisma.customers.findUnique({
    where: { id },
    include: {
      customer_addresses: {
        select: customerAddressSelect,
        where: { is_active: isActive },
      },

      orders: {
        include: {
          delivery_type: {
            select: {
              type_name: true,
            },
          },
          status: {
            select: {
              status_name: true,
            },
          },
          users: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
          order_pieces: {
            select: {
              width: true,
              height: true,
              price: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      },
      customer_notes: {
        where: { is_active: true, related_order_id: null },
        select: {
          id: true,
          note_text: true,
          created_at: true,
          updated_at: true,
          users: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      },
    },
  });

  if (!customer) {
    throw new NotFoundException(`Customer with id ${id} not found`);
  }

  if (isActive && !customer.is_active) {
    throw new NotFoundException(
      `Customer with id ${id} not found or is not active`,
    );
  }

  const ordersWithStats = customer.orders.map((order) => {
    const totalM2 = order.order_pieces.reduce((sum, piece) => {
      if (!piece.width || !piece.height) return sum;
      const w = Number(piece.width);
      const h = Number(piece.height);
      return sum + w * h;
    }, 0);

    const totalPrice = order.order_pieces.reduce(
      (sum, piece) => sum + Number(piece.price ?? 0),
      0,
    );

    return {
      id: order.id,
      qrCode: order.qr_code,
      scheduledDate: order.scheduled_date,
      status: order.status?.status_name ?? null,
      deliveryType: order.delivery_type?.type_name ?? null,
      createdBy: order.users
        ? `${order.users.first_name} ${order.users.last_name}`
        : null,
      totalPieces: order.total_pieces,
      measuredPieces: order.measured_pieces,
      totalM2,
      totalPrice,
      createdAt: order.created_at,
    };
  });

  const totalOrders = ordersWithStats.length;
  const totalM2All = ordersWithStats.reduce((sum, o) => sum + o.totalM2, 0);
  const totalMoneyAll = ordersWithStats.reduce(
    (sum, o) => sum + o.totalPrice,
    0,
  );
  const lastOrder = ordersWithStats[0] ?? null;
  const avgOrderValue = totalOrders > 0 ? totalMoneyAll / totalOrders : 0;

  return {
    id: customer.id,
    firstName: customer.first_name,
    lastName: customer.last_name,
    phoneNumber: customer.phone_number,
    isActive: customer.is_active,
    createdAt: customer.created_at,
    updatedAt: customer.updated_at,
    customerAddresses: customer.customer_addresses,
    customerNote: customer.customer_notes,
    stats: {
      totalOrders,
      totalM2: totalM2All,
      totalMoney: totalMoneyAll,
      avgOrderValue,
      lastOrderDate: lastOrder?.createdAt ?? null,
    },
    orders: ordersWithStats,
  };
}

//////////////////////////////////////////// with top 10% LOYALITY
// src/modules/customers/queries/customer.find-one-with-stats.ts
// import { NotFoundException } from '@nestjs/common';
// import { PrismaService } from 'src/infrastructure/database/prisma.service';

// type AddressSelect = {
//   id: true;
//   street: true;
//   city: true;
//   village: true;
//   postal_code: true;
//   country: true;
//   formatted_address: true;
//   is_default: true;
//   is_active: true;
//   latitude: true;
//   longitude: true;
// };

// export async function getCustomerWithStats(
//   prisma: PrismaService,
//   id: number,
//   customerAddressSelect: AddressSelect,
//   isActive: boolean,
// ) {
//   // 1) Load customer + related data
//   const customer = await prisma.customers.findUnique({
//     where: { id },
//     include: {
//       customer_addresses: {
//         select: customerAddressSelect,
//         where: { is_active: isActive },
//       },
//       orders: {
//         include: {
//           delivery_type: {
//             select: {
//               type_name: true,
//             },
//           },
//           status: {
//             select: {
//               status_name: true,
//             },
//           },
//           users: {
//             select: {
//               first_name: true,
//               last_name: true,
//             },
//           },
//           order_pieces: {
//             select: {
//               width: true,
//               height: true,
//               price: true,
//             },
//           },
//         },
//         orderBy: { created_at: 'desc' },
//       },
//     },
//   });

//   if (!customer) {
//     throw new NotFoundException(`Customer with id ${id} not found`);
//   }

//   if (isActive && !customer.is_active) {
//     throw new NotFoundException(
//       `Customer with id ${id} not found or is not active`,
//     );
//   }

//   // 2) Per-order stats for this customer
//   const ordersWithStats = customer.orders.map((order) => {
//     const totalM2 = order.order_pieces.reduce((sum, piece) => {
//       if (!piece.width || !piece.height) return sum;
//       const w = Number(piece.width);
//       const h = Number(piece.height);
//       // your choice: cm² → m², or just keep “units”
//       return sum + (w * h) / 10000; // cm → m²
//     }, 0);

//     const totalPrice = order.order_pieces.reduce(
//       (sum, piece) => sum + Number(piece.price ?? 0),
//       0,
//     );

//     return {
//       id: order.id,
//       qrCode: order.qr_code,
//       scheduledDate: order.scheduled_date,
//       status: order.status?.status_name ?? null,
//       deliveryType: order.delivery_type?.type_name ?? null,
//       createdBy: order.users
//         ? `${order.users.first_name} ${order.users.last_name}`
//         : null,
//       totalPieces: order.total_pieces,
//       measuredPieces: order.measured_pieces,
//       totalM2,
//       totalPrice,
//       createdAt: order.created_at,
//     };
//   });

//   const totalOrders = ordersWithStats.length;
//   const totalM2All = ordersWithStats.reduce((sum, o) => sum + o.totalM2, 0);
//   const totalMoneyAll = ordersWithStats.reduce(
//     (sum, o) => sum + o.totalPrice,
//     0,
//   );
//   const lastOrder = ordersWithStats[0] ?? null;
//   const avgOrderValue = totalOrders > 0 ? totalMoneyAll / totalOrders : 0;

//   // 3) Global ranking: how good is this customer compared to all?
//   //
//   // This query returns one row per customer with their total spent
//   // (only active customers; you can tweak the where if you want to
//   // include deleted too).
//   const totalsPerCustomer = await prisma.orders.groupBy({
//     by: ['customer_id'],
//     where: {
//       customer_id: { not: null },
//       customers: { is_active: true },
//     },
//     _sum: {
//       total_price: true,
//     },
//   });

//   // Filter out null customer_id if any (just in case)
//   const cleaned = totalsPerCustomer.filter(
//     (row) => row.customer_id !== null && row._sum.total_price !== null,
//   );

//   // Sort customers by total spent DESC (biggest first)
//   cleaned.sort(
//     (a, b) => Number(b._sum.total_price) - Number(a._sum.total_price),
//   );

//   const totalCustomers = cleaned.length;

//   // Find this customer's rank (1 = best)
//   const rankIndex = cleaned.findIndex((row) => row.customer_id === customer.id);
//   const rank = rankIndex === -1 ? null : rankIndex + 1;

//   let percentile: number | null = null;
//   let isTop10Percent = false;

//   if (rank !== null && totalCustomers > 0) {
//     // percentile ~ "how many are below you"
//     // Example: rank=1 in 100 customers → (99/100)*100 = 99th percentile
//     percentile = ((totalCustomers - rank) / totalCustomers) * 100;

//     const thresholdRank = Math.ceil(totalCustomers * 0.1); // top 10%
//     isTop10Percent = rank <= thresholdRank;
//   }

//   return {
//     id: customer.id,
//     firstName: customer.first_name,
//     lastName: customer.last_name,
//     phoneNumber: customer.phone_number,
//     isActive: customer.is_active,
//     createdAt: customer.created_at,
//     updatedAt: customer.updated_at,
//     customerAddresses: customer.customer_addresses,
//     stats: {
//       totalOrders,
//       totalM2: totalM2All,
//       totalMoney: totalMoneyAll,
//       avgOrderValue,
//       lastOrderDate: lastOrder?.createdAt ?? null,
//     },
//     loyalty: {
//       rank,
//       totalCustomers,
//       percentile, // e.g. 92.3 means "better than ~92.3% of customers"
//       isTop10Percent,
//     },
//     orders: ordersWithStats,
//   };
// }
// ////////////////////////////////////////////////////////////////
