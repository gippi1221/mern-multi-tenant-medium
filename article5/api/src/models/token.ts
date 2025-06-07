import { Schema, model } from 'mongoose';
import { RefreshTokenDocument } from '../interfaces';

export const refreshTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date },
    lastUsedAt: { type: Date, required: true },
    effectiveUntil: { type: Date, required: true },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

refreshTokenSchema.index({ effectiveUntil: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 1 });

export const RefreshToken = model<RefreshTokenDocument>('RefreshToken', refreshTokenSchema);
