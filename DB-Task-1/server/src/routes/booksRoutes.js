import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from '../controllers/booksController.js';

const booksRouter = Router();

booksRouter.post('/', createBook);
booksRouter.get('/', listBooks);
booksRouter.get('/:id', getBook);
booksRouter.patch('/:id', updateBook);
booksRouter.delete('/:id', deleteBook);

export { booksRouter };
