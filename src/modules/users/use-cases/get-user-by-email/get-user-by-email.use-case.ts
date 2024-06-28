import { type Result, err, ok } from '@/src/shared/core/Result';
import { type UseCase } from '@/src/shared/core/UseCase';
import { type ValidationError } from '@/src/shared/domain/errors/ValidationError';

import { type UserRepository } from '../../application/repositories/user.repository';
import { UserEmail } from '../../domain/user-email.value';
import { type User } from '../../domain/user.entity';
import { UserNotFoundError } from './get-user-by-email.errors';

type Request = {
  email: string;
};

type Response = Result<User, ValidationError | UserNotFoundError>;

export class GetUserByEmailUseCase implements UseCase<Request, Response> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(request: Request): Promise<Response> {
    const emailOrError = UserEmail.create(request.email);

    if (emailOrError.isErr()) return err(emailOrError.error);

    const user = await this.userRepository.findByEmail(emailOrError.value);

    if (!user) return err(new UserNotFoundError(request.email));

    return ok(user);
  }
}
