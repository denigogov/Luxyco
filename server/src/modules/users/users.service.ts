// src/modules/users/users.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomersQueryDto } from '../customers/dto/get-customers.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { account_types, Prisma, users } from '@prisma/client';
import { paginate } from 'src/common/utils/pagination.util';
import { GetUserDto } from './dto/get-user.dto';
import * as argon2 from 'argon2';

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

  async create(dto: CreateUserDto) {
    const accountType = await this.prisma.account_types.findFirst({
      where: {
        id: dto.accountTypeId,
        is_active: true,
      },
    });

    if (!accountType) {
      throw new NotFoundException('Account type not found');
    }

    const hashedPassword = await argon2.hash(dto.password);

    try {
      return await this.prisma.users.create({
        data: {
          first_name: dto.firstName.trim(),
          last_name: dto.lastName.trim(),
          username: dto.username.trim(),
          phone_number: dto.phoneNumber.trim(),
          password: hashedPassword,
          account_type_id: dto.accountTypeId,
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          username: true,
          phone_number: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          account_types: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Username or phone number already exists');
      }

      throw error;
    }
  }

  update(id: number, dto: UpdateUserDto) {}

  remove(id: number): void {}
}
