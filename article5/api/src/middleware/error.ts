import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
import mongoose from 'mongoose';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ApiError) {
    res.status(err.status).json({
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  if (err.code === 11000) {
    res.status(400).json({
      message: 'Duplicate key error',
      keyValue: err.keyValue,
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`,
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: 'Validation error',
      details: Object.values(err.errors).map((e: any) => ({
        path: e.path,
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
