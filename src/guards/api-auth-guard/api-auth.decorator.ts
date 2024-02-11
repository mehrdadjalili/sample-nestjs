import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const USER_ROLE_KEY = 'USER_ROLE';

export const Roles = (...roles: UserRole[]) => 
  SetMetadata(USER_ROLE_KEY, roles);
