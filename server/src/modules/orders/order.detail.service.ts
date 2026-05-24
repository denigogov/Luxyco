import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class OrdersDetailService {
  constructor(private readonly prisma: PrismaService) {}

  async details(identifier: number | string) {
    const value = String(identifier);
    const isNumericId = /^\d+$/.test(value);

    const order = await this.prisma.orders.findUnique({
      where: isNumericId ? { id: Number(value) } : { qr_code: value },

      select: {
        id: true,
        qr_code: true,
        total_pieces: true,
        measured_pieces: true,
        order_note: true,
        total_price: true,
        scheduled_date: true,
        created_at: true,
        updated_at: true,
        users: {
          select: {
            first_name: true,
          },
        },
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
        status: {
          select: {
            id: true,
            status_name: true,
          },
        },

        order_pieces: {
          orderBy: { piece_index: 'asc' },

          select: {
            id: true,
            piece_index: true,
            label_code: true,
            width: true,
            height: true,
            price: true,
            piece_note: true,
            orders: {
              select: {
                customers: {
                  select: {
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },

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

            users: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order ${value} not found`);
    }

    return order;
  }
}
