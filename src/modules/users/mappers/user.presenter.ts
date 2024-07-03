import { Presenter } from '@/src/shared/core/Presenter';

import { type User } from '../domain/user.entity';
import { UserDTO } from '../dtos/user.dto';

export class UserPresenter extends Presenter<User, UserDTO> {
  toPresentation(user: User): UserDTO {
    return {
      email: user.email.value,
    };
  }
}
