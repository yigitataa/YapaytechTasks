import { apiRequest } from './api.js';

async function listBooks({ title, status, page, limit }) {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (title) {
    searchParams.set('title', title);
  }

  if (status) {
    searchParams.set('status', status);
  }

  return apiRequest(`/books?${searchParams.toString()}`);
}

async function createBook(book) {
  const response = await apiRequest('/books', {
    method: 'POST',
    body: JSON.stringify(book),
  });
  return response.data;
}

async function updateBook(id, book) {
  const response = await apiRequest(`/books/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(book),
  });
  return response.data;
}

async function deleteBook(id) {
  await apiRequest(`/books/${id}`, { method: 'DELETE' });
}

export { createBook, deleteBook, listBooks, updateBook };
