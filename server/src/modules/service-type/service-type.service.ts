import { Injectable } from '@nestjs/common';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { buildServiceTypeListCacheKey } from 'src/infrastructure/cache/cache-keys';
import { service_type } from '@prisma/client';

@Injectable()
export class ServiceTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  create(createServiceTypeDto: CreateServiceTypeDto) {
    return 'This action adds a new serviceType';
  }

  async findAll() {
    const cacheKey = buildServiceTypeListCacheKey();
    const cached = await this.redis.get<service_type[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.prisma.service_type.findMany({
      where: { is_active: true },
    });

    await this.redis.set(cacheKey, result);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceType`;
  }

  update(id: number, updateServiceTypeDto: UpdateServiceTypeDto) {
    return `This action updates a #${id} serviceType`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceType`;
  }
}
