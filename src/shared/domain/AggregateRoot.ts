import { Entity } from './Entity';
import { type DomainEvent } from './events/DomainEvent';
import { DomainEvents } from './events/DomainEvents';
import { type UniqueEntityID } from './UniqueEntityID';

export abstract class AggregateRoot<T> extends Entity<T> {
  private readonly _domainEvents: DomainEvent[] = [];

  get id(): UniqueEntityID {
    return this._id;
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
    this.logDomainEventAdded(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents.splice(0, this._domainEvents.length);
  }

  private logDomainEventAdded(domainEvent: DomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this)!;
    const domainEventClass = Reflect.getPrototypeOf(domainEvent)!;

    console.info(
      `[Domain Event Created]: ${thisClass.constructor.name} ==> ${domainEventClass.constructor.name}`,
    );
  }
}
