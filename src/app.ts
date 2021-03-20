import 'reflect-metadata';
import { BookController } from './books';
import { AuthMiddleware, asyncErrorHandler, DatabaseService, HTTPServer } from './common';
import { UserController } from './user';

(async () => {
  await DatabaseService.setupConnection();
  const server = new HTTPServer();

  server.get('/books', [asyncErrorHandler((req, res) => BookController.getBooks(req, res))]);
  server.get('/books/:id', [asyncErrorHandler((req, res) => BookController.getBook(req, res))]);
  server.post('/books', [AuthMiddleware.checkJwt, asyncErrorHandler((req, res) => BookController.postBook(req, res))]);
  server.delete('/books/:id', [
    AuthMiddleware.checkJwt,
    asyncErrorHandler((req, res) => BookController.deleteBook(req, res)),
  ]);

  server.post('/user', [asyncErrorHandler((req, res) => UserController.newUser(req, res))]);
  server.post('/login', [asyncErrorHandler((req, res) => UserController.login(req, res))]);

  server.start();
})();
