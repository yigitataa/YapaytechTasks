import {
  closeMongoConnection,
  ensureMongoIndexes,
  getMongoDatabase,
} from './mongodb.js';

try {
  const database = await getMongoDatabase();
  await database.command({ ping: 1 });
  await ensureMongoIndexes();

  const indexes = await database.collection('reading_entries').indexes();
  const hasBookIdIndex = indexes.some(
    (index) => index.name === 'reading_entries_book_id_idx',
  );

  if (!hasBookIdIndex) {
    throw new Error('reading_entries bookId index is missing.');
  }

  console.log(
    `MongoDB database "${database.databaseName}" and bookId index verified.`,
  );
} catch (error) {
  console.error('MongoDB verification failed:', error.message);
  process.exitCode = 1;
} finally {
  await closeMongoConnection();
}
