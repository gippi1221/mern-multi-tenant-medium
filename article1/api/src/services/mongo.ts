import mongoose, { Connection } from 'mongoose';

class MongoService {
  private connection: Connection | null = null;

  async connect(): Promise<void> {
    const uri = process.env.MONGO_URI;
    const db = process.env.MONGO_DB;

    if (uri === undefined) {
      console.error('Mongo URI is not defined');
      process.exit(1);
    }

    try {
      const conn = await mongoose.connect(uri, {
        dbName: db,
        directConnection: true,
      });
      this.connection = conn.connection;
      console.log(
        `MongoDB Connected: ${this.connection.host}:${this.connection.port}/${this.connection.name}`
      );
    } catch (error) {
      console.error(`Error: ${error}`);
      process.exit(1);
    }
  }

  getTenantConnection(tenantId: string): Connection {
    if (!this.connection) {
      throw new Error('MongoDB connection is not established');
    }

    const db = this.connection.useDb(tenantId, { useCache: true });
    if (db) {
      console.log(`MongoDB Connected: ${db.host}:${db.port}/${db.name}`);
      return db;
    } else {
      console.error('Error: Tenant connection is null');
      throw new Error('Tenant connection is null');
    }
  }
}

export default new MongoService();