import { type Maybe } from '@energy/shared/src/core/Maybe';

import { type AggregateRoot } from '../AggregateRoot';
import { type UniqueEntityID } from '../UniqueEntityID';
import { type DomainEvent } from './DomainEvent';

type EventHandler = (event: DomainEvent) => void;

export class DomainEvents {
  private static handlersMap: Record<string, EventHandler[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  /**
   * @method markAggregateForDispatch
   * @static
   * @desc Called by aggregate root objects that have created domain
   * events to eventually be dispatched when the infrastructure commits
   * the unit of work.
   */

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>): void {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event));
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(id: UniqueEntityID): Maybe<AggregateRoot<unknown>> {
    let found;

    for (const aggregate of this.markedAggregates) {
      if (aggregate.id.equals(id)) {
        found = aggregate;
      }
    }

    return found;
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static register(EventHandler: (event: DomainEvent) => void, eventClassName: string): void {
    if (!Object.prototype.hasOwnProperty.call(this.handlersMap, eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(EventHandler);
  }

  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (Object.prototype.hasOwnProperty.call(this.handlersMap, eventClassName)) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
