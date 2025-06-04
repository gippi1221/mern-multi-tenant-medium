import { MongoService, RedisService } from '../src/services';

jest.mock('express');

jest.mock('../src/services');

describe('app initialization', () => {
  it('calls connect on services', async () => {
    (MongoService.connect as jest.Mock).mockResolvedValue();
    (RedisService.connect as jest.Mock).mockResolvedValue();

    await import('../src/index');

    expect(MongoService.connect).toHaveBeenCalled();
    expect(RedisService.connect).toHaveBeenCalled();
  });
});
