import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  private async invalidateCustomerCache() {
    await this.redis.delByPrefix('luxyco:customers:list:v1:');
    await this.redis.delByPrefix('luxyco:customers:order-list:v1:');
    await this.redis.delByPrefix('luxyco:orders:references:v1:');
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

  async create(dto: CreatePriceDto) {
    const createdNote = this.prisma.product_types.create({
      data: {
        base_price: dto.basePrice,
        name: dto.name,
        pricing_model_id: dto.priceModelId,
        is_active: true,
      },
    });

    await this.invalidateCustomerCache();

    return createdNote;
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

  async update(id: number, dto: UpdatePriceDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const existing = await this.prisma.product_types.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    const updateProduct = await this.prisma.product_types.update({
      where: { id },
      data: {
        base_price: dto.basePrice,
        name: dto.name,
        is_active: dto.isActive,
        pricing_model_id: dto.priceModelId,
      },
    });

    await this.invalidateCustomerCache();

    return updateProduct;
  }

  async remove(id: number) {
    const existing = await this.prisma.product_types.findUnique({
      where: { id },
      select: { id: true, is_active: true },
    });

    if (!existing || !existing.is_active) {
      throw new NotFoundException(
        `Product with id ${id} not found or already inactive`,
      );
    }

    await this.prisma.product_types.update({
      where: { id },
      data: { is_active: false },
    });
    await this.invalidateCustomerCache();

    return {
      success: true,
    };
  }
}
