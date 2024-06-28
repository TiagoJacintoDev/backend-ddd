import { BaseController } from '@/src/shared/infra/http/BaseController';
import type express from 'express';
import { z } from 'zod';

import { UserNotFoundError } from './get-user-by-email.errors';
import { type GetUserByEmailUseCase } from './get-user-by-email.use-case';
import { UserPresentationMapper } from '../../mappers/user.presentation-mapper';

export class GetUserByEmailController extends BaseController {
  constructor(
    private readonly useCase: GetUserByEmailUseCase,
    private readonly presenter: UserPresentationMapper
  ) {
    super();
  }

  async executeImpl(req: express.Request, res: express.Response) {
    const input = z
      .object({
        email: z.string(),
      })
      .parse(req.query);

    const response = await this.useCase.execute(input);

    if (response.isErr()) {
      if (response.error instanceof UserNotFoundError) {
        return this.notFound(res, response.error.message);
      }

      return this.fail(res, response.error.message);
    }

    return this.ok(res, this.presenter.toPresentation(response.value));
  }
}
