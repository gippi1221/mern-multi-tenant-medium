import { signUp } from '../../src/controllers/auth';
import { MongoService } from '../../src/services';
import { Request, Response, NextFunction } from 'express';
import { toRequestUser } from '../../src/lib';

jest.mock('../../src/services');
jest.mock('../../src/lib');

const mockRequest = (body: any = {}): Partial<Request> => ({ body, tenantId: 'tid' });

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = () => jest.fn();

describe('signUp', () => {
  it('returns 400 when fields missing', async () => {
    const req = mockRequest({ email: '', password: '' });
    const res = mockResponse();
    const next = mockNext();

    await signUp(req as Request, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('creates user and returns 201', async () => {
    const req = mockRequest({ email: 'a@b.com', password: '123' });
    const res = mockResponse();
    const next = mockNext();

    const mockUser = { save: jest.fn(), _id: { toHexString: () => 'id' }, email: 'a@b.com', createdAt: new Date(), updatedAt: new Date() };
    const model = jest.fn().mockReturnValue({ findOne: jest.fn().mockResolvedValue(null), create: jest.fn(), });
    model.mockReturnValueOnce({ findOne: jest.fn().mockResolvedValue(null) });
    (MongoService.getTenantConnection as jest.Mock).mockReturnValue({ model: () => ({ findOne: jest.fn().mockResolvedValue(null) }) });

    (MongoService.getTenantConnection as jest.Mock).mockReturnValue({ model: () => ({ findOne: jest.fn().mockResolvedValue(null) }) });

    // Instead of actual save, we simulate creation
    (MongoService.getTenantConnection as jest.Mock).mockReturnValue({
      model: () => ({
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(mockUser),
      }),
    });

    (toRequestUser as jest.Mock).mockReturnValue({ id: 'id', email: 'a@b.com' });

    await signUp(req as Request, res, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
});
