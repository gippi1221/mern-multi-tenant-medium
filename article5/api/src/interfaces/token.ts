import { Types, Document } from 'mongoose';
import { IRequestUser } from './user';

export interface IRefreshToken {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  revokedAt: Date;
  effectiveUntil: Date;
}

export interface RefreshTokenDocument extends IRefreshToken, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccessTokenPayload extends IRequestUser {
  tenantId: string;
}
