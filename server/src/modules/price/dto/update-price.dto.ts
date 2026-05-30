import { PartialType } from '@nestjs/mapped-types';
import { CreatePriceDto } from './create-price.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePriceDto extends PartialType(CreatePriceDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
