import { checkPostgresConnection, pool } from './postgres.js';
import { runMigrations } from './runMigrations.js';

try {
  const connection = await checkPostgresConnection();
  console.log(
    `Connected to PostgreSQL database "${connection.database_name}" as "${connection.user_name}".`,
  );

  await runMigrations();
  console.log('Database migrations are up to date.');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
