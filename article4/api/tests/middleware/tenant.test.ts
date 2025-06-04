import { extractTenant, setupTenant } from '../../src/middleware/tenant';
import { TenantService, MongoService } from '../../src/services';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../src/services');

const mockRequest = (headers: any = {}, body: any = {}): Partial<Request> => ({
  headers,
  body,
});

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = () => jest.fn();

describe('extractTenant', () => {
  it('should throw error if host header is missing', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    await extractTenant(req as Request, res, next as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should set tenantId from service', async () => {
    (TenantService.getTenantIdBySubdomain as jest.Mock).mockResolvedValue('tid');
    const req = mockRequest({ host: 'foo.example.com' });
    const res = mockResponse();
    const next = mockNext();

    await extractTenant(req as Request, res, next as NextFunction);

    expect(req.tenantId).toBe('tid');
    expect(next).toHaveBeenCalled();
  });
});

describe('setupTenant', () => {
  it('should throw error if tenantId missing', async () => {
    const req = mockRequest();
    const res = mockResponse();
    const next = mockNext();

    await setupTenant(req as Request, res, next as NextFunction);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should initialize models if not initialized', async () => {
    const req = mockRequest();
    req.tenantId = 'tid';
    const res = mockResponse();
    const next = mockNext();

    const mockDb = { models: {}, model: jest.fn() };
    (TenantService.isTenantInitialized as jest.Mock).mockResolvedValue(false);
    (MongoService.getTenantConnection as jest.Mock).mockReturnValue(mockDb);

    await setupTenant(req as Request, res, next as NextFunction);

    expect(mockDb.model).toHaveBeenCalled();
    expect(TenantService.setTenantInitialized).toHaveBeenCalledWith('tid');
    expect(next).toHaveBeenCalled();
  });
});
