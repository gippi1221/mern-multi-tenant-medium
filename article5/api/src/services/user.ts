import { MongoService } from '.';
import { IUser, UserDocument } from '../interfaces';
import { NotFoundError } from '../utils/errors';

class UserService {
  async getUserById(userId: string, tenantId: string): Promise<UserDocument> {
    const db = MongoService.getTenantConnection(tenantId);
    const User = db.model('User');

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  async getUserByEmail(email: string, tenantId: string): Promise<UserDocument> {
    const db = MongoService.getTenantConnection(tenantId);
    const User = db.model('User');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  async createUser(userData: Partial<IUser>, tenantId: string): Promise<UserDocument> {
    const db = MongoService.getTenantConnection(tenantId);
    const User = db.model('User');

    const user = new User(userData);
    await user.save();

    return user;
  }
}

export default new UserService();
