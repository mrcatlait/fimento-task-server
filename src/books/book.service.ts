import { getRepository } from 'typeorm';
import { Book } from './book.entity';

export class BookService {
  public getAllBooks() {
    const bookRepository = getRepository(Book);

    return bookRepository
      .createQueryBuilder('book')
      .select(['book.id', 'book.title', 'book.description', 'book.price', 'book.imageUrl', 'user.id', 'user.pseudonym'])
      .leftJoin('book.author', 'user')
      .getMany();
  }

  public findById(bookId: string) {
    const bookRepository = getRepository(Book);
    return bookRepository.findOne(bookId);
  }

  public createBook(title: string, description: string, imageUrl: string, price: number, userId: number) {
    const book = new Book();

    book.title = title;
    book.description = description;
    book.imageUrl = imageUrl;
    book.price = price;
    book.authorId = userId;

    const bookRepository = getRepository(Book);
    return bookRepository.save(book);
  }

  public async removeBook(bookId: string, authorId: number) {
    const bookRepository = getRepository(Book);
    await bookRepository.findOneOrFail({ where: { authorId, id: bookId } });
    await bookRepository.delete(bookId);
  }
}
