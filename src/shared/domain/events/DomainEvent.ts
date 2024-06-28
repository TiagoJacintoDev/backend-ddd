import { type UniqueEntityID } from '../UniqueEntityID';

export type DomainEvent = {
  dateTimeOccurred: Date;
  getAggregateId(): UniqueEntityID;
};
