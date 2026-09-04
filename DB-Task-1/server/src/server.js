import app from './app.js';
import {
  closeMongoConnection,
  ensureMongoIndexes,
  isMongoAvailabilityError,
} from './db/mongodb.js';
import { pool } from './db/postgres.js';
import { runMigrations } from './db/runMigrations.js';

const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

async function startServer() {
  await runMigrations();

  try {
    await ensureMongoIndexes();
  } catch (error) {
    if (!isMongoAvailabilityError(error)) {
      throw error;
    }

    console.warn(
      'MongoDB is unavailable at startup. Reading-entry operations will return 503 until it is reachable.',
    );
  }

  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

startServer().catch(async (error) => {
  console.error('Server could not start:', error.message);
  await closeMongoConnection();
  await pool.end();
  process.exitCode = 1;
});
