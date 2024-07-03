import { type Promisable } from 'type-fest';

export abstract class Mapper<TDomain, TPersistence> {
  protected abstract toDomain(model: TPersistence): TDomain;
  protected abstract toPersistence(domainObject: TDomain): Promisable<TPersistence>;
}
