import { errorMessages } from './Error.message';

export class ServerError {
  private message: string;
  private status: number;

  constructor(message: string, status = 500) {
    this.message = `${errorMessages[status]}: ${message}`;
    this.status = status;
  }
}
