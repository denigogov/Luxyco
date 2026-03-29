import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersCreateService {
  constructor(private readonly prisma: PrismaService) {}

  private generateQrCode(): string {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `ORD-${Date.now()}-${random}`;
  }

  private generateLabelCode(orderQrCode: string, pieceIndex: number): string {
    return `${orderQrCode}-P${pieceIndex}`;
  }

  private async generateUniqueQrCode(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const qrCode = this.generateQrCode();
      const exists = await this.prisma.orders.findUnique({
        where: { qr_code: qrCode },
        select: { id: true },
      });
      if (!exists) return qrCode;
    }
    throw new Error('Failed to generate a unique QR code after 10 attempts');
  }

  private async validateCustomer(customerId: number): Promise<void> {
    const customer = await this.prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, is_active: true },
    });

    if (!customer || !customer.is_active) {
      throw new NotFoundException(
        `Customer with id ${customerId} not found or inactive`,
      );
    }
  }

  private async validateDeliveryType(deliveryTypeId: number): Promise<number> {
    const deliveryType = await this.prisma.delivery_type.findFirst({
      where: { id: deliveryTypeId, is_active: true },
      select: { id: true },
    });

    if (!deliveryType) {
      throw new NotFoundException(
        `Delivery type ${deliveryTypeId} not found or inactive`,
      );
    }

    return deliveryType.id;
  }

  private async validateAddress(
    deliveryAddressId: number | null | undefined,
    customerId: number,
    isDelivery: boolean,
  ): Promise<void> {
    // No address needed for PICKUP
    if (!isDelivery) return;

    if (!deliveryAddressId) {
      throw new BadRequestException(
        'A delivery address is required for DELIVERY orders',
      );
    }

    const address = await this.prisma.customer_addresses.findFirst({
      where: {
        id: deliveryAddressId,
        customer_id: customerId,
        is_active: true,
      },
      select: { id: true },
    });

    if (!address) {
      throw new NotFoundException(
        `Address ${deliveryAddressId} not found for customer ${customerId}`,
      );
    }
  }

  private async validateProductTypes(productTypeIds: number[]): Promise<void> {
    const productTypes = await this.prisma.product_types.findMany({
      where: { id: { in: productTypeIds }, is_active: true },
      select: { id: true },
    });

    if (productTypes.length !== productTypeIds.length) {
      throw new BadRequestException(
        'One or more product types are missing or inactive',
      );
    }
  }

  private async getPendingStatusId(): Promise<number> {
    const status = await this.prisma.status.findFirst({
      where: { id: 1, is_active: true },
      select: { id: true },
    });

    if (!status) {
      throw new NotFoundException('PENDING status not found in the database');
    }

    return status.id;
  }

  // ─── Main Create ─────────────────────────────────────────────────────────────

  async create(dto: CreateOrderDto, userId: number) {
    if (!dto.items?.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    await this.validateCustomer(dto.customerId);

    const deliveryTypeId = await this.validateDeliveryType(dto.deliveryTypeId);
    const isDelivery = deliveryTypeId !== 1;

    await this.validateAddress(
      dto.deliveryAddressId,
      dto.customerId,
      isDelivery,
    );

    // 4) Validate product types (deduplicated)
    const productTypeIds = [
      ...new Set(dto.items.map((item) => item.productTypeId)),
    ];
    await this.validateProductTypes(productTypeIds);

    // 5) Always start with PENDING — never trust the client for this
    const pendingStatusId = await this.getPendingStatusId();

    // 6) Calculate total pieces
    const totalPieces = dto.items.reduce((sum, item) => sum + item.quantity, 0);

    // 7) Generate unique QR code BEFORE the transaction
    const qrCode = await this.generateUniqueQrCode();

    // 8) Build all piece rows in memory before the transaction
    let pieceIndex = 1;
    const piecesData: Prisma.order_piecesCreateManyInput[] = [];

    for (const item of dto.items) {
      for (let i = 0; i < item.quantity; i++) {
        piecesData.push({
          order_id: 0, // will be overwritten after order is created
          piece_index: pieceIndex,
          label_code: this.generateLabelCode(qrCode, pieceIndex),
          product_type_id: item.productTypeId,
          width: null,
          height: null,
          price: new Prisma.Decimal(0),
          piece_note: item.pieceNote?.trim() || null,
        });
        pieceIndex++;
      }
    }

    // 9) Create order + pieces in a single transaction (2 DB calls total)
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          qr_code: qrCode,
          customer_id: dto.customerId,
          delivery_address_id: isDelivery ? dto.deliveryAddressId : null,
          delivery_type_id: dto.deliveryTypeId,
          order_status_id: pendingStatusId,
          created_by_user_id: userId,
          scheduled_date: new Date(dto.scheduledDate),
          total_pieces: totalPieces,
          measured_pieces: 0,
          total_price: new Prisma.Decimal(0),
          order_note: dto.orderNote?.trim() || null,
        },
      });

      // Single bulk insert — regardless of piece count
      await tx.order_pieces.createMany({
        data: piecesData.map((piece) => ({
          ...piece,
          order_id: order.id,
        })),
      });

      return tx.orders.findUnique({
        where: { id: order.id },
        include: {
          customers: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              phone_number: true,
            },
          },
          customer_addresses: {
            select: {
              id: true,
              street: true,
              city: true,
              postal_code: true,
              country: true,
              formatted_address: true,
            },
          },
          delivery_type: {
            select: {
              id: true,
              type_name: true,
              price: true,
            },
          },
          status: {
            select: {
              id: true,
              status_name: true,
            },
          },
          order_pieces: {
            select: {
              id: true,
              piece_index: true,
              label_code: true,
              width: true,
              height: true,
              price: true,
              piece_note: true,
              product_types: {
                select: {
                  id: true,
                  name: true,
                  base_price: true,
                },
              },
            },
            orderBy: { piece_index: 'asc' },
          },
        },
      });
    });
  }
}
