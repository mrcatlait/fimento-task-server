import bodyParser from 'body-parser';
import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import Config from '../../common/Config';
import { Logger } from '../../common/Logger';
import { ServerError } from '../Error';

export class HTTPServer {
  constructor(private readonly app = express(), private readonly logger = new Logger('HTTPServer')) {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(bodyParser.json());
  }

  public start() {
    this.app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      if (Object.prototype.isPrototypeOf.call(ServerError.prototype, err)) {
        return res.status(err.status || 500).json({ error: err.message });
      }

      this.logger.debug(JSON.stringify(req));
      this.logger.error(err);

      return res.status(500).json({ error: 'Internal server error' });
    });

    this.app.listen(Config.get('PORT'), () => {
      this.logger.info(`Listening on port ${Config.get('PORT')}`);
    });
  }

  public get(route: string, handlers: RequestHandler[]) {
    this.logger.info(`Registered GET request handler for route "${route}"`);
    this.app.get(route, ...handlers);
  }

  public post(route: string, handlers: RequestHandler[]) {
    this.logger.info(`Registered POST request handler for route "${route}"`);
    this.app.post(route, ...handlers);
  }

  public delete(route: string, handlers: RequestHandler[]) {
    this.logger.info(`Registered DELETE request handler for route "${route}"`);
    this.app.delete(route, ...handlers);
  }
}
