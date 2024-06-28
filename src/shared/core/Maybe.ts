import { Nothing } from './Nothing';

export type Maybe<T> = T | Nothing;
export type AsyncMaybe<T> = Promise<Maybe<T>>;
