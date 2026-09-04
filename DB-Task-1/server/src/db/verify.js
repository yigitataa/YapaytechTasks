import { checkPostgresConnection, pool } from './postgres.js';

const expectedColumns = new Map([
  [
    'authors',
    new Map([
      ['id', { dataType: 'uuid', nullable: 'NO', defaultIncludes: null }],
      ['name', { dataType: 'text', nullable: 'NO', defaultIncludes: null }],
    ]),
  ],
  [
    'books',
    new Map([
      ['id', { dataType: 'uuid', nullable: 'NO', defaultIncludes: null }],
      [
        'author_id',
        { dataType: 'uuid', nullable: 'NO', defaultIncludes: null },
      ],
      ['title', { dataType: 'text', nullable: 'NO', defaultIncludes: null }],
      [
        'status',
        { dataType: 'text', nullable: 'NO', defaultIncludes: 'to_read' },
      ],
      [
        'created_at',
        {
          dataType: 'timestamp with time zone',
          nullable: 'NO',
          defaultIncludes: 'now()',
        },
      ],
      [
        'updated_at',
        {
          dataType: 'timestamp with time zone',
          nullable: 'NO',
          defaultIncludes: 'now()',
        },
      ],
    ]),
  ],
]);

const expectedConstraints = new Map([
  ['authors_pkey', { tableName: 'authors', type: 'PRIMARY KEY' }],
  ['authors_name_not_blank', { tableName: 'authors', type: 'CHECK' }],
  ['books_pkey', { tableName: 'books', type: 'PRIMARY KEY' }],
  ['books_author_id_fk', { tableName: 'books', type: 'FOREIGN KEY' }],
  ['books_title_not_blank', { tableName: 'books', type: 'CHECK' }],
  ['books_status_allowed', { tableName: 'books', type: 'CHECK' }],
]);

try {
  const connection = await checkPostgresConnection();
  console.log(
    `Connected to PostgreSQL database "${connection.database_name}" as "${connection.user_name}".`,
  );

  const columnsResult = await pool.query(
    `
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = ANY($1::text[])
      ORDER BY table_name, ordinal_position
    `,
    [[...expectedColumns.keys()]],
  );

  for (const [tableName, columns] of expectedColumns) {
    const actualColumns = new Map(
      columnsResult.rows
        .filter((row) => row.table_name === tableName)
        .map((row) => [row.column_name, row]),
    );

    for (const [columnName, expected] of columns) {
      const actual = actualColumns.get(columnName);

      if (!actual) {
        throw new Error(`Missing column: ${tableName}.${columnName}`);
      }

      if (
        actual.data_type !== expected.dataType ||
        actual.is_nullable !== expected.nullable
      ) {
        throw new Error(`Unexpected definition: ${tableName}.${columnName}`);
      }

      if (
        expected.defaultIncludes === null
          ? actual.column_default !== null
          : !actual.column_default?.includes(expected.defaultIncludes)
      ) {
        throw new Error(`Unexpected default: ${tableName}.${columnName}`);
      }
    }
  }

  const constraintsResult = await pool.query(
    `
      SELECT
        constraints.table_name,
        constraints.constraint_name,
        constraints.constraint_type,
        referential.delete_rule
      FROM information_schema.table_constraints AS constraints
      LEFT JOIN information_schema.referential_constraints AS referential
        ON referential.constraint_schema = constraints.constraint_schema
        AND referential.constraint_name = constraints.constraint_name
      WHERE table_schema = current_schema()
        AND constraints.table_name = ANY($1::text[])
      ORDER BY
        constraints.table_name,
        constraints.constraint_type,
        constraints.constraint_name
    `,
    [[...expectedColumns.keys()]],
  );

  const actualConstraints = new Map(
    constraintsResult.rows.map((row) => [row.constraint_name, row]),
  );

  for (const [constraintName, expected] of expectedConstraints) {
    const actual = actualConstraints.get(constraintName);

    if (
      !actual ||
      actual.table_name !== expected.tableName ||
      actual.constraint_type !== expected.type
    ) {
      throw new Error(`Missing or invalid constraint: ${constraintName}`);
    }
  }

  if (actualConstraints.get('books_author_id_fk').delete_rule !== 'RESTRICT') {
    throw new Error('books_author_id_fk must use ON DELETE RESTRICT.');
  }

  console.table(columnsResult.rows);
  console.table(constraintsResult.rows);
  console.log('PostgreSQL table structure verified.');
} catch (error) {
  console.error('Verification failed:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
