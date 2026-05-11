import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  customerId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  deliveryAddressId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  deliveryTypeId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  serviceTypeId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  orderStatusId?: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  orderNote?: string;
}
