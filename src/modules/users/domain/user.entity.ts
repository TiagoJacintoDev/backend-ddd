import { AggregateRoot } from '@/src/shared/domain/AggregateRoot';
import { type UniqueEntityID } from '@/src/shared/domain/UniqueEntityID';

import { UserRegistered } from './events/user-registered.event';
import { type UserEmail } from './user-email.value';
import { type UserPassword } from './user-password.value';

type UserProps = {
  email: UserEmail;
  password: UserPassword;
};

export class User extends AggregateRoot<UserProps> {
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  public static create(props: UserProps, id?: UniqueEntityID): User {
    const user = new User(props, id);

    const isNewUser = !!id === false;

    if (isNewUser) {
      user.addDomainEvent(new UserRegistered(user));
    }

    return user;
  }
}
