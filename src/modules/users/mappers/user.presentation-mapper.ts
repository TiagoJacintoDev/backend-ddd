import { PresentationMapper } from '@/src/shared/core/PresentationMapper';

import { type User } from '../domain/user.entity';
import { UserDTO } from '../dtos/user.dto';

export class UserPresentationMapper extends PresentationMapper<User, UserDTO> {
  toPresentation(user: User): UserDTO {
    return {
      email: user.email.value,
    };
  }
}
