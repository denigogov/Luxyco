import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  private async invalidateDeliveryTypeCache() {
    await this.redis.delByPrefix('luxyco:orders:references:v1:');
    await this.redis.delByPrefix('luxyco:orders:detail:v1:');
    // const activeDetailKey = buildCustomerDetailCacheKey({
    //   id: customerId,
    //   isActive: true,
    // });
    // const inactiveDetailKey = buildCustomerDetailCacheKey({
    //   id: customerId,
    //   isActive: false,
    // });

    // await this.redis.del([activeDetailKey, inactiveDetailKey]);
  }

  async create(createDeliveryTypeDto: CreateDeliveryTypeDto) {
    const createDeliveryType = this.prisma.delivery_type.create({
      data: {
        price: createDeliveryTypeDto.price,
        type_name: createDeliveryTypeDto.typeName,
        is_active: true,
      },
    });

    await this.invalidateDeliveryTypeCache();

    return createDeliveryType;
  }

  async findAll(query: GetDeliveryTypeDto) {
    const isActive = query.active ?? true;
    // const cacheKey = buildDeliveryTypeListCacheKey();
    // const cached = await this.redis.get<delivery_type[]>(cacheKey);

    // if (cached) {
    //   return cached;
    // }

    const args = {
      where: {
        is_active: isActive,
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

    // await this.redis.set(cacheKey, result);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} deliveryType`;
  }

  async update(id: number, updateDeliveryTypeDto: UpdateDeliveryTypeDto) {
    if (Object.keys(updateDeliveryTypeDto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const existing = await this.prisma.delivery_type.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Delivery Type with id ${id} not found`);
    }

    const updateDeliveryType = await this.prisma.delivery_type.update({
      where: { id },
      data: {
        type_name: updateDeliveryTypeDto.typeName,
        price: updateDeliveryTypeDto.price,
        is_active: updateDeliveryTypeDto.isActive,
      },
    });

    await this.invalidateDeliveryTypeCache();
    return updateDeliveryType;
  }

  remove(id: number) {
    return `This action removes a #${id} deliveryType`;
  }
}
