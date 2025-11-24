import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'First name must not be empty or only spaces' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'Last name must not be empty or only spaces' })
  last_name: string;

  @IsPhoneNumber('MK', {
    message: 'Phone number must be a valid Macedonian phone number',
  })
  phone: string;
}
