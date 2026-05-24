import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class AddOrderPieceDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  productTypeId: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  pieceNote?: string | null;
}
