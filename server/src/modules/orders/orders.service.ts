import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { orders, Prisma } from '@prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { OrdersQueryDto } from './dto/get-order.dto';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { PaginatedResult } from 'src/common/types/pagination.types';
import {
  addMeasurementStats,
  buildOrdersFindManyArgs,
} from './queries/orders.find-many.args';
import { buildOrdersListCacheKey } from 'src/infrastructure/cache/cache-keys';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
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

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
