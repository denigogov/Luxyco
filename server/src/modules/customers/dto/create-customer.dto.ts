import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'First name must not be empty or only spaces' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/\S/, { message: 'Last name must not be empty or only spaces' })
  lastName: string;

  @IsPhoneNumber('MK', {
    message: 'Phone number must be a valid Macedonian phone number',
  })
  phoneNumber: string;
}
