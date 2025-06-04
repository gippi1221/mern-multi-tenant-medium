import { errorHandler } from '../../src/middleware/error';
import { Request, Response, NextFunction } from 'express';

const mockRequest = (): Partial<Request> => ({ headers: {} });

const mockResponse = (headersSent = false) => {
  const res: Partial<Response> = { headersSent };
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = () => jest.fn();

describe('errorHandler', () => {
  it('should forward error if headers already sent', () => {
    const req = mockRequest();
    const res = mockResponse(true);
    const next = mockNext();
    const error = new Error('boom');

    errorHandler(error, req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should respond with json error', () => {
    const req = mockRequest();
    const res = mockResponse(false);
    const next = mockNext();
    const error = new Error('fail');

    errorHandler(error, req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'fail' }));
  });
});
