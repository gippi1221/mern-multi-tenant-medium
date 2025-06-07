import { NextFunction, Request, Response } from 'express';
import { AuthService, UserService } from '../services';
import { toRequestUser } from '../lib';
import { UnauthorizedError } from '../utils/errors';

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await UserService.getUserByEmail(email.toLowerCase(), req.tenantId!);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    await AuthService.generateTokens(res, toRequestUser(user), req.tenantId!);

    res.status(200).json(toRequestUser(user));
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body, req.tenantId!);
    await AuthService.generateTokens(res, toRequestUser(user), req.tenantId!);
    res.status(201).json(toRequestUser(user));
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.clearTokens(req, res, req.tenantId!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AuthService.refreshToken(req, res, req.tenantId!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.getUserById(req.userId!, req.tenantId!);
    res.status(200).json(toRequestUser(user));
  } catch (error) {
    await AuthService.clearTokens(req, res, req.tenantId!);
    next(error);
  }
};
