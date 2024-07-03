import * as bcrypt from 'bcrypt';

import { type Hasher } from '../hasher';

export class BcryptHasher implements Hasher {
  hash(value: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
  }

  compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
