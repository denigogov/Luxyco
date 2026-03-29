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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersQueryDto } from './dto/get-customers.dto';
import { BulkIdsDto } from './dto/bulk-delete.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCustomerFullDto } from './dto/create-customer-full.dto';
import { JwtPayload } from '../auth/types/jwt-payload.type';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Body() dto: CreateCustomerFullDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.customersService.create(dto, req.user.sub);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('deleted')
  findDeleted(@Query() query: CustomersQueryDto) {
    return this.customersService.findDeleted(query);
  }

  @Delete('restore/:id')
  restoreDeleted(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.restoreDeleted(id);
  }

  @Delete('deleted')
  deleteAllPermanently() {
    return this.customersService.deleteAllPermanently();
  }

  @Delete('deleted/bulk')
  hardDeleteMany(@Body() body: BulkIdsDto) {
    return this.customersService.hardDeleteMany(body.ids);
  }

  @Delete('bulk')
  softDeleteMany(@Body() body: BulkIdsDto) {
    return this.customersService.softDeleteMany(body.ids);
  }

  @Delete('delete/:id')
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.hardDelete(id);
  }

  @Get()
  findAll(@Query() query: CustomersQueryDto) {
    return this.customersService.findAll(query);
  }

  @Get('order')
  findAllForOrder(@Query() query: Pick<CustomersQueryDto, 'id' | 'search'>) {
    return this.customersService.findAllForOrder(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(id);
  }
}
