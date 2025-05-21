import { Request, Response, NextFunction } from 'express';
import { MongoService, TenantService } from '../services';
import { bookSchema } from '../models';

export const extractTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const host = req.headers.host;
    if (!host) {
      throw new Error('Host header is missing');
    }
  
    const subdomain = host.split('.')[0];
    const tenantId = await TenantService.getTenantIdBySubdomain(subdomain);
    if (!tenantId) {
      throw new Error('Tenant not found');
    }

    req.tenantId = tenantId;
  
    next();
  } catch (error) {
    next(error);
  }
};

export const setupTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {tenantId} = req;
    if (!tenantId) {
      throw new Error('Tenant ID is missing');
    }

    const isTenantInitialized = await TenantService.isTenantInitialized(tenantId);
    if (isTenantInitialized) {
      console.log(`Tenant ${tenantId} is already initialized`);
      return next();
    }

    const db = MongoService.getTenantConnection(tenantId);
    if (!db.models['Book']) {
      db.model('Book', bookSchema);
      console.log('Book model applied to a new connection');
    }

    await TenantService.setTenantInitialized(tenantId);
    console.log(`Tenant ${tenantId} initialized`);

    next();
  } catch (error) {
    next(error);
  }
};