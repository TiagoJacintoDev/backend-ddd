import { type DomainError } from '../DomainError';

export class ValidationError implements DomainError {
  code: string;

  constructor(public readonly message: string) {
    this.code = 'ValidationError';
    Object.freeze(this);
  }
}
