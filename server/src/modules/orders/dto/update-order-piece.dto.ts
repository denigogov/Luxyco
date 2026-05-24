import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateOrderPieceDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  width: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  height: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  pieceNote?: string | null;
}
