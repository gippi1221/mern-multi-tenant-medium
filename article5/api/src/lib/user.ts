import { IRequestUser, UserDocument } from '../interfaces';

export function toRequestUser(user: UserDocument): IRequestUser {
  return {
    _id: user._id.toHexString(),
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
