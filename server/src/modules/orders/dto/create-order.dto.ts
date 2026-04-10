import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productTypeId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  pieceNote?: string;
}

export class CreateOrderDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  customerId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  deliveryAddressId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  deliveryTypeId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  serviceTypeId: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  orderStatusId: number;

  @IsDateString()
  @IsOptional()
  scheduledDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  orderNote?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
