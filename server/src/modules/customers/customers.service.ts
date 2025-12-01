import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { paginate } from 'src/common/utils/pagination.util';
import { CustomersQueryDto } from './dto/get-customers.dto';
import { buildCustomersFindManyArgs } from './queries/customers.find-many.args';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly customerAddressSelect = {
    id: true,
    street: true,
    city: true,
    postal_code: true,
    country: true,
    formatted_address: true,
    is_default: true,
    is_active: true,
    latitude: true,
    longitude: true,
  } as const;

  private async ensureDeleted(id: number) {
    const c = await this.prisma.customers.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Customer with id ${id} not found`);
    if (c.is_active)
      throw new BadRequestException(`Customer ${id} is not deleted`);
    return c;
  }

  async create(dto: CreateCustomerDto) {
    return this.prisma.customers.create({
      data: {
        first_name: dto.firstName,
        last_name: dto.lastName,
        phone_number: dto.phoneNumber,
      },
    });
  }

  async findAll(query: CustomersQueryDto) {
    const baseArgs = buildCustomersFindManyArgs(
      query,
      this.customerAddressSelect,
      true,
    );
    return paginate(this.prisma.customers as any, baseArgs, query);
  }

  async findOne(id: number, isActive: boolean = true) {
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

  async update(id: number, dto: UpdateCustomerDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    console.log(id, dto);
    await this.findOne(id);

    const data: any = {};
    if (dto.firstName !== undefined) data.first_name = dto.firstName;
    if (dto.lastName !== undefined) data.last_name = dto.lastName;
    if (dto.phoneNumber !== undefined) data.phone_number = dto.phoneNumber;
    if (dto.isActive !== undefined) data.is_active = dto.isActive;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No valid fields provided to update');
    }

    return this.prisma.customers.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const customer = await this.findOne(id);

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

    return {
      message: `Customer ${id} restored`,
      ...result,
    };
  }

  async hardDelete(id: number) {
    await this.ensureDeleted(id);

    await this.prisma.$transaction([
      this.prisma.customer_addresses.deleteMany({ where: { customer_id: id } }),
      this.prisma.customers.delete({ where: { id } }),
    ]);

    return { message: `Customer ${id} permanently deleted` };
  }

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
}
