import { NextFunction, Request, Response } from 'express';
import { Tenant } from '../models';

export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subdomain } = req.body;

    const existingTenant = await Tenant.findOne({ subdomain });
    if (existingTenant) {
      throw new Error('Tenant already exists');
    }

    const newTenant = await Tenant.create({ subdomain });

    res.status(201).json(newTenant);
  } catch (error) {
    next(error);
  }
}