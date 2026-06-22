import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export enum UserTypeFilter {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTION = 'RECEPTION',
  MACHINE_OPERATOR = 'MACHINE_OPERATOR',
  DRIVER = 'DRIVER',
}

export class GetUserDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(UserTypeFilter)
  userType?: UserTypeFilter;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
