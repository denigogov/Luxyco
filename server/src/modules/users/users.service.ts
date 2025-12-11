// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomersQueryDto } from '../customers/dto/get-customers.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { account_types, users } from '@prisma/client';
export type UserWithRole = users & { account_types: account_types | null };
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany({
      where: {
        is_active: true,
      },
      omit: {
        account_type_id: true,
        password: true,
        updated_at: true,
        created_at: true,
      },

      include: {
        account_types: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findByUsername(username: string): Promise<UserWithRole | null> {
    return this.prisma.users.findUnique({
      where: { username, is_active: true },
      include: {
        account_types: true,
      },
    });
  }

  findOne() {}

  create(dto: CreateUserDto) {}

  update(id: number, dto: UpdateUserDto) {}

  remove(id: number): void {}
}
