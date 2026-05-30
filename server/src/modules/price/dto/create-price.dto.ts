import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePriceDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsDecimal()
  @IsNotEmpty()
  basePrice: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  priceModelId: number;
}
