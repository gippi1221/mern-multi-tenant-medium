import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request } from 'express';
import { IRequestUser } from '../interfaces';
import { NotFoundError, TokenExpired, ValidationError } from '../utils/errors';
import { MongoService } from '.';
import { toRequestUser } from '../lib';

const isProduction = process.env.NODE_ENV === 'production';
const DOMAIN = isProduction ? '.yourproductiondomain.com' : '.localhost.test';

class AuthService {
  async generateTokens(res: Response, user: IRequestUser, tenantId: string): Promise<void> {
    const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    if (!jwtAccessSecret) {
      throw new ValidationError('JWT_ACCESS_SECRET not found in environment variables');
    }

    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    if (!jwtRefreshSecret) {
      throw new ValidationError('JWT_REFRESH_SECRET not found in environment variables');
    }

    const accessToken = jwt.sign(user, jwtAccessSecret, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign({ userId: user._id }, jwtRefreshSecret, {
      expiresIn: '7d',
    });

    const db = MongoService.getTenantConnection(tenantId);
    const RefreshToken = db.model('RefreshToken');

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lastUsedAt: new Date(),
      effectiveUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      domain: DOMAIN,
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: DOMAIN,
      path: '/',
    });
  }

  async clearTokens(req: Request, res: Response, tenantId: string): Promise<void> {
    res.clearCookie('accessToken', {
      domain: DOMAIN,
      path: '/',
    });
    res.clearCookie('refreshToken', {
      domain: DOMAIN,
      path: '/',
    });

    const db = MongoService.getTenantConnection(tenantId);
    const RefreshToken = db.model('RefreshToken');

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { revokedAt: new Date(), effectiveUntil: new Date() }
      );
    }
  }

  async refreshToken(req: Request, res: Response, tenantId: string): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new TokenExpired('No refresh token provided');
    }

    const db = MongoService.getTenantConnection(tenantId);
    const RefreshToken = db.model('RefreshToken');
    const User = db.model('User');

    const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!refreshTokenDoc) {
      await this.clearTokens(req, res, tenantId);
      throw new TokenExpired('Invalid refresh token');
    }

    if (new Date(refreshTokenDoc.revokedAt).getTime() < new Date().getTime()) {
      await this.clearTokens(req, res, tenantId);
      throw new TokenExpired('Refresh token expired');
    }

    if (new Date(refreshTokenDoc.expiresAt).getTime() < new Date().getTime()) {
      await this.clearTokens(req, res, tenantId);
      throw new TokenExpired('Refresh token expired');
    }

    const jwtSecret = process.env.JWT_REFRESH_SECRET ?? '';
    const decoded = jwt.verify(refreshToken, jwtSecret) as JwtPayload;

    if (!decoded.userId) {
      await this.clearTokens(req, res, tenantId);
      throw new TokenExpired('Invalid token: User ID not found');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      await this.clearTokens(req, res, tenantId);
      throw new NotFoundError('User not found');
    }

    await RefreshToken.findOneAndUpdate(
      { token: refreshToken },
      { revokedAt: new Date(), effectiveUntil: new Date() }
    );

    await this.generateTokens(res, toRequestUser(user), tenantId);
  }
}

export default new AuthService();
