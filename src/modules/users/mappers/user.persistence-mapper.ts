import { PersistenceMapper } from '@/src/shared/core/PersistenceMapper';
import { UniqueEntityID } from '@/src/shared/domain/UniqueEntityID';

import { type HashingService } from '../application/services/hashing.service';
import { UserEmail } from '../domain/user-email.value';
import { UserPassword } from '../domain/user-password.value';
import { User } from '../domain/user.entity';
import { type UserModel } from '../infra/database/user.model';

export class UserPersistenceMapper extends PersistenceMapper<User, UserModel> {
  constructor(private readonly hashingService: HashingService) {
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
    const hashedPassword = await user.password.getHashedValue(this.hashingService);

    return {
      id: user.id.toString(),
      email: user.email.value,
      password: hashedPassword,
    };
  }
}
