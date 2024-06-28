import express from 'express';

import { type GetUserByEmailController } from '../../use-cases/get-user-by-email/get-user-by-email.controller';
import { type RegisterUserController } from '../../use-cases/registration/register-user.controller';

export class UsersRouter {
  private readonly _router: express.Router;

  constructor(
    private readonly registerUserController: RegisterUserController,
    private readonly getUserByEmailController: GetUserByEmailController,
  ) {
    this._router = express.Router();
    this.setupRoutes();
  }

  get router() {
    return this._router;
  }

  private setupRoutes() {
    this._router.post('/register', (req, res) => this.registerUserController.execute(req, res));
    this._router.get('', (req, res) => this.getUserByEmailController.execute(req, res));
  }
}
