import type * as express from 'express';

export abstract class BaseController {
  protected abstract executeImpl(req: express.Request, res: express.Response): Promise<unknown>;

  public async execute(req: express.Request, res: express.Response): Promise<void> {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      console.log(`[BaseController]: Uncaught controller error`);
      console.log(err);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static successResponse<T>(res: express.Response, code: number, data?: T) {
    res.type('application/json');

    const response = {
      success: true,
      data,
    };

    return res.status(code).json(response);
  }

  public static errorResponse(res: express.Response, code: number, error: string) {
    const response = {
      success: false,
      error: error,
    };

    return res.status(code).json(response);
  }

  public ok(res: express.Response, dto: unknown) {
    return BaseController.successResponse(res, 200, dto);
  }

  public created(res: express.Response) {
    return BaseController.successResponse(res, 201);
  }

  public clientError(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 400, message ?? 'Unauthorized');
  }

  public unauthorized(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 401, message ?? 'Unauthorized');
  }

  public paymentRequired(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 402, message ?? 'Payment required');
  }

  public forbidden(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 403, message ?? 'Forbidden');
  }

  public notFound(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 404, message ?? 'Not found');
  }

  public conflict(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 409, message ?? 'Conflict');
  }

  public tooMany(res: express.Response, message?: string) {
    return BaseController.errorResponse(res, 429, message ?? 'Too many requests');
  }

  public todo(res: express.Response) {
    return BaseController.errorResponse(res, 400, 'TODO');
  }

  public fail(res: express.Response, error: Error | string) {
    console.log(error);
    return BaseController.errorResponse(res, 500, error.toString());
  }
}
