import { randomUUID } from 'node:crypto';
import { AppError } from '../errors/AppError.js';
import * as authorsRepository from '../repositories/authorsRepository.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateAuthorId(id) {
  if (typeof id !== 'string' || !uuidPattern.test(id)) {
    throw new AppError(
      400,
      'INVALID_AUTHOR_ID',
      'Author id must be a valid UUID.',
    );
  }
}

function getValidatedName(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(
      400,
      'INVALID_AUTHOR_INPUT',
      'Request body must be a JSON object containing only name.',
    );
  }

  const fields = Object.keys(body);

  if (fields.length !== 1 || fields[0] !== 'name') {
    throw new AppError(
      400,
      'INVALID_AUTHOR_INPUT',
      'Request body must contain only the name field.',
    );
  }

  if (typeof body.name !== 'string' || body.name.trim() === '') {
    throw new AppError(
      400,
      'INVALID_AUTHOR_NAME',
      'Author name must be a non-empty string.',
    );
  }

  return body.name.trim();
}

async function createAuthor(body) {
  const name = getValidatedName(body);

  return authorsRepository.insertAuthor({
    id: randomUUID(),
    name,
  });
}

async function listAuthors() {
  return authorsRepository.findAllAuthors();
}

async function getAuthor(id) {
  validateAuthorId(id);

  const author = await authorsRepository.findAuthorById(id);

  if (!author) {
    throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
  }

  return author;
}

async function updateAuthor(id, body) {
  validateAuthorId(id);
  const name = getValidatedName(body);
  const author = await authorsRepository.updateAuthorName(id, name);

  if (!author) {
    throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
  }

  return author;
}

async function deleteAuthor(id) {
  validateAuthorId(id);

  try {
    const author = await authorsRepository.removeAuthor(id);

    if (!author) {
      throw new AppError(404, 'AUTHOR_NOT_FOUND', 'Author not found.');
    }
  } catch (error) {
    const isBooksForeignKeyConflict =
      ['23001', '23503'].includes(error.code) &&
      error.constraint === 'books_author_id_fk';

    if (isBooksForeignKeyConflict) {
      throw new AppError(
        409,
        'AUTHOR_HAS_BOOKS',
        'Author cannot be deleted while books are linked to it.',
      );
    }

    throw error;
  }
}

export { createAuthor, deleteAuthor, getAuthor, listAuthors, updateAuthor };
