import { Result, err, ok } from '@/src/shared/core/Result';
import { type UseCase } from '@/src/shared/core/UseCase';
import { type ValidationError } from '@/src/shared/domain/errors/ValidationError';

import { type UserRepository } from '../../application/repositories/user.repository';
import { UserEmail } from '../../domain/user-email.value';
import { UserPassword } from '../../domain/user-password.value';
import { User } from '../../domain/user.entity';
import { EmailAlreadyInUseError } from './register-user.errors';

type Request = {
  email: string;
  password: string;
};

type Response = Result<User, ValidationError | EmailAlreadyInUseError>;

export class RegisterUserUseCase implements UseCase<Request, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: Request): Promise<Response> {
    const emailOrError = UserEmail.create(request.email);
    const passwordOrError = UserPassword.create({
      value: request.password,
    });

    const payloadResult = Result.combine([emailOrError, passwordOrError]);

    if (payloadResult.isErr()) return err(payloadResult.error);

    const email = emailOrError.unwrapValue();
    const password = passwordOrError.unwrapValue();

    const existingUserByEmail = await this.userRepository.findByEmail(email);

    if (existingUserByEmail)
      return err(new EmailAlreadyInUseError(existingUserByEmail.email.value));

    const user = User.create({
      email,
      password,
    });

    await this.userRepository.create(user);

    return ok(user);
  }
}
