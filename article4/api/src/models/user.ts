import { Schema, model } from 'mongoose';
import { UserDocument } from '../interfaces';
import bcrypt from 'bcrypt';

export const userScema = new Schema<UserDocument>(
  {
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

userScema.pre('save', async function (next) {
  this.email = this.email.toLowerCase();

  if (!this.isModified('password')) {
    next();
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userScema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = model<UserDocument>('User', userScema);
