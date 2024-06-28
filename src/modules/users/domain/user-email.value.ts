import { type Result, err, ok } from '@/src/shared/core/Result';
import { ValidationError } from '@/src/shared/domain/errors/ValidationError';
import { ValueObject } from '@/src/shared/domain/ValueObject';

type UserEmailProps = {
  value: string;
};

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private static isValidEmail(email: string) {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): Result<UserEmail, ValidationError> {
    if (!this.isValidEmail(email)) {
      return err(new ValidationError('Invalid email'));
    }

    return ok(new UserEmail({ value: this.format(email) }));
  }
}
