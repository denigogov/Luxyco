import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/database/prisma.service';
import { UpdateOrderPieceDto } from './dto/update-order-piece.dto';
import { AddOrderPieceItemDto } from './dto/add-order-piece.dto';

const PENDING_STATUS_ID = 1;
const MEASURING_STATUS_ID = 2;
const WAITING_FOR_DELIVERY_STATUS_ID = 3;
const TAKEAWAY_STATUS_ID = 7;
const DELIVERY_TYPE_ID = 1;

@Injectable()
export class OrderPieceUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  private generateLabelCode(orderQrCode: string, pieceIndex: number): string {
    return `${orderQrCode}-P${pieceIndex}`;
  }

  private async findOrder(orderIdentifier: number | string) {
    const value = String(orderIdentifier);
    const isNumericId = /^\d+$/.test(value);

    const order = await this.prisma.orders.findUnique({
      where: isNumericId ? { id: Number(value) } : { qr_code: value },
      select: {
        id: true,
        qr_code: true,
        customer_id: true,
        total_pieces: true,
        order_status_id: true,
        delivery_type_id: true,
        delivery_type: {
          select: {
            price: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order ${value} not found`);
    }

    return order;
  }

  private async writeStatusHistoryIfChanged(
    tx: Prisma.TransactionClient,
    orderId: number,
    previousStatusId: number | null,
    nextStatusId: number | null | undefined,
    userId: number,
  ) {
    if (
      nextStatusId === undefined ||
      nextStatusId === null ||
      nextStatusId === previousStatusId
    ) {
      return;
    }

    await tx.order_status_history.create({
      data: {
        order_id: orderId,
        status_id: nextStatusId,
        changed_by_user_id: userId,
      },
    });
  }

  private getNextStatusId(args: {
    orderStatusId: number | null;
    measuredPieces: number;
    totalPieces: number;
    deliveryTypeId: number | null;
  }) {
    const orderStatusId = args.orderStatusId ?? PENDING_STATUS_ID;

    if (orderStatusId >= 4) {
      return undefined;
    }

    const isFullyMeasured =
      args.totalPieces > 0 && args.measuredPieces === args.totalPieces;

    if (isFullyMeasured) {
      const readyStatusId =
        args.deliveryTypeId === DELIVERY_TYPE_ID
          ? TAKEAWAY_STATUS_ID
          : WAITING_FOR_DELIVERY_STATUS_ID;

      if (orderStatusId !== readyStatusId) {
        return readyStatusId;
      }

      return undefined;
    }

    if (isFullyMeasured && orderStatusId !== WAITING_FOR_DELIVERY_STATUS_ID) {
      return WAITING_FOR_DELIVERY_STATUS_ID;
    }

    if (!isFullyMeasured && args.measuredPieces > 0) {
      if (orderStatusId !== MEASURING_STATUS_ID) {
        return MEASURING_STATUS_ID;
      }
    }

    return undefined;
  }

  private async recalculateOrder(
    tx: Prisma.TransactionClient,
    order: {
      id: number;
      customer_id: number | null;
      order_status_id: number | null;
      delivery_type_id: number | null;
      delivery_type: {
        price: Prisma.Decimal | number | string | null;
      } | null;
    },
  ) {
    const totalPieces = await tx.order_pieces.count({
      where: {
        order_id: order.id,
      },
    });

    const measuredPieces = await tx.order_pieces.count({
      where: {
        order_id: order.id,
        OR: [
          {
            product_types: {
              price_model: {
                name: 'PER_PIECE',
              },
            },
          },
          {
            AND: [
              {
                width: {
                  not: null,
                },
              },
              {
                height: {
                  not: null,
                },
              },
            ],
          },
        ],
      },
    });

    const piecesTotal = await tx.order_pieces.aggregate({
      where: {
        order_id: order.id,
      },
      _sum: {
        price: true,
      },
    });

    const piecesPrice = new Prisma.Decimal(piecesTotal._sum.price ?? 0);
    const deliveryPrice = new Prisma.Decimal(order.delivery_type?.price ?? 0);
    const totalPrice = piecesPrice.plus(deliveryPrice);

    const nextStatusId = this.getNextStatusId({
      orderStatusId: order.order_status_id,
      measuredPieces,
      totalPieces,
      deliveryTypeId: order.delivery_type_id,
    });

    await tx.orders.update({
      where: {
        id: order.id,
      },
      data: {
        total_pieces: totalPieces,
        measured_pieces: measuredPieces,
        total_price: totalPrice,

        ...(nextStatusId !== undefined && {
          order_status_id: nextStatusId,
        }),
      },
    });

    return {
      totalPieces,
      measuredPieces,
      totalPrice,
      nextStatusId,
    };
  }

  // Takes ONE item (called in a loop from the service above)
  async addPiece(
    orderIdentifier: number | string,
    dto: AddOrderPieceItemDto,
    userId: number,
  ) {
    const order = await this.findOrder(orderIdentifier);

    const productType = await this.prisma.product_types.findFirst({
      where: { id: dto.productTypeId, is_active: true },
      select: {
        id: true,
        base_price: true,
        price_model: { select: { name: true } },
      },
    });

    if (!productType) {
      throw new NotFoundException(
        `Product type ${dto.productTypeId} not found or inactive`,
      );
    }

    const maxPiece = await this.prisma.order_pieces.aggregate({
      where: { order_id: order.id },
      _max: { piece_index: true },
    });

    const nextPieceIndex = (maxPiece._max.piece_index ?? 0) + 1;
    const labelCode = this.generateLabelCode(order.qr_code, nextPieceIndex);
    const isPerPiece = productType.price_model.name === 'PER_PIECE';
    const piecePrice = isPerPiece
      ? new Prisma.Decimal(productType.base_price ?? 0)
      : new Prisma.Decimal(0);

    return this.prisma.$transaction(async (tx) => {
      const createdPiece = await tx.order_pieces.create({
        data: {
          order_id: order.id,
          piece_index: nextPieceIndex,
          label_code: labelCode,
          product_type_id: productType.id,
          width: null,
          height: null,
          price: piecePrice,
          piece_note: dto.pieceNote?.trim() || null,
          measured_by_user_id: isPerPiece ? userId : null,
          measured_at: isPerPiece ? new Date() : null,
        },
        select: { id: true, label_code: true },
      });

      await tx.orders.update({
        where: { id: order.id },
        data: { order_status_id: 1 },
      });

      const recalculated = await this.recalculateOrder(tx, order);
      const finalStatusId = recalculated.nextStatusId ?? PENDING_STATUS_ID;
      await this.writeStatusHistoryIfChanged(
        tx,
        order.id,
        order.order_status_id,
        finalStatusId,
        userId,
      );
      return {
        orderId: order.id,
        customerId: order.customer_id,
        pieceId: createdPiece.id,
        pieceQr: createdPiece.label_code,
        ...recalculated,
      };
    });
  }

  async updatePiece(
    orderIdentifier: number | string,
    pieceQr: string,
    dto: UpdateOrderPieceDto,
    userId: number,
  ) {
    const order = await this.findOrder(orderIdentifier);
    const value = String(orderIdentifier);

    const piece = await this.prisma.order_pieces.findUnique({
      where: {
        label_code: pieceQr,
      },
      select: {
        id: true,
        order_id: true,
        product_types: {
          select: {
            base_price: true,
            price_model: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!piece) {
      throw new NotFoundException(`Piece ${pieceQr} not found`);
    }

    if (piece.order_id !== order.id) {
      throw new BadRequestException(
        `Piece ${pieceQr} does not belong to order ${value}`,
      );
    }

    const priceModel = piece.product_types?.price_model?.name;

    if (priceModel !== 'PER_M2') {
      throw new BadRequestException(
        'Only PER_M2 pieces can be updated with dimensions',
      );
    }

    const width = new Prisma.Decimal(dto.width);
    const height = new Prisma.Decimal(dto.height);
    const basePrice = new Prisma.Decimal(piece.product_types?.base_price ?? 0);

    const piecePrice = width.mul(height).mul(basePrice);

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.order_pieces.update({
        where: {
          id: piece.id,
        },
        data: {
          width,
          height,
          price: piecePrice,
          piece_note: dto.pieceNote?.trim() || null,
          measured_by_user_id: userId,
          measured_at: new Date(),
        },
      });

      const recalculated = await this.recalculateOrder(tx, order);

      await this.writeStatusHistoryIfChanged(
        tx,
        order.id,
        order.order_status_id,
        recalculated.nextStatusId,
        userId,
      );

      return {
        orderId: order.id,
        customerId: order.customer_id,
        pieceId: piece.id,
        pieceQr,
        ...recalculated,
      };
    });

    return result;
  }

  async removePiece(
    orderIdentifier: number | string,
    pieceQr: string,
    userId: number,
  ) {
    const order = await this.findOrder(orderIdentifier);
    const value = String(orderIdentifier);

    const piece = await this.prisma.order_pieces.findUnique({
      where: {
        label_code: pieceQr,
      },
      select: {
        id: true,
        order_id: true,
      },
    });

    if (!piece) {
      throw new NotFoundException(`Piece ${pieceQr} not found`);
    }

    if (piece.order_id !== order.id) {
      throw new BadRequestException(
        `Piece ${pieceQr} does not belong to order ${value}`,
      );
    }

    const piecesCount = await this.prisma.order_pieces.count({
      where: {
        order_id: order.id,
      },
    });

    if (piecesCount <= 1) {
      throw new BadRequestException('Order must contain at least one piece');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.order_pieces.delete({
        where: {
          id: piece.id,
        },
      });

      const recalculated = await this.recalculateOrder(tx, order);

      await this.writeStatusHistoryIfChanged(
        tx,
        order.id,
        order.order_status_id,
        recalculated.nextStatusId,
        userId,
      );
      return {
        orderId: order.id,
        customerId: order.customer_id,
        deletedPieceId: piece.id,
        deletedPieceQr: pieceQr,
        ...recalculated,
      };
    });

    return result;
  }
}
