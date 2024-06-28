import { type DomainEvent } from '@/src/shared/domain/events/DomainEvent';
import { type UniqueEntityID } from '@/src/shared/domain/UniqueEntityID';

import { type User } from '../user.entity';

export class UserRegistered implements DomainEvent {
  dateTimeOccurred: Date;
  user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }
}
