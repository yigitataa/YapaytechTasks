import {
  MongoClient,
  MongoNetworkError,
  MongoNetworkTimeoutError,
  MongoNotConnectedError,
  MongoOperationTimeoutError,
  MongoServerSelectionError,
  MongoTopologyClosedError,
} from 'mongodb';

let client;
let database;
let connectionPromise;

const availabilityErrorTypes = [
  MongoNetworkError,
  MongoNetworkTimeoutError,
  MongoNotConnectedError,
  MongoOperationTimeoutError,
  MongoServerSelectionError,
  MongoTopologyClosedError,
];

function isMongoAvailabilityError(error) {
  return availabilityErrorTypes.some(
    (AvailabilityError) => error instanceof AvailabilityError,
  );
}

function getMongoConfig() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DATABASE;

  if (!uri || !databaseName) {
    throw new Error(
      'Missing MongoDB environment variables: MONGODB_URI, MONGODB_DATABASE',
    );
  }

  return { uri, databaseName };
}

async function getMongoDatabase() {
  if (database) {
    return database;
  }

  if (!connectionPromise) {
    const { uri, databaseName } = getMongoConfig();
    client = new MongoClient(uri);
    connectionPromise = client
      .connect()
      .then(() => {
        database = client.db(databaseName);
        return database;
      })
      .catch((error) => {
        client = undefined;
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

async function ensureMongoIndexes() {
  const mongoDatabase = await getMongoDatabase();

  await mongoDatabase.collection('reading_entries').createIndex(
    { bookId: 1 },
    { name: 'reading_entries_book_id_idx' },
  );
}

async function closeMongoConnection() {
  if (client) {
    await client.close();
  }

  client = undefined;
  database = undefined;
  connectionPromise = undefined;
}

export {
  closeMongoConnection,
  ensureMongoIndexes,
  getMongoDatabase,
  isMongoAvailabilityError,
};
