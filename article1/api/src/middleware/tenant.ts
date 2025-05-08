import { Request, Response, NextFunction } from 'express';
import { MongoService } from '../services';
import { bookSchema } from '../models';

export const extractTenant = (req: Request, res: Response, next: NextFunction) => {
  const host = req.headers.host;
  
  if (!host) {
    throw new Error('Host header is missing');
  }

  const subdomain = host.split('.')[0];
  req.tenantId = subdomain;

  next();
};

export const setupTenant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {tenantId} = req;
    if (!tenantId) {
      throw new Error('Tenant ID is missing');
    }

    const db = MongoService.getTenantConnection(tenantId);

    if (!db.models['Book']) {
      db.model('Book', bookSchema);
      console.log('Book model applied to a new connection');
    }

    next();
  } catch (error) {
    next(error);
  }
};