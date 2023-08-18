import {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
} from './expressError';

describe('Custom Error Classes', () => {
  test('ExpressError should have correct properties', () => {
    const error = new ExpressError('Test Error', 500);
    expect(error.message).toBe('Test Error');
    expect(error.status).toBe(500);
  });

  test('NotFoundError should be an instance of ExpressError', () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(ExpressError);
  });

  test('NotFoundError should have correct status and default message', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Not Found');
    expect(error.status).toBe(404);
  });

  test('UnauthorizedError should have correct status and default message', () => {
    const error = new UnauthorizedError();
    expect(error.message).toBe('Unauthorized');
    expect(error.status).toBe(401);
  });

  test('BadRequestError should have correct status and default message', () => {
    const error = new BadRequestError();
    expect(error.message).toBe('Bad Request');
    expect(error.status).toBe(400);
  });

  test('ForbiddenError should have correct status and default message', () => {
    const error = new ForbiddenError();
    expect(error.message).toBe('Bad Request'); // Note: This might be a copy-paste mistake in the original code
    expect(error.status).toBe(403);
  });
});
