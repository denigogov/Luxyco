import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customer-addresses')
export class CustomerAddressesController {
  constructor(
    private readonly customerAddressesService: CustomerAddressesService,
  ) {}

  @Get()
  findAll() {
    return this.customerAddressesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerAddressesService.findOne(+id);
  }

  @Post(':customerId')
  create(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() dto: CreateCustomerAddressDto,
  ) {
    return this.customerAddressesService.create(customerId, dto);
  }

  @Patch(':addressId')
  update(
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() dto: UpdateCustomerAddressDto,
  ) {
    return this.customerAddressesService.update(addressId, dto);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':customerId/:addressId')
  remove(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    return this.customerAddressesService.remove(customerId, addressId);
  }
}
