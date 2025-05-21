import { NextFunction, Request, Response } from 'express';
import { TenantService } from '../services';

export const createTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subdomain } = req.body;
    const tenant = await TenantService.createTenant(subdomain);
    res.status(201).json(tenant);
  } catch (error) {
    next(error);
  }
}
