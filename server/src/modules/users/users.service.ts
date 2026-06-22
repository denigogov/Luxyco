// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomersQueryDto } from '../customers/dto/get-customers.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { account_types, Prisma, users } from '@prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { GetUserDto } from './dto/get-user.dto';

export type UserWithRole = users & { account_types: account_types | null };
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetUserDto) {
    const where: Prisma.usersWhereInput = {
      is_active: query.active ?? true,
    };

    if (query.userType) {
      where.account_types = {
        name: query.userType,
      };
    }

    const args: Prisma.usersFindManyArgs = {
      where,

      omit: {
        password: true,
        account_type_id: true,
        is_active: true,
      },

      include: {
        account_types: {
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

    return paginate(this.prisma.users as any, args, query);
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
