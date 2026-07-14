// src/modules/orders/order.bulk-print.services.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class OrderBulkPrintService {
  constructor(private readonly prisma: PrismaService) {}

  async getBulkCustomerBillData(orderIds: number[]) {
    const orders = await this.prisma.orders.findMany({
      where: {
        id: {
          in: orderIds,
        },
      },

      select: {
        id: true,
        qr_code: true,
        total_price: true,
        scheduled_date: true,
        created_at: true,

        customers: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            phone_number: true,
          },
        },

        customer_addresses: {
          select: {
            formatted_address: true,
          },
        },

        delivery_type: {
          select: {
            type_name: true,
            price: true,
          },
        },

        order_pieces: {
          orderBy: {
            piece_index: 'asc',
          },
          select: {
            id: true,
            piece_index: true,
            width: true,
            height: true,
            price: true,

            product_types: {
              select: {
                name: true,
                price_model: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orders.length) {
      throw new NotFoundException('No orders found for printing');
    }

    const orderMap = new Map(orders.map((order) => [order.id, order]));

    return orderIds.map((id) => orderMap.get(id)).filter(Boolean);
  }
}
