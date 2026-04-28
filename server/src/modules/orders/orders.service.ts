import { Injectable } from '@nestjs/common';
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
  buildOrderReferencesListCacheKey,
  buildOrdersListCacheKey,
} from 'src/infrastructure/cache/cache-keys';
import { OrdersCreateService } from './order.create.service';
import { PrintEventsService } from 'src/infrastructure/printing/print-events.service';
import { OrdersDetailService } from './order.detail.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly ordersCreateService: OrdersCreateService,
    private readonly printEvents: PrintEventsService,
    private readonly OrdersDetailService: OrdersDetailService,
  ) {}

  async create(dto: CreateOrderDto, userId: number) {
    const order = await this.ordersCreateService.create(dto, userId);

    // invalidate after success
    await Promise.all([
      this.redis.delByPrefix('luxyco:orders:list:v1:'),
      this.redis.delByPrefix('luxyco:orders:detail:v1:'),

      this.redis.del([
        buildCustomerDetailCacheKey({ id: dto.customerId, isActive: true }),
        buildCustomerDetailCacheKey({ id: dto.customerId, isActive: false }),
      ]),
    ]);
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
    // const cacheKey = buildOrderReferencesListCacheKey();
    // const cached = await this.redis.get<any>(cacheKey);
    // if (cached) return cached;

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

    // await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async findOne(id: number) {
    const orderDetails = await this.OrdersDetailService.details(id);
    return orderDetails;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
