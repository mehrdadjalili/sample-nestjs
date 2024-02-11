import * as bcrypt from 'bcrypt';

export function CreatePasswordHash(password: string) {
  const saltOrRounds = 14;
  return bcrypt.hash(password, saltOrRounds);
}

export function PasswordHashCompare(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
