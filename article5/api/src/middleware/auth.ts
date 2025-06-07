import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthService } from '../services';
import { NotFoundError, TokenError, ValidationError } from '../utils/errors';
import { IAccessTokenPayload } from '../interfaces';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!JWT_ACCESS_SECRET) {
      throw new ValidationError('JWT_ACCESS_SECRET is not defined in environment variables');
    }

    const { tenantId } = req;
    if (!tenantId) {
      throw new NotFoundError('Tenant ID is required');
    }

    const token = req.cookies.accessToken;
    if (!token) {
      throw new TokenError('Token is required');
    }

    const jwtSecret = process.env.JWT_ACCESS_SECRET || '';
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload & IAccessTokenPayload;

    if (!decoded?._id) {
      await AuthService.clearTokens(req, res, tenantId);
      return next(new TokenError('Invalid token: User ID not found'));
    }

    if (!decoded?.tenantId || decoded.tenantId !== tenantId) {
      await AuthService.clearTokens(req, res, tenantId);
      return next(new TokenError('Invalid token: Tenant mismatch'));
    }

    req.userId = decoded._id;

    next();
  } catch (error) {
    next(error);
  }
};
