import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

// Single item shape
export class AddOrderPieceItemDto {
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
  pieceNote?: string | null;
}

// Wrapper that the controller receives
export class AddOrderPieceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOrderPieceItemDto)
  items: AddOrderPieceItemDto[];
}
