import { type UseCaseError } from '@/src/shared/core/UseCaseError';

export class UserNotFoundError implements UseCaseError {
  code: string;
  message: string;

  constructor(email: string) {
    this.code = 'UserNotFound';
    this.message = `User with email: "${email}" was not found.`;
  }
}
