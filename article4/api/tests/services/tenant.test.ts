import TenantService from '../../src/services/tenant';
import { RedisService } from '../../src/services';
import { Tenant } from '../../src/models';

jest.mock('../../src/services/redis');
jest.mock('../../src/models');

describe('TenantService.getTenantIdBySubdomain', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns id from cache', async () => {
    (RedisService.getClient as jest.Mock).mockReturnValue({ get: jest.fn().mockResolvedValue('cached') });
    const id = await TenantService.getTenantIdBySubdomain('foo');
    expect(id).toBe('cached');
  });

  it('queries db when cache misses', async () => {
    (RedisService.getClient as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn(),
    });
    (Tenant.findOne as jest.Mock).mockResolvedValue({ _id: { toHexString: () => 'dbid' } });
    const id = await TenantService.getTenantIdBySubdomain('bar');
    expect(id).toBe('dbid');
  });
});

describe('TenantService.setTenantInitialized', () => {
  it('sets flag in redis', async () => {
    const set = jest.fn();
    (RedisService.getClient as jest.Mock).mockReturnValue({ set });
    await TenantService.setTenantInitialized('tid');
    expect(set).toHaveBeenCalled();
  });
});
