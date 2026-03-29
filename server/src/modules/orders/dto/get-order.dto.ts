// src/modules/orders/dto/get-orders.dto.ts
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class OrdersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  qrCode?: string;

  @IsOptional()
  @MaxLength(20)
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  village?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  deliveryType?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'scheduledFrom must be YYYY-MM-DD',
  })
  scheduledFrom?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'scheduledTo must be YYYY-MM-DD' })
  scheduledTo?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'createdFrom must be YYYY-MM-DD' })
  createdFrom?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'createdTo must be YYYY-MM-DD' })
  createdTo?: string;

  @IsOptional()
  @IsIn(['createdAt', 'scheduledDate'])
  sortBy?: 'createdAt' | 'scheduledDate';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
