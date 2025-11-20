// src/modules/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType makes all fields optional (for PATCH)
export class UpdateUserDto extends PartialType(CreateUserDto) {}
