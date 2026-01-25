import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';
import { UpdateCustomerNoteDto } from './dto/update-customer-note.dto';
import { PrismaService } from 'src/infrastructure/database/prisma.service';

@Injectable()
export class CustomerNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    customerId: number,
    userId: number,
    dto: CreateCustomerNoteDto,
    test: any,
  ) {
    return this.prisma.customer_notes.create({
      data: {
        customer_id: customerId,
        created_by_user_id: userId,
        related_order_id: dto.relatedOrderId ?? null,
        note_text: dto.noteText + test.sub,
      },
    });
  }

  findAll() {
    return this.prisma.customer_notes.findMany({
      where: {
        is_active: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.customer_notes.findMany({
      where: {
        is_active: true,
        customer_id: id,
      },
    });
  }

  async update(id: number, dto: UpdateCustomerNoteDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    const existing = await this.prisma.customer_notes.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    const updateUser = await this.prisma.customer_notes.update({
      where: { id },
      data: {
        note_text: dto.noteText ?? undefined,
      },
    });

    return updateUser;
  }

  async remove(id: number) {
    const existing = await this.prisma.customer_notes.findUnique({
      where: { id },
      select: { id: true, is_active: true },
    });

    if (!existing || !existing.is_active) {
      throw new NotFoundException(
        `Note with id ${id} not found or already inactive`,
      );
    }

    await this.prisma.customer_notes.update({
      where: { id },
      data: { is_active: false },
    });

    return {
      success: true,
    };
  }
}
