import { Router } from 'express';
import {
  createAuthor,
  deleteAuthor,
  getAuthor,
  listAuthors,
  updateAuthor,
} from '../controllers/authorsController.js';

const authorsRouter = Router();

authorsRouter.post('/', createAuthor);
authorsRouter.get('/', listAuthors);
authorsRouter.get('/:id', getAuthor);
authorsRouter.patch('/:id', updateAuthor);
authorsRouter.delete('/:id', deleteAuthor);

export { authorsRouter };
