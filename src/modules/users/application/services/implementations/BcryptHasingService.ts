import * as bcrypt from 'bcrypt';

import { type HashingService } from '../hashing.service';

export class BcryptHashingService implements HashingService {
  hash(value: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
  }

  compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}
