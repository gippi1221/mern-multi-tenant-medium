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
};

export const getTenantBySubdomain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subdomain } = req.params;
    const tenant = await TenantService.getTenantBySubdomain(subdomain);

    if (!tenant) {
      res.status(404).json({ message: 'Tenant not found' });
      return;
    }

    res.status(200).json(tenant);
  } catch (error) {
    next(error);
  }
};
