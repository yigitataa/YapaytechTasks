import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './postgres.js';

const migrationsDirectory = fileURLToPath(
  new URL('./migrations/', import.meta.url),
);

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const migrationFiles = (await readdir(migrationsDirectory))
      .filter((filename) => /^\d{3}_.+\.sql$/.test(filename))
      .sort();

    const appliedResult = await client.query(
      'SELECT filename FROM schema_migrations',
    );
    const appliedMigrations = new Set(
      appliedResult.rows.map((row) => row.filename),
    );

    for (const filename of migrationFiles) {
      if (appliedMigrations.has(filename)) {
        continue;
      }

      const sql = await readFile(join(migrationsDirectory, filename), 'utf8');

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [filename],
        );
        await client.query('COMMIT');
        console.log(`Applied migration: ${filename}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    client.release();
  }
}

export { runMigrations };
