import { AppError } from '../errors/AppError.js';
import * as booksRepository from '../repositories/booksRepository.js';
import * as entriesRepository from '../repositories/readingEntriesRepository.js';

const allowedEntryFields = new Set(['type', 'content', 'page', 'tags']);
const allowedTypes = new Set(['note', 'quote']);
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const objectIdPattern = /^[0-9a-f]{24}$/i;

async function ensureBookExists(bookId) {
  if (typeof bookId !== 'string' || !uuidPattern.test(bookId)) {
    throw new AppError(400, 'INVALID_BOOK_ID', 'Book id must be a valid UUID.');
  }

  const book = await booksRepository.findBookById(bookId);

  if (!book) {
    throw new AppError(404, 'BOOK_NOT_FOUND', 'Book not found.');
  }
}

function validateEntryId(entryId) {
  if (typeof entryId !== 'string' || !objectIdPattern.test(entryId)) {
    throw new AppError(
      400,
      'INVALID_ENTRY_ID',
      'Entry id must be a valid ObjectId.',
    );
  }
}

function validateBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError(
      400,
      'INVALID_ENTRY_INPUT',
      'Request body must be a JSON object.',
    );
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !allowedEntryFields.has(field),
  );

  if (unknownFields.length > 0) {
    throw new AppError(
      400,
      'INVALID_ENTRY_INPUT',
      `Unknown entry fields: ${unknownFields.join(', ')}.`,
    );
  }
}

function validateType(type) {
  if (typeof type !== 'string' || !allowedTypes.has(type)) {
    throw new AppError(
      400,
      'INVALID_ENTRY_TYPE',
      'Entry type must be note or quote.',
    );
  }

  return type;
}

function validateContent(content) {
  if (typeof content !== 'string' || content.trim() === '') {
    throw new AppError(
      400,
      'INVALID_ENTRY_CONTENT',
      'Entry content must be a non-empty string.',
    );
  }

  return content.trim();
}

function validatePage(page) {
  if (!Number.isSafeInteger(page) || page <= 0) {
    throw new AppError(
      400,
      'INVALID_ENTRY_PAGE',
      'Entry page must be a positive integer.',
    );
  }

  return page;
}

function validateTags(tags) {
  if (
    !Array.isArray(tags) ||
    tags.some((tag) => typeof tag !== 'string' || tag.trim() === '')
  ) {
    throw new AppError(
      400,
      'INVALID_ENTRY_TAGS',
      'Entry tags must be an array of non-empty strings.',
    );
  }

  return tags.map((tag) => tag.trim());
}

async function createEntry(bookId, body) {
  await ensureBookExists(bookId);
  validateBody(body);

  if (!Object.hasOwn(body, 'type') || !Object.hasOwn(body, 'content')) {
    throw new AppError(
      400,
      'INVALID_ENTRY_INPUT',
      'Entry type and content are required.',
    );
  }

  const now = new Date();
  const entry = {
    bookId,
    type: validateType(body.type),
    content: validateContent(body.content),
    tags: Object.hasOwn(body, 'tags') ? validateTags(body.tags) : [],
    createdAt: now,
    updatedAt: now,
  };

  if (Object.hasOwn(body, 'page')) {
    entry.page = validatePage(body.page);
  }

  return entriesRepository.insertEntry(entry);
}

async function listEntries(bookId) {
  await ensureBookExists(bookId);
  return entriesRepository.findEntriesByBookId(bookId);
}

async function getEntry(bookId, entryId) {
  await ensureBookExists(bookId);
  validateEntryId(entryId);

  const entry = await entriesRepository.findEntryById(bookId, entryId);

  if (!entry) {
    throw new AppError(404, 'ENTRY_NOT_FOUND', 'Reading entry not found.');
  }

  return entry;
}

async function updateEntry(bookId, entryId, body) {
  await ensureBookExists(bookId);
  validateEntryId(entryId);
  validateBody(body);

  const fields = Object.keys(body);
  if (fields.length === 0) {
    throw new AppError(
      400,
      'INVALID_ENTRY_INPUT',
      'At least one entry field must be provided.',
    );
  }

  const updates = {};

  if (Object.hasOwn(body, 'type')) {
    updates.type = validateType(body.type);
  }

  if (Object.hasOwn(body, 'content')) {
    updates.content = validateContent(body.content);
  }

  if (Object.hasOwn(body, 'page')) {
    updates.page = validatePage(body.page);
  }

  if (Object.hasOwn(body, 'tags')) {
    updates.tags = validateTags(body.tags);
  }

  const entry = await entriesRepository.updateEntryFields(
    bookId,
    entryId,
    updates,
    new Date(),
  );

  if (!entry) {
    throw new AppError(404, 'ENTRY_NOT_FOUND', 'Reading entry not found.');
  }

  return entry;
}

async function deleteEntry(bookId, entryId) {
  await ensureBookExists(bookId);
  validateEntryId(entryId);

  const deleted = await entriesRepository.removeEntry(bookId, entryId);

  if (!deleted) {
    throw new AppError(404, 'ENTRY_NOT_FOUND', 'Reading entry not found.');
  }
}

export { createEntry, deleteEntry, getEntry, listEntries, updateEntry };
