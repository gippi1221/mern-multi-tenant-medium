import { ApiError } from './ApiError';

export class UnauthorizedError extends ApiError {
  constructor(details: any) {
    super(403, 'Authentication failed', details);
  }
}
