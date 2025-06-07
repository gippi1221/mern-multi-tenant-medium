import { ApiError } from './ApiError';

export class ValidationError extends ApiError {
  constructor(details: any) {
    super(400, 'Validation failed', details);
  }
}
