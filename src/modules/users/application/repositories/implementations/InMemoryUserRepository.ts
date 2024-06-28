import { AsyncMaybe } from '@/src/shared/core/Maybe';
import { type UserEmail } from '../../../domain/user-email.value';
import { type User } from '../../../domain/user.entity';
import { type UserModel } from '../../../infra/database/user.model';
import { type UserPersistenceMapper } from '../../../mappers/user.persistence-mapper';
import { type UserRepository } from '../user.repository';

export class InMemoryUserRepository implements UserRepository {
  private readonly users: UserModel[] = [];

  constructor(private readonly mapper: UserPersistenceMapper) {}

  async create(user: User): Promise<void> {
    this.users.push(await this.mapper.toPersistence(user));
  }

  async findByEmail(email: UserEmail): AsyncMaybe<User> {
    const maybeUser = this.users.find((user) => user.email === email.value);

    return maybeUser ? this.mapper.toDomain(maybeUser) : null;
  }
}
