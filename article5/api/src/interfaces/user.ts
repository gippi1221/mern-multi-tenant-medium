import { Types, Document } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRequestUser {
  _id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
