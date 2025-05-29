import { NextFunction, Request, Response } from 'express';
import { MongoService } from '../services';
import { toRequestUser } from '../lib';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req;
    if (!tenantId) {
      throw new Error('Tenant ID is missing');
    }

    const db = MongoService.getTenantConnection(tenantId);
    const User = db.model('User');

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (await user.comparePassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.status(200).json(toRequestUser(user));
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req;
    if (!tenantId) {
      throw new Error('Tenant ID is missing');
    }

    const db = MongoService.getTenantConnection(tenantId);
    const User = db.model('User');

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password,
    });

    await newUser.save();

    res.status(201).json(toRequestUser(newUser));
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {};

export const me = async (req: Request, res: Response, next: NextFunction) => {};
