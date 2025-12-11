// src/modules/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type AppRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'DRIVER'
  | 'RECEPTION'
  | 'MACHINE_OPERATOR';

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
