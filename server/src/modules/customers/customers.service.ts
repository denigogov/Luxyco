import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { paginate } from 'src/common/utils/pagination.util';
import { CustomersQueryDto } from './dto/get-customers.dto';
import { buildCustomersFindManyArgs } from './queries/customers.find-many.args';
import { getCustomerWithStats } from './queries/customer.find-one-with-stats';
import { CreateCustomerFullDto } from './dto/create-customer-full.dto';
import { customers, Prisma } from '@prisma/client';
import { RedisService } from 'src/infrastructure/cache/redis.service';
import { PaginatedResult } from 'src/common/types/pagination.types';
import {
  buildCacheKey,
  buildCustomerDetailCacheKey,
  buildCustomersListCacheKey,
} from 'src/infrastructure/cache/cache-keys';

@Injectable()
export class CustomersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private readonly customerAddressSelect = {
    id: true,
    street: true,
    city: true,
    village: true,
    postal_code: true,
    country: true,
    formatted_address: true,
    is_default: true,
    is_active: true,
    latitude: true,
    longitude: true,
    is_verified_by_provider: true,
  } as const;

  private async invalidateCustomerCache(id: number) {
    await this.redis.delByPrefix('luxyco:customers:list:v1:');

    const activeDetailKey = buildCustomerDetailCacheKey({
      id,
      isActive: true,
    });
    const inactiveDetailKey = buildCustomerDetailCacheKey({
      id,
      isActive: false,
    });

    await this.redis.del([activeDetailKey, inactiveDetailKey]);
  }

  private async ensureDeleted(id: number) {
    const c = await this.prisma.customers.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Customer with id ${id} not found`);
    if (c.is_active)
      throw new BadRequestException(`Customer ${id} is not deleted`);
    return c;
  }
  async create(dto: CreateCustomerFullDto, userId: number) {
    const phone = dto.phoneNumber.trim();

    const include = {
      customer_addresses: {
        select: {
          formatted_address: true,
        },
        where: { is_default: true },
      },
    } as const;

    const existing = await this.prisma.customers.findUnique({
      where: { phone_number: phone },
      include,
    });

    if (existing) {
      if (!existing.is_active) {
        throw new ConflictException({
          message: 'Постои деактивиран клиент со овој телефонски број.',
          code: 'CUSTOMER_INACTIVE_WITH_PHONE',
          customer: existing,
        });
      }

      if (existing.is_active) {
        throw new ConflictException({
          message: 'Веќе постои активен клиент со овој телефонски број.',
          code: 'CUSTOMER_ACTIVE_WITH_PHONE',
          customer: existing,
        });
      }
    }

    try {
      const created = await this.prisma.customers.create({
        data: {
          first_name: dto.firstName,
          last_name: dto.lastName,
          phone_number: phone,

          customer_addresses: dto.address
            ? {
                create: {
                  street: dto.address.street,
                  city: dto.address.city,
                  village: dto.address.village ?? null,
                  postal_code: dto.address.postalCode,
                  country: dto.address.country,
                  formatted_address: dto.address.formattedAddress,
                  latitude: dto.address.latitude as any,
                  longitude: dto.address.longitude as any,
                  is_default: dto.address.isDefault ?? true,
                  is_active: true,
                  is_verified_by_provider:
                    dto.address.isVerifiedByProvider ?? false,
                },
              }
            : undefined,

          customer_notes: dto.noteText?.trim()
            ? {
                create: {
                  note_text: dto.noteText.trim(),
                  is_active: true,
                  created_by_user_id: userId,
                },
              }
            : undefined,
        },
        include,
      });

      await this.invalidateCustomerCache(created.id);

      return created;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        const existingAfter = await this.prisma.customers.findUnique({
          where: { phone_number: phone },
          include,
        });

        throw new ConflictException({
          message: existingAfter?.is_active
            ? 'Веќе постои активен клиент со овој телефонски број.'
            : 'Постои деактивиран клиент со овој телефонски број.',
          code: existingAfter?.is_active
            ? 'CUSTOMER_ACTIVE_WITH_PHONE'
            : 'CUSTOMER_INACTIVE_WITH_PHONE',
          customer: existingAfter ?? null,
        });
      }

      throw e;
    }
  }

  async findAll(query: CustomersQueryDto) {
    const cacheKey = buildCustomersListCacheKey(query);

    const cached = await this.redis.get<PaginatedResult<customers>>(cacheKey);

    if (cached) {
      return cached;
    }
    const baseArgs = buildCustomersFindManyArgs(
      query,
      this.customerAddressSelect,
      true,
    );

    const result = await paginate(
      this.prisma.customers as any,
      baseArgs,
      query,
    );

    await this.redis.set(cacheKey, result, 300);

    return result;
  }

  async findOne(
    id: number,
    isActive: boolean = true,
    sendSimpleData: boolean = false,
  ) {
    if (sendSimpleData) {
      const customer = await this.prisma.customers.findUnique({
        where: { id },
        include: {
          customer_addresses: {
            select: this.customerAddressSelect,
            where: { is_active: isActive },
          },
        },
      });

      if (!customer) {
        throw new NotFoundException(`Customer with id ${id} not found`);
      }

      if (isActive && !customer.is_active) {
        throw new NotFoundException(
          `Customer with id ${id} not found or is not active`,
        );
      }

      return customer;
    }

    const cacheKey = buildCustomerDetailCacheKey({ id, isActive });

    const cached = await this.redis.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await getCustomerWithStats(
      this.prisma,
      id,
      this.customerAddressSelect,
      isActive,
    );

    await this.redis.set(cacheKey, result, 300);

    return result;
  }

  async update(id: number, dto: UpdateCustomerDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    await this.findOne(id, true, true);

    const data: any = {};
    if (dto.firstName !== undefined) data.first_name = dto.firstName;
    if (dto.lastName !== undefined) data.last_name = dto.lastName;
    if (dto.phoneNumber !== undefined) data.phone_number = dto.phoneNumber;
    if (dto.isActive !== undefined) data.is_active = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No valid fields provided to update');
    }

    const updated = await this.prisma.customers.update({
      where: { id },
      data,
    });

    await this.invalidateCustomerCache(id);

    return updated;
  }

  async remove(id: number) {
    const customer = await this.findOne(id, true, true);

    await this.prisma.$transaction([
      this.prisma.customers.update({
        where: { id: customer.id },
        data: { is_active: false },
      }),
      this.prisma.customer_addresses.updateMany({
        where: { customer_id: customer.id, is_active: true },
        data: { is_active: false },
      }),
    ]);

    await this.invalidateCustomerCache(customer.id);

    return { message: `Customer ${id} deleted` };
  }

  /// soft deleted customers
  async findDeleted(query: CustomersQueryDto) {
    const baseArgs = buildCustomersFindManyArgs(
      query,
      this.customerAddressSelect,
      false,
    );
    return paginate(this.prisma.customers as any, baseArgs, query);
  }

  async restoreDeleted(id: number) {
    await this.ensureDeleted(id);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.customers.update({
        where: { id },
        data: { is_active: true },
      });

      await tx.customer_addresses.updateMany({
        where: { customer_id: id, is_active: false, is_default: true },
        data: { is_active: true },
      });

      return { addressRestored: true };
    });

    await this.invalidateCustomerCache(id);

    return {
      message: `Customer ${id} restored`,
      ...result,
    };
  }

  // in use need to be restricted which account can delete
  async softDeleteMany(ids: number[]) {
    if (!ids.length) throw new BadRequestException('No ids provided');

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedCustomers = await tx.customers.updateMany({
        where: { id: { in: ids }, is_active: true },
        data: { is_active: false },
      });

      await tx.customer_addresses.updateMany({
        where: { customer_id: { in: ids }, is_active: true },
        data: { is_active: false },
      });

      return updatedCustomers;
    });

    return { message: `Soft-deleted ${result.count} customers` };
  }

  async hardDelete(id: number) {
    await this.ensureDeleted(id);

    await this.prisma.$transaction([
      this.prisma.customer_addresses.deleteMany({ where: { customer_id: id } }),
      this.prisma.customers.delete({ where: { id } }),
    ]);

    return { message: `Customer ${id} permanently deleted` };
  }

  async hardDeleteMany(ids: number[]) {
    if (!ids.length) throw new BadRequestException('No ids provided');

    const deleted = await this.prisma.$transaction(async (tx) => {
      await tx.customer_addresses.deleteMany({
        where: { customer_id: { in: ids } },
      });

      return tx.customers.deleteMany({
        where: { id: { in: ids }, is_active: false },
      });
    });

    return { message: `Permanently deleted ${deleted.count} customers` };
  }

  // all inactive customer delete -- like empty trash in one move all delete
  async deleteAllPermanently() {
    await this.prisma.customer_addresses.deleteMany({
      where: { customers: { is_active: false } },
    });

    const result = await this.prisma.customers.deleteMany({
      where: { is_active: false },
    });

    if (result.count === 0) {
      throw new NotFoundException('No deleted customers to permanently delete');
    }

    return { message: `Permanently deleted ${result.count} customers` };
  }
}
