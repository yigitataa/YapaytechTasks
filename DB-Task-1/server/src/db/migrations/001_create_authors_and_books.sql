CREATE TABLE authors (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  CONSTRAINT authors_name_not_blank CHECK (btrim(name) <> '')
);

CREATE TABLE books (
  id UUID PRIMARY KEY,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'to_read',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT books_author_id_fk
    FOREIGN KEY (author_id)
    REFERENCES authors(id)
    ON DELETE RESTRICT,
  CONSTRAINT books_title_not_blank CHECK (btrim(title) <> ''),
  CONSTRAINT books_status_allowed
    CHECK (status IN ('to_read', 'reading', 'completed'))
);
