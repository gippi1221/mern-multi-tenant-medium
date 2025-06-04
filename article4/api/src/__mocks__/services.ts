export const MongoService = {
  connect: jest.fn(),
  getTenantConnection: jest.fn(),
};

export const RedisService = {
  connect: jest.fn(),
  getClient: jest.fn(),
};

export const TenantService = {
  getTenantIdBySubdomain: jest.fn(),
  isTenantInitialized: jest.fn(),
  setTenantInitialized: jest.fn(),
  createTenant: jest.fn(),
};
