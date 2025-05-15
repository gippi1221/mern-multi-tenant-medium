import { RedisService } from '.';
import { TenantDocument } from '../interfaces';
import { Tenant } from '../models';

const REDIS_TENANT_SUBDOMAIN_PREFIX = 'tenant:subdomain:';
const REDIS_TENANT_INIT_FLAG_PREFIX = 'tenant:init:';

class TenantService {

  async getTenantIdBySubdomain(subdomain: string): Promise<string | null> {
    const tenantIdFromCache = await RedisService.getClient().get(`${REDIS_TENANT_SUBDOMAIN_PREFIX}${subdomain}`);
    if (tenantIdFromCache) {
      console.log('Tenant ID from cache:', tenantIdFromCache);
      return tenantIdFromCache;
    }
    console.log('Tenant ID not found in cache, querying database...');
    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      console.log('Tenant not found in database');
      return null;
    }
    const tenantIdFromDb = tenant._id.toHexString();
    console.log('Tenant ID from database:', tenantIdFromDb);
    await RedisService.getClient().set(`${REDIS_TENANT_SUBDOMAIN_PREFIX}${subdomain}`, tenantIdFromDb, { EX: 3600 });
    return tenantIdFromDb;
  }

  async createTenant(subdomain: string): Promise<TenantDocument> {
    const isExist = await this.getTenantIdBySubdomain(subdomain);
    if (isExist) {
      throw new Error('Tenant already exists');
    }

    const tenant = new Tenant({ subdomain });
    await tenant.save();
    await RedisService.getClient().set(`${REDIS_TENANT_SUBDOMAIN_PREFIX}${subdomain}`, tenant._id.toHexString(), { EX: 3600 });
    return tenant;
  }

  async isTenantInitialized(tenantId: string): Promise<boolean> {
    const isTenantInitialized = await RedisService.getClient().get(`${REDIS_TENANT_INIT_FLAG_PREFIX}${tenantId}`);
    if (isTenantInitialized) {
      return true;
    }
    return false;
  }

  async setTenantInitialized(tenantId: string): Promise<void> {
    await RedisService.getClient().set(`${REDIS_TENANT_INIT_FLAG_PREFIX}${tenantId}`, 'true', { EX: 3600 });
  }
}

export default new TenantService();
