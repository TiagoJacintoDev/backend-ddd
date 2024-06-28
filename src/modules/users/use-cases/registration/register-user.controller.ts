import { BaseController } from '@/src/shared/infra/http/BaseController';
import type express from 'express';
import { z } from 'zod';

import { EmailAlreadyInUseError } from './register-user.errors';
import { type RegisterUserUseCase } from './register-user.use-case';

export class RegisterUserController extends BaseController {
  constructor(private readonly useCase: RegisterUserUseCase) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const input = z
      .object({
        email: z.string(),
        password: z.string(),
      })
      .parse(req.body);

    const response = await this.useCase.execute(input);

    if (response.isErr()) {
      if (response.error instanceof EmailAlreadyInUseError) {
        return this.conflict(res, response.error.code);
      }

      return this.fail(res, response.error.code);
    }

    return this.created(res);
  }
}
