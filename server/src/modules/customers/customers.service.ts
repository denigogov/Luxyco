import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { customers } from '@prisma/client'; // <- type for mapping
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  private toBigInt(id: number): bigint {
    return BigInt(id);
  }

  private mapCustomer(c: customers) {
    return {
      ...c,
      id: Number(c.id),
    };
  }

  async create(dto: CreateCustomerDto) {
    const customer = await this.prisma.customers.create({
      data: {
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone_number: dto.phone,
      },
    });

    return this.mapCustomer(customer);
  }

  async findAll() {
    const allCustomers = await this.prisma.customers.findMany({
      orderBy: { created_at: 'desc' },
    });

    console.log(allCustomers);
    return allCustomers.map((c) => this.mapCustomer(c));
  }

  async findOne(id: number) {
    const customer = await this.prisma.customers.findUnique({
      where: { id: this.toBigInt(id) },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    return this.mapCustomer(customer);
  }

  async update(id: number, dto: UpdateCustomerDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    await this.findOne(id);

    const updated = await this.prisma.customers.update({
      where: { id: this.toBigInt(id) },
      data: dto,
    });

    return this.mapCustomer(updated);
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.customers.delete({
      where: { id: this.toBigInt(id) },
    });

    return { message: `Customer ${id} deleted` };
  }
}
