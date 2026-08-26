const WRITABLE_FIELDS = [
  'name',
  'description',
  'price',
  'category',
  'imageUrl',
]
const REQUIRED_CREATE_FIELDS = ['name', 'price', 'category']

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  )
}

function addUnknownFieldErrors(input, errors) {
  for (const field of Object.keys(input)) {
    if (!WRITABLE_FIELDS.includes(field)) {
      errors[field] =
        field === 'id'
          ? 'Kimlik backend tarafından üretilir'
          : 'Desteklenmeyen alan'
    }
  }
}

function validateRequiredFields(input, errors) {
  for (const field of REQUIRED_CREATE_FIELDS) {
    if (!Object.hasOwn(input, field)) {
      errors[field] = 'Zorunlu alandır'
    }
  }
}

function validateTextField(input, field, errors, mustNotBeEmpty) {
  if (!Object.hasOwn(input, field)) {
    return
  }

  if (typeof input[field] !== 'string') {
    errors[field] = 'Metin olmalıdır'
    return
  }

  if (mustNotBeEmpty && input[field].trim() === '') {
    errors[field] = 'Boş olamaz'
  }
}

function validatePrice(input, errors) {
  if (!Object.hasOwn(input, 'price')) {
    return
  }

  if (typeof input.price !== 'number' || !Number.isFinite(input.price)) {
    errors.price = 'Sonlu bir sayı olmalıdır'
    return
  }

  if (input.price <= 0) {
    errors.price = 'Sıfırdan büyük olmalıdır'
  }
}

function normalizeWritableFields(input) {
  const value = {}

  for (const field of WRITABLE_FIELDS) {
    if (!Object.hasOwn(input, field)) {
      continue
    }

    value[field] =
      typeof input[field] === 'string' ? input[field].trim() : input[field]
  }

  return value
}

function validateProductInput(input, { isUpdate }) {
  const errors = {}

  if (!isPlainObject(input)) {
    return {
      errors: { body: 'JSON gövdesi bir nesne olmalıdır' },
      value: {},
    }
  }

  if (isUpdate && Object.keys(input).length === 0) {
    return {
      errors: { body: 'En az bir güncellenebilir alan gönderilmelidir' },
      value: {},
    }
  }

  addUnknownFieldErrors(input, errors)

  if (!isUpdate) {
    validateRequiredFields(input, errors)
  }

  validateTextField(input, 'name', errors, true)
  validateTextField(input, 'category', errors, true)
  validateTextField(input, 'description', errors, false)
  validateTextField(input, 'imageUrl', errors, false)
  validatePrice(input, errors)

  return {
    errors,
    value: normalizeWritableFields(input),
  }
}

export function validateProductForCreate(input) {
  const result = validateProductInput(input, { isUpdate: false })

  return {
    ...result,
    value: {
      description: '',
      imageUrl: '',
      ...result.value,
    },
  }
}

export function validateProductForUpdate(input) {
  return validateProductInput(input, { isUpdate: true })
}
