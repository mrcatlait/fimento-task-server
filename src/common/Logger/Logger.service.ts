interface LoggerService {
  info(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

export class Logger implements LoggerService {
  constructor(protected context?: string) {}

  public info(message: string): void {
    this.printMessage(message);
  }

  public error(message: string): void {
    this.printMessage(message);
  }

  public debug(message: string): void {
    this.printMessage(message);
  }

  private printMessage(message: string) {
    const localeStringOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const timestamp = new Date(Date.now()).toLocaleString('en-GB', localeStringOptions);
    const contextMessage = this.context ? `[${this.context}] ` : '';

    if (process.env.NODE_ENV !== 'test') process.stdout.write(`${timestamp} - ${contextMessage}${message}\n`);
  }
}
