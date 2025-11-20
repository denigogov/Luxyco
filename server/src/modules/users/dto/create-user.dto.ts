import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'вмро дете' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  @Matches(/^(admin|superadmin|kopale)$/, {
    message: 'Role must be one of: admin | superadmin | kopale',
  })
  role?: 'admin' | 'superadmin' | 'kopale';
}
