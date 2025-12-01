import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerAddressesService } from './customer-addresses.service';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';

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

  @Patch(':customerId/:addressId')
  update(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() dto: UpdateCustomerAddressDto,
  ) {
    return this.customerAddressesService.update(customerId, addressId, dto);
  }

  @Delete(':customerId/:addressId')
  remove(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    return this.customerAddressesService.remove(customerId, addressId);
  }
}
