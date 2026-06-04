import { Injectable } from '@nestjs/common';
import { CreateDeliveryTypeDto } from './dto/create-delivery-type.dto';
import { UpdateDeliveryTypeDto } from './dto/update-delivery-type.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { buildDeliveryTypeListCacheKey } from 'src/infrastructure/cache/cache-keys';
import { delivery_type } from '@prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { GetDeliveryTypeDto } from './dto/get-delivery-type.dto';

@Injectable()
export class DeliveryTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  create(createDeliveryTypeDto: CreateDeliveryTypeDto) {
    return 'This action adds a new deliveryType';
  }

  async findAll(query: GetDeliveryTypeDto) {
    const cacheKey = buildDeliveryTypeListCacheKey();
    const cached = await this.redis.get<delivery_type[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const args = {
      where: {
        ...(query.active !== undefined && {
          is_active: query.active,
        }),
      },
      orderBy: {
        id: 'desc',
      },
    };

    const result = await paginate(
      this.prisma.delivery_type as any,
      args,
      query,
    );

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
