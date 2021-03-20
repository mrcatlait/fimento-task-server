import Joi from '@hapi/joi';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { checkValidation, Config, Logger, ServerError } from '../common';
import { User } from './user.entity';
import { UserService } from './user.service';

class UserController {
  constructor(
    private readonly logger = new Logger('UserController'),
    private readonly userService = new UserService(),
  ) {}

  public async newUser(req: Request, res: Response) {
    checkValidation(
      req.body,
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        pseudonym: Joi.string().required(),
      }).unknown(),
    );

    const { username, password, pseudonym } = req.body;

    this.logger.info(`Creating new user with name "${username}"`);
    await this.userService.createUser(username, password, pseudonym);
    this.logger.info(`User with name "${username}" was created`);
    res.status(201).send('User created');
  }

  public async login(req: Request, res: Response) {
    checkValidation(
      req.body,
      Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }).unknown(),
    );

    const { username, password } = req.body;
    this.logger.info(`Login by user "${username}"`);
    let user: User;

    try {
      user = await this.userService.getUser(username);
    } catch (error) {
      throw new ServerError('Invalid credentials', 400);
    }

    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      throw new ServerError('Invalid credentials', 400);
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, Config.get('JWT_SECRET'), { expiresIn: '1h' });

    res.send({ token });
  }
}

export default new UserController();
