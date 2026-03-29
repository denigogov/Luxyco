import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { buildStatusListCacheKey } from 'src/infrastructure/cache/cache-keys';
import { status } from '@prisma/client';

@Injectable()
export class StatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}
  create(createStatusDto: CreateStatusDto) {
    return 'This action adds a new status';
  }

  async findAll() {
    const cacheKey = buildStatusListCacheKey();
    const cached = await this.redis.get<[status]>(cacheKey);

    if (cached) {
      return cached;
    }

    const result = await this.prisma.status.findMany({
      where: { is_active: true },
    });

    await this.redis.set(cacheKey, result);

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} status`;
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
