import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDeliveryTypeDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  typeName: string;

  @Type(() => Number)
  @IsDecimal()
  price: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
