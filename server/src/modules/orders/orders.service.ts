import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { OrdersQueryDto } from './dto/get-order.dto';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import {
  addMeasurementStats,
  buildOrdersFindManyArgs,
} from './queries/orders.find-many.args';
import {
  buildCustomerDetailCacheKey,
  buildOrderDetailCacheKey,
  buildOrderReferencesListCacheKey,
  buildOrdersListCacheKey,
} from 'src/infrastructure/cache/cache-keys';
import { OrdersCreateService } from './order.create.service';
import { PrintEventsService } from 'src/infrastructure/printing/print-events.service';
import { OrdersDetailService } from './order.detail.service';
import { OrdersUpdateService } from './order.update.services';
import { OrderPieceUpdateService } from './order-piece.update.service';
import { UpdateOrderPieceDto } from './dto/update-order-piece.dto';
import { AddOrderPieceDto } from './dto/add-order-piece.dto';
import { BulkCustomerBillPrintDto } from './dto/bulk-customer-bill-print.dto';
import { OrderBulkPrintService } from './order.bulk-print.services';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly ordersCreateService: OrdersCreateService,
    private readonly printEvents: PrintEventsService,
    private readonly OrdersDetailService: OrdersDetailService,
    private readonly ordersUpdateService: OrdersUpdateService,
    private readonly orderPieceUpdateService: OrderPieceUpdateService,
    private readonly orderBulkPrintService: OrderBulkPrintService,
  ) {}

  private async invalidateOrdersCache(args?: {
    orderId?: number | string;
    customerId?: number;
  }) {
    const keysToDelete: string[] = [];

    if (args?.orderId) {
      keysToDelete.push(buildOrderDetailCacheKey(args.orderId));
    }

    if (args?.customerId) {
      keysToDelete.push(
        buildCustomerDetailCacheKey({
          id: args.customerId,
          isActive: true,
        }),

        buildCustomerDetailCacheKey({
          id: args.customerId,
          isActive: false,
        }),
      );
    }

    await Promise.all([
      this.redis.delByPrefix('luxyco:orders:list:v1:'),

      keysToDelete.length ? this.redis.del(keysToDelete) : Promise.resolve(0),
    ]);
  }

  async getBulkCustomerBillData(dto: BulkCustomerBillPrintDto) {
    return this.orderBulkPrintService.getBulkCustomerBillData(dto.orderIds);
  }

  async create(dto: CreateOrderDto, userId: number) {
    const order = await this.ordersCreateService.create(dto, userId);

    // invalidate after success
    await this.invalidateOrdersCache({
      orderId: order?.id,
      customerId: dto.customerId,
    });
    this.printEvents.emitOrderCreated(order);
    return order;
  }

  async findAll(query: OrdersQueryDto) {
    const cacheKey = buildOrdersListCacheKey(query);

    const cached = await this.redis.get(cacheKey);
    if (cached) return cached;

    const args = buildOrdersFindManyArgs(query);

    const result = await paginate(this.prisma.orders as any, args, query);
    const ordersWithMeasurementItems = addMeasurementStats(result);

    await this.redis.set(cacheKey, ordersWithMeasurementItems, 300);
    return ordersWithMeasurementItems;
  }

  async getOrderReferences() {
    const cacheKey = buildOrderReferencesListCacheKey();
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const [deliveryTypes, serviceTypes, priceModels] = await Promise.all([
      this.prisma.delivery_type.findMany({
        where: { is_active: true },
        select: { id: true, type_name: true, price: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.service_type.findMany({
        where: { is_active: true },
        select: { id: true, service_name: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.price_model.findMany({
        where: { is_active: true },
        select: {
          id: true,
          name: true,
          product_types: {
            where: { is_active: true },
            select: {
              id: true,
              name: true,
              base_price: true,
            },
          },
        },
      }),
    ]);

    const productTypes = priceModels.flatMap((pm) =>
      pm.product_types.map((pt) => ({
        id: pt.id,
        name: pt.name,
        base_price: pt.base_price,
        price_model_id: pm.id,
        price_model_name: pm.name,
      })),
    );

    const result = { deliveryTypes, serviceTypes, productTypes };

    await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: number | string) {
    const orderDetails = await this.OrdersDetailService.details(id);
    return orderDetails;
  }

  async findOrderHistory(identifier: number | string) {
    const value = String(identifier);
    const isNumericId = /^\d+$/.test(value);

    const order = await this.prisma.orders.findUnique({
      where: isNumericId ? { id: Number(value) } : { qr_code: value },
      select: {
        id: true,
        qr_code: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${value} not found`);
    }

    const history = await this.prisma.order_status_history.findMany({
      where: {
        order_id: order.id,
      },
      select: {
        status: {
          select: {
            id: true,
            status_name: true,
          },
        },
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        created_at: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    return {
      order: {
        id: order.id,
        qrCode: order.qr_code,
      },
      history,
    };
  }

  async update(id: number, dto: UpdateOrderDto, userId: number) {
    const result = await this.ordersUpdateService.update(id, dto, userId);

    await Promise.all([
      this.invalidateOrdersCache({
        orderId: id,
        customerId: result.previousCustomerId ?? undefined,
      }),

      result.currentCustomerId &&
      result.currentCustomerId !== result.previousCustomerId
        ? this.invalidateOrdersCache({
            orderId: id,
            customerId: result.currentCustomerId,
          })
        : Promise.resolve(),
    ]);

    return {
      success: true,
    };
  }

  async updateOrderPiece(
    orderIdentifier: number | string,
    pieceQr: string,
    dto: UpdateOrderPieceDto,
    userId: number,
  ) {
    const result = await this.orderPieceUpdateService.updatePiece(
      orderIdentifier,
      pieceQr,
      dto,
      userId,
    );

    await this.invalidateOrdersCache({
      orderId: result.orderId,
      customerId: result.customerId ?? undefined,
    });

    return {
      success: true,
    };
  }

  async addOrderPiece(
    orderIdentifier: number | string,
    dto: AddOrderPieceDto, // wrapper with items[]
    userId: number,
  ) {
    const results: Awaited<
      ReturnType<typeof this.orderPieceUpdateService.addPiece>
    >[] = [];

    for (const item of dto.items) {
      for (let i = 0; i < item.quantity; i++) {
        const result = await this.orderPieceUpdateService.addPiece(
          orderIdentifier,
          item, // single AddOrderPieceItemDto
          userId,
        );
        results.push(result);
      }
    }

    const last = results[results.length - 1];

    await this.invalidateOrdersCache({
      orderId: last.orderId,
      customerId: last.customerId ?? undefined,
    });

    return {
      success: true,
      pieces: results.map((r) => ({ pieceId: r.pieceId, pieceQr: r.pieceQr })),
      orderId: last.orderId,
      customerId: last.customerId,
    };
  }

  async removeOrderPiece(
    orderIdentifier: number | string,
    pieceQr: string,
    userId: number,
  ) {
    const result = await this.orderPieceUpdateService.removePiece(
      orderIdentifier,
      pieceQr,
      userId,
    );

    await this.invalidateOrdersCache({
      orderId: result.orderId,
      customerId: result.customerId ?? undefined,
    });

    return {
      success: true,
      ...result,
    };
  }

  async deleteMany(ids: number[]) {
    if (!ids.length) {
      throw new BadRequestException('No ids provided');
    }

    const orders = await this.prisma.orders.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        status: true,
      },
    });
    const customerIds = [...new Set(orders.map((o) => o.customer_id))];

    if (!orders.length) {
      throw new NotFoundException('Orders not found');
    }

    const deletableStatusesId = [1, 6];

    const invalidOrders = orders.filter(
      (order) => !deletableStatusesId.includes(Number(order.status?.id)),
    );

    if (invalidOrders.length) {
      throw new BadRequestException(`Some orders cannot be deleted`);
    }

    const result = await this.prisma.orders.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    await Promise.all([
      this.redis.delByPrefix('luxyco:orders:list:v1:'),

      ...ids.map((id) => this.redis.del([buildOrderDetailCacheKey(id)])),

      ...customerIds.map((customerId) =>
        this.redis.del([
          buildCustomerDetailCacheKey({
            id: Number(customerId),
            isActive: true,
          }),

          buildCustomerDetailCacheKey({
            id: Number(customerId),
            isActive: false,
          }),
        ]),
      ),
    ]);

    return {
      message: `Deleted ${result.count} orders`,
    };
  }
}
