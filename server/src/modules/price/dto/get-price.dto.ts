// src/modules/orders/dto/get-orders.dto.ts
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class PriceQueryDto extends PaginationQueryDto {}
