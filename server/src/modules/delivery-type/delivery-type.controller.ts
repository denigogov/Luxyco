import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeliveryTypeService } from './delivery-type.service';
import { CreateDeliveryTypeDto } from './dto/create-delivery-type.dto';
import { UpdateDeliveryTypeDto } from './dto/update-delivery-type.dto';
import { type delivery_type } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetDeliveryTypeDto } from './dto/get-delivery-type.dto';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('delivery-type')
export class DeliveryTypeController {
  constructor(private readonly deliveryTypeService: DeliveryTypeService) {}

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post()
  create(@Body() createDeliveryTypeDto: CreateDeliveryTypeDto) {
    return this.deliveryTypeService.create(createDeliveryTypeDto);
  }

  @Get()
  findAll(@Query() query: GetDeliveryTypeDto) {
    return this.deliveryTypeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryTypeService.findOne(+id);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryTypeDto: UpdateDeliveryTypeDto,
  ) {
    return this.deliveryTypeService.update(+id, updateDeliveryTypeDto);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryTypeService.remove(+id);
  }

  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id')
  restore(
    @Param('id') id: string,
    @Body() updateDeliveryTypeDto: UpdateDeliveryTypeDto,
  ) {
    return this.deliveryTypeService.update(+id, updateDeliveryTypeDto);
  }
}
