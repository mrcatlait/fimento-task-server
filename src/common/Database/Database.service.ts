import { Connection, createConnection } from 'typeorm';
import { Book } from '../../books/book.entity';
import { User } from '../../user/user.entity';
import Config from '../Config';
import { Logger } from '../Logger';

class DatabaseService {
  public connection: Connection;

  constructor(private readonly logger = new Logger('DatabaseService')) {}

  public async setupConnection(): Promise<void> {
    this.logger.info('Starting to create database connection');
    this.connection = await createConnection({
      type: 'postgres',
      host: Config.get('DB_HOST'),
      username: Config.get('DB_USER'),
      password: Config.get('DB_PASSWORD'),
      database: Config.get('DB_NAME'),
      port: Config.get('DB_PORT'),
      synchronize: true,
      logging: false,
      entities: [User, Book],
    });
    this.logger.info('Database connection created');
  }
}

export default new DatabaseService();
