import { getRepository } from 'typeorm';
import { User } from './user.entity';

export class UserService {
  public async createUser(username: string, password: string, pseudonym: string) {
    const user = new User();

    user.username = username;
    user.password = password;
    user.pseudonym = pseudonym;

    user.hashPassword();

    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async getUser(username: string): Promise<User> {
    const userRepository = getRepository(User);
    return userRepository.findOneOrFail({ where: { username } });
  }
}
