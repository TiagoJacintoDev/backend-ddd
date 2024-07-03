import { Mapper } from '@/src/shared/core/Mapper';
import { UniqueEntityID } from '@/src/shared/domain/UniqueEntityID';

import { type Hasher } from '../application/services/hasher';
import { UserEmail } from '../domain/user-email.value';
import { UserPassword } from '../domain/user-password.value';
import { User } from '../domain/user.entity';
import { type UserModel } from '../infra/database/user.model';

export class UserMapper extends Mapper<User, UserModel> {
  constructor(private readonly hasher: Hasher) {
    super();
  }

  toDomain(model: UserModel): User {
    const emailOrError = UserEmail.create(model.email);
    const passwordOrError = UserPassword.create({ value: model.password, hashed: true });
    const userId = new UniqueEntityID(model.id);

    return User.create(
      {
        email: emailOrError.unwrapValue(),
        password: passwordOrError.unwrapValue(),
      },
      userId
    );
  }

  async toPersistence(user: User): Promise<UserModel> {
    const hashedPassword = await user.password.getHashedValue(this.hasher);

    return {
      id: user.id.toString(),
      email: user.email.value,
      password: hashedPassword,
    };
  }
}
