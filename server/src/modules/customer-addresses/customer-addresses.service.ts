import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerAddressesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly customerAddressSelect = {
    id: true,
    street: true,
    city: true,
    postal_code: true,
    village: true,
    country: true,
    formatted_address: true,
    is_default: true,
    is_active: true,
    latitude: true,
    longitude: true,
  } as const;

  private async ensureActiveAddress(
    tx: Prisma.TransactionClient,
    customerId: number,
    addressId: number,
  ) {
    const addr = await tx.customer_addresses.findFirst({
      where: {
        id: addressId,
        customer_id: customerId,
        is_active: true,
        customers: { is_active: true },
      },
      select: { id: true, is_default: true },
    });
    if (!addr) throw new NotFoundException('Address not found');
    return addr;
  }

  async create(customerId: number, dto: CreateCustomerAddressDto) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, is_active: true },
    });

    if (!customer || !customer.is_active) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const activeCount = await tx.customer_addresses.count({
        where: { customer_id: customerId, is_active: true },
      });

      const shouldBeDefault =
        activeCount === 0 ? true : (dto.isDefault ?? false);

      if (shouldBeDefault) {
        await tx.customer_addresses.updateMany({
          where: { customer_id: customerId, is_active: true },
          data: { is_default: false },
        });
      }

      return tx.customer_addresses.create({
        data: {
          customer_id: customerId,
          street: dto.street,
          city: dto.city,
          village: dto.village,
          postal_code: dto.postalCode,
          country: dto.country,
          is_default: shouldBeDefault,
          formatted_address: dto.formattedAddress,
          latitude: dto.latitude ?? 0,
          longitude: dto.longitude ?? 0,
        },
        select: this.customerAddressSelect,
      });
    });
  }

  async findAll() {
    return this.prisma.customers.findMany({
      where: {
        is_active: true,
        customer_addresses: {
          some: { is_active: true },
        },
      },
      include: {
        customer_addresses: {
          select: this.customerAddressSelect,
          where: { is_active: true },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.customers.findUnique({
      where: { id },
      include: {
        customer_addresses: {
          select: this.customerAddressSelect,
          where: { is_active: true },
        },
      },
    });

    if (!customer || !customer.is_active) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return customer;
  }

  async update(
    customerId: number,
    addressId: number,
    dto: UpdateCustomerAddressDto,
  ) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const address = await this.prisma.customer_addresses.findFirst({
      where: {
        id: addressId,
        customer_id: customerId,
        is_active: true,
        customers: { is_active: true },
      },
      select: { id: true, customer_id: true },
    });

    if (!address) {
      throw new NotFoundException(
        `Address ${addressId} not found for customer ${customerId}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault === true) {
        await tx.customer_addresses.updateMany({
          where: {
            customer_id: customerId,
            is_active: true,
            NOT: { id: addressId },
          },
          data: { is_default: false },
        });
      }

      return tx.customer_addresses.update({
        where: { id: addressId },
        data: {
          street: dto.street ?? undefined,
          city: dto.city ?? undefined,
          village: dto.village ?? undefined,
          postal_code: dto.postalCode ?? undefined,
          country: dto.country ?? undefined,
          formatted_address: dto.formattedAddress ?? undefined,
          latitude: dto.latitude ?? undefined,
          longitude: dto.longitude ?? undefined,
          is_default: dto.isDefault ?? undefined,
        },
        select: this.customerAddressSelect,
      });
    });
  }

  async remove(customerId: number, addressId: number) {
    return this.prisma.$transaction(async (tx) => {
      const addr = await this.ensureActiveAddress(tx, customerId, addressId);
      if (!addr) throw new NotFoundException('Address not found');

      await tx.customer_addresses.update({
        where: { id: addressId },
        data: { is_active: false, is_default: false },
      });

      if (addr.is_default) {
        const next = await tx.customer_addresses.findFirst({
          where: { customer_id: customerId, is_active: true },
          orderBy: { created_at: 'asc' },
          select: { id: true },
        });

        if (next) {
          await tx.customer_addresses.update({
            where: { id: next.id },
            data: { is_default: true },
          });
        }
      }

      return { success: true };
    });
  }
}
