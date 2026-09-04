import { pool } from '../db/postgres.js';

function mapBookRow(row) {
  return {
    id: row.id,
    title: row.title,
    authorId: row.author_id,
    authorName: row.author_name,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function insertBook({ id, title, authorId, status }) {
  const result = await pool.query(
    `
      WITH inserted_book AS (
        INSERT INTO books (id, title, author_id, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, title, author_id, status, created_at, updated_at
      )
      SELECT
        inserted_book.id,
        inserted_book.title,
        inserted_book.author_id,
        authors.name AS author_name,
        inserted_book.status,
        inserted_book.created_at,
        inserted_book.updated_at
      FROM inserted_book
      JOIN authors ON authors.id = inserted_book.author_id
    `,
    [id, title, authorId, status],
  );

  return mapBookRow(result.rows[0]);
}

async function findBooks({ title, status, limit, offset }) {
  const conditions = [];
  const filterValues = [];

  if (title !== undefined) {
    filterValues.push(`%${title}%`);
    conditions.push(`books.title ILIKE $${filterValues.length}`);
  }

  if (status !== undefined) {
    filterValues.push(status);
    conditions.push(`books.status = $${filterValues.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const limitParameter = filterValues.length + 1;
  const offsetParameter = filterValues.length + 2;

  const [booksResult, countResult] = await Promise.all([
    pool.query(
      `
        SELECT
          books.id,
          books.title,
          books.author_id,
          authors.name AS author_name,
          books.status,
          books.created_at,
          books.updated_at
        FROM books
        JOIN authors ON authors.id = books.author_id
        ${whereClause}
        ORDER BY books.created_at DESC, books.id ASC
        LIMIT $${limitParameter}
        OFFSET $${offsetParameter}
      `,
      [...filterValues, limit, offset],
    ),
    pool.query(
      `
        SELECT COUNT(*)::integer AS total
        FROM books
        ${whereClause}
      `,
      filterValues,
    ),
  ]);

  return {
    books: booksResult.rows.map(mapBookRow),
    total: countResult.rows[0].total,
  };
}

async function findBookById(id) {
  const result = await pool.query(
    `
      SELECT
        books.id,
        books.title,
        books.author_id,
        authors.name AS author_name,
        books.status,
        books.created_at,
        books.updated_at
      FROM books
      JOIN authors ON authors.id = books.author_id
      WHERE books.id = $1
    `,
    [id],
  );

  return result.rows[0] ? mapBookRow(result.rows[0]) : null;
}

async function updateBookFields(id, fields) {
  const columnByField = {
    title: 'title',
    authorId: 'author_id',
    status: 'status',
  };
  const values = [id];
  const assignments = Object.entries(fields).map(([field, value]) => {
    values.push(value);
    return `${columnByField[field]} = $${values.length}`;
  });

  assignments.push('updated_at = now()');

  const result = await pool.query(
    `
      WITH updated_book AS (
        UPDATE books
        SET ${assignments.join(', ')}
        WHERE id = $1
        RETURNING id, title, author_id, status, created_at, updated_at
      )
      SELECT
        updated_book.id,
        updated_book.title,
        updated_book.author_id,
        authors.name AS author_name,
        updated_book.status,
        updated_book.created_at,
        updated_book.updated_at
      FROM updated_book
      JOIN authors ON authors.id = updated_book.author_id
    `,
    values,
  );

  return result.rows[0] ? mapBookRow(result.rows[0]) : null;
}

async function removeBook(id) {
  const result = await pool.query(
    `
      DELETE FROM books
      WHERE id = $1
      RETURNING id
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export {
  findBookById,
  findBooks,
  insertBook,
  removeBook,
  updateBookFields,
};
