// customers/dto/create-customer-full.dto.ts
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';
import { CreateCustomerAddressDto } from '../../customer-addresses/dto/create-customer-address.dto';

export class CreateCustomerFullDto extends CreateCustomerDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCustomerAddressDto)
  address?: CreateCustomerAddressDto;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @Matches(/\S/, { message: 'Note must not be empty or only spaces' })
  noteText?: string;
}
