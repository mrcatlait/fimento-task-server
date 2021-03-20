import Joi from '@hapi/joi';
import dotenv from 'dotenv';
import { Logger } from '../Logger';

interface Config {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
}

class ConfigService {
  private readonly config: Config;

  constructor(private readonly logger = new Logger('ConfigService')) {
    dotenv.config();
    const config = process.env;
    this.config = this.validateConfig(config);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateConfig(envConfig: { [key: string]: any }): Config {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.any().allow('development', 'production', 'test', 'provision').default('development'),
      PORT: Joi.number().default(4000),
      JWT_SECRET: Joi.string().required(),
      DB_HOST: Joi.string().default('localhost').required(),
      DB_NAME: Joi.string().required(),
      DB_USER: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_PORT: Joi.number().default(5432).required(),
    }).unknown();

    const { error, value } = envVarsSchema.validate(envConfig);

    if (error) {
      this.logger.error(`Config validation error: ${error.message}`);
      process.exit(1);
    }

    return value;
  }

  get<Key extends keyof Config>(key: Key): Config[Key] {
    return this.config[key];
  }
}

const Config = new ConfigService();

export default Config;
export { Config };
