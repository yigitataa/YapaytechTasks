import { randomUUID } from 'node:crypto';
import { isMongoAvailabilityError } from '../db/mongodb.js';
import { AppError } from '../errors/AppError.js';
import * as authorsRepository from '../repositories/authorsRepository.js';
import * as booksRepository from '../repositories/booksRepository.js';
import * as entriesRepository from '../repositories/readingEntriesRepository.js';

const allowedStatuses = new Set(['to_read', 'reading', 'completed']);
const allowedBookFields = new Set(['title', 'authorId', 'status']);
const allowedListParameters = new Set(['title', 'status', 'page', 'limit']);
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateUuid(value, errorCode, fieldName) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) {
    throw new AppError(400, errorCode, `${fieldName} must be a valid UUID.`);
  }
}

function validateTitle(title) {
  if (typeof title !== 'string' || title.trim() === '') {
    throw new AppError(
      400,
      'INVALID_BOOK_TITLE',
      'Book title must be a non-empty string.',
    );
  }

  return title.trim();
}

function validateStatus(status) {
  if (typeof status !== 'string' || !allowedStatuses.has(status)) {
    throw new AppError(
      400,
      'INVALID_BOOK_STATUS',
      'Book status must be to_read, reading, or completed.',
    );
  }

  return status;
}

function validateBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(
      400,
      'INVALID_BOOK_INPUT',
      'Request body must be a JSON object.',
    );
  }
}

function rejectUnknownFields(body) {
  const unknownFields = Object.keys(body).filter(
    (field) => !allowedBookFields.has(field),
  );

  if (unknownFields.length > 0) {
    throw new AppError(
      400,
      'INVALID_BOOK_INPUT',
      `Unknown book fields: ${unknownFields.join(', ')}.`,
    );
  }
}

async function ensureAuthorExists(authorId) {
  validateUuid(authorId, 'INVALID_AUTHOR_ID', 'authorId');

  const author = await authorsRepository.findAuthorById(authorId);

  if (!author) {
    throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
  }
}

function parsePositiveInteger(value, defaultValue, fieldName, maximum) {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    throw new AppError(
      400,
      'INVALID_PAGINATION',
      `${fieldName} must be a positive integer.`,
    );
  }

  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue > maximum) {
    throw new AppError(
      400,
      'INVALID_PAGINATION',
      `${fieldName} must be at most ${maximum}.`,
    );
  }

  return parsedValue;
}

async function createBook(body) {
  validateBody(body);
  rejectUnknownFields(body);

  if (!Object.hasOwn(body, 'title') || !Object.hasOwn(body, 'authorId')) {
    throw new AppError(
      400,
      'INVALID_BOOK_INPUT',
      'Book title and authorId are required.',
    );
  }

  const title = validateTitle(body.title);
  await ensureAuthorExists(body.authorId);
  const status = Object.hasOwn(body, 'status')
    ? validateStatus(body.status)
    : 'to_read';

  try {
    return await booksRepository.insertBook({
      id: randomUUID(),
      title,
      authorId: body.authorId,
      status,
    });
  } catch (error) {
    if (error.code === '23503' && error.constraint === 'books_author_id_fk') {
      throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
    }

    throw error;
  }
}

async function listBooks(query) {
  const unknownParameters = Object.keys(query).filter(
    (parameter) => !allowedListParameters.has(parameter),
  );

  if (unknownParameters.length > 0) {
    throw new AppError(
      400,
      'INVALID_BOOK_QUERY',
      `Unknown query parameters: ${unknownParameters.join(', ')}.`,
    );
  }

  let title;
  if (query.title !== undefined) {
    title = validateTitle(query.title);
  }

  let status;
  if (query.status !== undefined) {
    status = validateStatus(query.status);
  }

  const page = parsePositiveInteger(
    query.page,
    1,
    'page',
    Number.MAX_SAFE_INTEGER,
  );
  const limit = parsePositiveInteger(query.limit, 20, 'limit', 100);
  const offset = (page - 1) * limit;

  if (!Number.isSafeInteger(offset)) {
    throw new AppError(
      400,
      'INVALID_PAGINATION',
      'page and limit produce an invalid offset.',
    );
  }

  const result = await booksRepository.findBooks({
    title,
    status,
    limit,
    offset,
  });

  return {
    data: result.books,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

async function getBook(id) {
  validateUuid(id, 'INVALID_BOOK_ID', 'Book id');

  const book = await booksRepository.findBookById(id);

  if (!book) {
    throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
  }

  return book;
}

async function updateBook(id, body) {
  validateUuid(id, 'INVALID_BOOK_ID', 'Book id');
  validateBody(body);
  rejectUnknownFields(body);

  const fields = Object.keys(body);
  if (fields.length === 0) {
    throw new AppError(
      400,
      'INVALID_BOOK_INPUT',
      'At least one book field must be provided.',
    );
  }

  const updates = {};

  if (Object.hasOwn(body, 'title')) {
    updates.title = validateTitle(body.title);
  }

  if (Object.hasOwn(body, 'authorId')) {
    await ensureAuthorExists(body.authorId);
    updates.authorId = body.authorId;
  }

  if (Object.hasOwn(body, 'status')) {
    updates.status = validateStatus(body.status);
  }

  try {
    const book = await booksRepository.updateBookFields(id, updates);

    if (!book) {
      throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
    }

    return book;
  } catch (error) {
    if (error.code === '23503' && error.constraint === 'books_author_id_fk') {
      throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
    }

    throw error;
  }
}

async function deleteBook(id) {
  validateUuid(id, 'INVALID_BOOK_ID', 'Book id');

  const existingBook = await booksRepository.findBookById(id);

  if (!existingBook) {
    throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
  }

  let hasReadingEntries;

  try {
    hasReadingEntries = await entriesRepository.hasEntriesForBook(id);
  } catch (error) {
    if (isMongoAvailabilityError(error)) {
      throw new AppError(
        503,
        'MONGODB_UNAVAILABLE',
        'Reading entries could not be checked because MongoDB is unavailable. The book was not deleted.',
      );
    }

    throw error;
  }

  if (hasReadingEntries) {
    throw new AppError(
      409,
      'BOOK_HAS_ENTRIES',
      "Delete the book's reading entries before deleting the book.",
    );
  }

  const book = await booksRepository.removeBook(id);

  if (!book) {
    throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
  }
}

export { createBook, deleteBook, getBook, listBooks, updateBook };
