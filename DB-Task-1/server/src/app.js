import express from 'express';
import { AppError } from './errors/AppError.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authorsRouter } from './routes/authorsRoutes.js';
import { booksRouter } from './routes/booksRoutes.js';
import { readingEntriesRouter } from './routes/readingEntriesRoutes.js';

const app = express();

app.use(express.json());

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);
app.use('/api/books/:bookId/entries', readingEntriesRouter);

app.use((request, response, next) => {
  next(new AppError(404, 'ROUTE_NOT_FOUND', 'Route not found.'));
});

app.use(errorHandler);

export default app;
