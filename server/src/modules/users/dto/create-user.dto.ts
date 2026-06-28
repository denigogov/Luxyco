import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[0-9\s-]{6,20}$/, {
    message: 'Phone number is not valid',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Лозинката мора да има најмалку 6 карактери',
  })
  @Matches(/^(?=.*(?:\d|[^A-Za-z0-9\s])).{6,64}$/, {
    message: 'Лозинката мора да содржи барем еден број или специјален карактер',
  })
  password: string;

  // easiest for now: frontend sends the account type id
  @Type(() => Number)
  @IsInt()
  accountTypeId: number;
}
