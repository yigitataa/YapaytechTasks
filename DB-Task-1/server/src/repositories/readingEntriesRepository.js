import { ObjectId } from 'mongodb';
import { getMongoDatabase } from '../db/mongodb.js';

function mapEntryDocument(document) {
  return {
    id: document._id.toHexString(),
    bookId: document.bookId,
    type: document.type,
    content: document.content,
    ...(document.page === undefined ? {} : { page: document.page }),
    tags: document.tags,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

async function getCollection() {
  const database = await getMongoDatabase();
  return database.collection('reading_entries');
}

async function insertEntry(entry) {
  const collection = await getCollection();
  const document = {
    bookId: entry.bookId,
    type: entry.type,
    content: entry.content,
    tags: entry.tags,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };

  if (entry.page !== undefined) {
    document.page = entry.page;
  }

  const result = await collection.insertOne(document);

  return mapEntryDocument({ ...document, _id: result.insertedId });
}

async function findEntriesByBookId(bookId) {
  const collection = await getCollection();
  const documents = await collection
    .find({ bookId })
    .sort({ createdAt: -1, _id: 1 })
    .toArray();

  return documents.map(mapEntryDocument);
}

async function findEntryById(bookId, entryId) {
  const collection = await getCollection();
  const document = await collection.findOne({
    _id: new ObjectId(entryId),
    bookId,
  });

  return document ? mapEntryDocument(document) : null;
}

async function updateEntryFields(bookId, entryId, fields, updatedAt) {
  const collection = await getCollection();
  const set = { updatedAt };

  if (Object.hasOwn(fields, 'type')) {
    set.type = fields.type;
  }

  if (Object.hasOwn(fields, 'content')) {
    set.content = fields.content;
  }

  if (Object.hasOwn(fields, 'page')) {
    set.page = fields.page;
  }

  if (Object.hasOwn(fields, 'tags')) {
    set.tags = fields.tags;
  }

  const document = await collection.findOneAndUpdate(
    { _id: new ObjectId(entryId), bookId },
    { $set: set },
    { returnDocument: 'after' },
  );

  return document ? mapEntryDocument(document) : null;
}

async function removeEntry(bookId, entryId) {
  const collection = await getCollection();
  const result = await collection.deleteOne({
    _id: new ObjectId(entryId),
    bookId,
  });

  return result.deletedCount === 1;
}

async function hasEntriesForBook(bookId) {
  const collection = await getCollection();
  const entry = await collection.findOne({ bookId }, { projection: { _id: 1 } });

  return entry !== null;
}

export {
  findEntriesByBookId,
  findEntryById,
  hasEntriesForBook,
  insertEntry,
  removeEntry,
  updateEntryFields,
};
