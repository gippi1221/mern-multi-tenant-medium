import { ApiError } from './ApiError';

export class TokenExpired extends ApiError {
  constructor(details: any) {
    super(409, 'Auth token expired', details);
  }
}

export class TokenError extends ApiError {
  constructor(details: any) {
    super(401, 'Auth token invalid', details);
  }
}
