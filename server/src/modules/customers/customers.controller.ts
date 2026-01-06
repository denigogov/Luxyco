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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() dto: CreateCustomerFullDto) {
    return this.customersService.create(dto);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('deleted')
  findDeleted(@Query() query: CustomersQueryDto) {
    return this.customersService.findDeleted(query);
  }

  @Patch('deleted/:id')
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

  @Delete('deleted/:id')
  hardDelete(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.hardDelete(id);
  }

  @Get()
  findAll(@Query() query: CustomersQueryDto) {
    return this.customersService.findAll(query);
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
