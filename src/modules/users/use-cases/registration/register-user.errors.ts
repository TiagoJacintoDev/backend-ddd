import { type UseCaseError } from '@/src/shared/core/UseCaseError';

export class EmailAlreadyInUseError implements UseCaseError {
  code: string;
  message: string;

  constructor(email: string) {
    this.code = 'EmailAlreadyInUse';
    this.message = `The email: "${email}" associated with the account is already in use.`;
  }
}
