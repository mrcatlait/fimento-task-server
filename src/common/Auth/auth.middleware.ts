import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Config from '../Config';

class AuthMiddleware {
  public checkJwt(req: Request, res: Response, next: NextFunction) {
    const token = <string>req.headers['auth'];
    let jwtPayload;

    try {
      jwtPayload = <any>jwt.verify(token, Config.get('JWT_SECRET'));
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      res.status(401).send();
      return;
    }

    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, Config.get('JWT_SECRET'), {
      expiresIn: '1h',
    });
    res.setHeader('token', newToken);

    next();
  }

  public getUserId(req: Request): number {
    const token = <string>req.headers['auth'];
    const { userId } = <any>jwt.verify(token, Config.get('JWT_SECRET'));

    return userId;
  }
}

export default new AuthMiddleware();
