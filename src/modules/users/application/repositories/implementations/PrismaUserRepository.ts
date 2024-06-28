import { type PrismaClient } from '@prisma/client';

import { type UserEmail } from '../../../domain/user-email.value';
import { type User } from '../../../domain/user.entity';
import { type UserPersistenceMapper } from '../../../mappers/user.persistence-mapper';
import { type UserRepository } from '../user.repository';
import { AsyncMaybe } from '@/src/shared/core/Maybe';

export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mapper: UserPersistenceMapper
  ) {}

  async create(user: User): Promise<void> {
    console.log('PrismaUserRepository.create');

    await this.prisma.user.create({
      data: await this.mapper.toPersistence(user),
    });
  }

  async findByEmail(email: UserEmail): AsyncMaybe<User> {
    const maybeUser = await this.prisma.user.findUnique({
      where: {
        email: email.value,
      },
    });

    return maybeUser ? this.mapper.toDomain(maybeUser) : null;
  }
}
