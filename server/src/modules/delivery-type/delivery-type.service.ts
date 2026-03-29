import { Injectable } from '@nestjs/common';
import { CreateDeliveryTypeDto } from './dto/create-delivery-type.dto';
import { UpdateDeliveryTypeDto } from './dto/update-delivery-type.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { buildDeliveryTypeListCacheKey } from 'src/infrastructure/cache/cache-keys';
import { delivery_type } from '@prisma/client';

@Injectable()
export class DeliveryTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  create(createDeliveryTypeDto: CreateDeliveryTypeDto) {
    return 'This action adds a new deliveryType';
  }

  async findAll() {
    const cacheKey = buildDeliveryTypeListCacheKey();
    const cached = await this.redis.get<delivery_type[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.prisma.delivery_type.findMany({
      where: { is_active: true },
    });

    console.log(result);

    await this.redis.set(cacheKey, result);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryType`;
  }

  update(id: number, updateDeliveryTypeDto: UpdateDeliveryTypeDto) {
    return `This action updates a #${id} deliveryType`;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryType`;
  }
}
