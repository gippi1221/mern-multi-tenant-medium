import { createClient, RedisClientType } from 'redis';

class RedisService {
  private readonly client: RedisClientType;

  constructor() {
    const REDIS_URL = process.env.REDIS_URL;
    const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

    this.client = createClient({
      url: REDIS_URL,
      password: REDIS_PASSWORD,
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async connect() {
    try {
      await this.client.connect();
      console.log(`Redis connected: ${process.env.REDIS_URL}`);

      await this.client.flushAll();
      console.log('Redis cache cleared on startup');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
    }
  }

  getClient() {
    return this.client;
  }
}

export default new RedisService();