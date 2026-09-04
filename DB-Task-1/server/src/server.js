import app from './app.js';
import { pool } from './db/postgres.js';
import { runMigrations } from './db/runMigrations.js';

const port = process.env.PORT || 3001;
const host = process.env.HOST || '127.0.0.1';

async function startServer() {
  await runMigrations();

  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

startServer().catch(async (error) => {
  console.error('Server could not start:', error.message);
  await pool.end();
  process.exitCode = 1;
});
