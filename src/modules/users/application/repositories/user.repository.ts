import { AsyncMaybe } from '@/src/shared/core/Maybe';
import { type UserEmail } from '../../domain/user-email.value';
import { type User } from '../../domain/user.entity';

export interface UserRepository {
  create(user: User): Promise<void>;
  findByEmail(email: UserEmail): AsyncMaybe<User>;
}
