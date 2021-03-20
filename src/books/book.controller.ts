import Joi from '@hapi/joi';
import { Request, Response } from 'express';
import { AuthMiddleware, checkValidation, Logger } from '../common';
import { BookService } from './book.service';

class BookController {
  constructor(
    private readonly logger = new Logger('BookController'),
    private readonly bookService = new BookService(),
  ) {}

  public async getBooks(req: Request, res: Response) {
    this.logger.info('Getting list of all books');
    const books = await this.bookService.getAllBooks();
    res.send({ books });
  }

  public async getBook(req: Request, res: Response) {
    const { id } = req.params;
    this.logger.info(`Getting book with id ${id}`);
    const book = await this.bookService.findById(id);
    res.send({ book });
  }

  public async postBook(req: Request, res: Response) {
    this.logger.info('Adding new book');
    checkValidation(
      req.body,
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        imageUrl: Joi.string().required(),
        price: Joi.number().required(),
      }).unknown(),
    );

    const userId = AuthMiddleware.getUserId(req);
    const { title, description, imageUrl, price } = req.body;

    const book = await this.bookService.createBook(title, description, imageUrl, price, userId);
    res.status(201);
    res.send({ book });
  }

  public updateBook(req: Request, res: Response) {
    return;
  }

  public async deleteBook(req: Request, res: Response) {
    const { id } = req.params;
    const userId = AuthMiddleware.getUserId(req);
    await this.bookService.removeBook(id, userId);
    res.status(204).send();
  }
}

export default new BookController();
