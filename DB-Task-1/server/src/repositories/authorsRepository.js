import { pool } from '../db/postgres.js';

async function insertAuthor({ id, name }) {
  const result = await pool.query(
    `
      INSERT INTO authors (id, name)
      VALUES ($1, $2)
      RETURNING id, name
    `,
    [id, name],
  );

  return result.rows[0];
}

async function findAllAuthors() {
  const result = await pool.query(`
    SELECT id, name
    FROM authors
    ORDER BY name, id
  `);

  return result.rows;
}

async function findAuthorById(id) {
  const result = await pool.query(
    `
      SELECT id, name
      FROM authors
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

async function updateAuthorName(id, name) {
  const result = await pool.query(
    `
      UPDATE authors
      SET name = $2
      WHERE id = $1
      RETURNING id, name
    `,
    [id, name],
  );

  return result.rows[0] ?? null;
}

async function removeAuthor(id) {
  const result = await pool.query(
    `
      DELETE FROM authors
      WHERE id = $1
      RETURNING id
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export {
  findAllAuthors,
  findAuthorById,
  insertAuthor,
  removeAuthor,
  updateAuthorName,
};
