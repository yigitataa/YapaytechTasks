import pg from 'pg';

const { Pool } = pg;

const requiredEnvironmentVariables = [
  'PGHOST',
  'PGPORT',
  'PGDATABASE',
  'PGUSER',
  'PGPASSWORD',
];

function getPoolConfig() {
  const missingVariables = requiredEnvironmentVariables.filter(
    (variableName) => !process.env[variableName],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing PostgreSQL environment variables: ${missingVariables.join(', ')}`,
    );
  }

  const port = Number(process.env.PGPORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PGPORT must be a positive integer.');
  }

  return {
    host: process.env.PGHOST,
    port,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.PGSSL === 'true',
  };
}

const pool = new Pool(getPoolConfig());

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

async function checkPostgresConnection() {
  const result = await pool.query(
    'SELECT current_database() AS database_name, current_user AS user_name',
  );

  return result.rows[0];
}

export { checkPostgresConnection, pool };
