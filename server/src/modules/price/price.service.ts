import { Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { paginate } from 'src/common/utils/pagination.util';

@Injectable()
export class PriceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  create(createPriceDto: CreatePriceDto) {
    return 'This action adds a new price';
  }

  async findAll(query) {
    const args = {
      include: {
        price_model: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        id: 'desc',
      },
    };

    const result = await paginate(
      this.prisma.product_types as any,
      args,
      query,
    );

    return result;
  }

  update(id: number, updatePriceDto: UpdatePriceDto) {
    return `This action updates a #${id} price`;
  }

  remove(id: number) {
    return `This action removes a #${id} price`;
  }
}
