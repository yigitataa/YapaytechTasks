class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: options.body
      ? { 'Content-Type': 'application/json', ...options.headers }
      : options.headers,
  });

  let payload;
  if (response.status !== 204) {
    payload = await response.json().catch(() => null);
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload?.error?.code ?? 'REQUEST_FAILED',
      payload?.error?.message ?? 'İstek tamamlanamadı.',
    );
  }

  return payload;
}

const friendlyMessages = {
  AUTHOR_HAS_BOOKS: 'Bu yazarı silmeden önce yazara bağlı kitapları silmelisiniz.',
  BOOK_HAS_ENTRIES:
    'Bu kitabı silmeden önce kitaba bağlı okuma günlüğü kayıtlarını silmelisiniz.',
  MONGODB_UNAVAILABLE:
    'Okuma günlüğü şu anda kontrol edilemiyor. Kitap silinmedi; lütfen daha sonra tekrar deneyin.',
};

function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return friendlyMessages[error.code] ?? error.message;
  }

  if (error instanceof TypeError) {
    return 'Sunucuya ulaşılamadı. Backend uygulamasının çalıştığını kontrol edin.';
  }

  return 'Beklenmeyen bir hata oluştu.';
}

export { apiRequest, getErrorMessage };
