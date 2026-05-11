import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, dto: UpdateOrderDto) {
    const existingOrder = await this.prisma.orders.findUnique({
      where: { id },
      select: {
        id: true,
        customer_id: true,
        delivery_type_id: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    if (dto.orderStatusId !== undefined) {
      const status = await this.prisma.status.findFirst({
        where: {
          id: dto.orderStatusId,
          is_active: true,
        },
        select: { id: true },
      });

      if (!status) {
        throw new NotFoundException(
          `Status ${dto.orderStatusId} not found or inactive`,
        );
      }
    }

    let nextDeliveryPrice: Prisma.Decimal | undefined;

    if (dto.deliveryTypeId !== undefined) {
      const deliveryType = await this.prisma.delivery_type.findFirst({
        where: {
          id: dto.deliveryTypeId,
          is_active: true,
        },
        select: {
          id: true,
          price: true,
        },
      });

      if (!deliveryType) {
        throw new NotFoundException(
          `Delivery type ${dto.deliveryTypeId} not found or inactive`,
        );
      }

      nextDeliveryPrice = new Prisma.Decimal(deliveryType.price ?? 0);
    }

    if (dto.serviceTypeId !== undefined) {
      const serviceType = await this.prisma.service_type.findFirst({
        where: {
          id: dto.serviceTypeId,
          is_active: true,
        },
        select: { id: true },
      });

      if (!serviceType) {
        throw new NotFoundException(
          `Service type ${dto.serviceTypeId} not found or inactive`,
        );
      }
    }

    if (dto.customerId !== undefined) {
      const customer = await this.prisma.customers.findFirst({
        where: {
          id: dto.customerId,
          is_active: true,
        },
        select: { id: true },
      });

      if (!customer) {
        throw new NotFoundException(
          `Customer ${dto.customerId} not found or inactive`,
        );
      }
    }

    const customerIdForAddress = dto.customerId ?? existingOrder.customer_id;

    if (dto.deliveryAddressId !== undefined) {
      if (!customerIdForAddress) {
        throw new BadRequestException(
          'Cannot update delivery address without customer',
        );
      }

      const address = await this.prisma.customer_addresses.findFirst({
        where: {
          id: dto.deliveryAddressId,
          customer_id: customerIdForAddress,
          is_active: true,
        },
        select: { id: true },
      });

      if (!address) {
        throw new NotFoundException(
          `Address ${dto.deliveryAddressId} not found for customer ${customerIdForAddress}`,
        );
      }
    }

    let nextTotalPrice: Prisma.Decimal | undefined;

    if (dto.deliveryTypeId !== undefined) {
      const piecesTotal = await this.prisma.order_pieces.aggregate({
        where: {
          order_id: id,
        },
        _sum: {
          price: true,
        },
      });

      const piecesPrice = new Prisma.Decimal(piecesTotal._sum.price ?? 0);
      const deliveryPrice = nextDeliveryPrice ?? new Prisma.Decimal(0);

      nextTotalPrice = piecesPrice.plus(deliveryPrice);
    }

    await this.prisma.orders.update({
      where: { id },
      data: {
        ...(dto.customerId !== undefined && {
          customer_id: dto.customerId,
        }),

        ...(dto.deliveryAddressId !== undefined && {
          delivery_address_id: dto.deliveryAddressId,
        }),

        ...(dto.deliveryTypeId !== undefined && {
          delivery_type_id: dto.deliveryTypeId,
        }),

        ...(dto.serviceTypeId !== undefined && {
          service_type_id: dto.serviceTypeId,
        }),

        ...(dto.orderStatusId !== undefined && {
          order_status_id: dto.orderStatusId,
        }),

        ...(dto.scheduledDate !== undefined && {
          scheduled_date: new Date(dto.scheduledDate),
        }),

        ...(dto.orderNote !== undefined && {
          order_note: dto.orderNote?.trim() || null,
        }),

        ...(nextTotalPrice !== undefined && {
          total_price: nextTotalPrice,
        }),
      },
    });

    return {
      success: true,
      previousCustomerId: existingOrder.customer_id,
      currentCustomerId: dto.customerId ?? existingOrder.customer_id,
    };
  }
}
