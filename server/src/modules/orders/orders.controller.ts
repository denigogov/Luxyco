import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrdersQueryDto } from './dto/get-order.dto';
import { UpdateOrderPieceDto } from './dto/update-order-piece.dto';
import { AddOrderPieceDto } from './dto/add-order-piece.dto';
import { BulkIdsDto } from '../customers/dto/bulk-delete.dto';
import { BulkCustomerBillPrintDto } from './dto/bulk-customer-bill-print.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Body() dto: CreateOrderDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.ordersService.create(dto, req.user.sub);
  }

  @Post('bulk-data')
  async getBulkCustomerBillData(@Body() dto: BulkCustomerBillPrintDto) {
    return this.ordersService.getBulkCustomerBillData(dto);
  }

  @Get()
  findAll(@Query() query: OrdersQueryDto) {
    // test with: GET /api/orders?page=1&limit=20
    return this.ordersService.findAll(query);
  }

  @Get('references')
  getReferences() {
    return this.ordersService.getOrderReferences();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post('pieces/:id')
  addOrderPiece(
    @Param('id') id: string,
    @Body() dto: AddOrderPieceDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.ordersService.addOrderPiece(id, dto, req.user.sub);
  }

  @Patch(':id/item/:qr')
  updateOrderPiece(
    @Param('id') id: string,
    @Param('qr') qr: string,
    @Body() dto: UpdateOrderPieceDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.ordersService.updateOrderPiece(id, qr, dto, req.user.sub);
  }

  @Delete(':id/item/:qr')
  removeOrderPiece(@Param('id') id: string, @Param('qr') qr: string) {
    return this.ordersService.removeOrderPiece(id, qr);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete('bulk')
  deleteMany(@Body() body: BulkIdsDto) {
    return this.ordersService.deleteMany(body.ids);
  }
}
