import { type Result, err, ok } from '@/src/shared/core/Result';
import { ValidationError } from '@/src/shared/domain/errors/ValidationError';
import { ValueObject } from '@/src/shared/domain/ValueObject';
import { type SetOptional } from 'type-fest';

import { type Hasher } from '../application/services/hasher';

export type UserPasswordProps = {
  value: string;
  hashed: boolean;
};

export class UserPassword extends ValueObject<UserPasswordProps> {
  public static minLength = 6;

  get value(): string {
    return this.props.value;
  }

  public async compare(plainTextPassword: string, hasher: Hasher): Promise<boolean> {
    if (this.isAlreadyHashed()) {
      const hashed = this.props.value;

      return hasher.compare(plainTextPassword, hashed);
    }

    return this.props.value === plainTextPassword;
  }

  public async getHashedValue(hasher: Hasher): Promise<string> {
    return this.isAlreadyHashed() ? this.props.value : await hasher.hash(this.props.value);
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public static create(
    props: SetOptional<UserPasswordProps, 'hashed'>
  ): Result<UserPassword, ValidationError> {
    if (!props.hashed && !this.isAppropriateLength(props.value)) {
      return err(new ValidationError(`Password must be ${this.minLength} characters or more.`));
    }

    return ok(
      new UserPassword({
        ...props,
        hashed: props.hashed ?? false,
      })
    );
  }
}
