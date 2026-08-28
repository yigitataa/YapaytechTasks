const ALLOWED_QUERY_FIELDS = ['page', 'limit']
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 6
const MAX_LIMIT = 100

function parsePositiveInteger(value, field, errors, fallback) {
  if (value === undefined) {
    return fallback
  }

  if (
    typeof value !== 'string' ||
    value.trim() === '' ||
    !/^\d+$/.test(value) ||
    Number(value) < 1
  ) {
    errors[field] = 'Pozitif bir tam sayı olmalıdır'
    return fallback
  }

  return Number(value)
}

export function validatePaginationQuery(query) {
  const errors = {}

  for (const field of Object.keys(query)) {
    if (!ALLOWED_QUERY_FIELDS.includes(field)) {
      errors[field] = 'Desteklenmeyen sorgu alanı'
    }
  }

  const page = parsePositiveInteger(query.page, 'page', errors, DEFAULT_PAGE)
  const limit = parsePositiveInteger(query.limit, 'limit', errors, DEFAULT_LIMIT)

  if (!errors.limit && limit > MAX_LIMIT) {
    errors.limit = `En fazla ${MAX_LIMIT} olabilir`
  }

  return {
    errors,
    value: { page, limit },
  }
}
