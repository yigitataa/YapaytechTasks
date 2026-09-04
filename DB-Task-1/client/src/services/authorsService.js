import { apiRequest } from './api.js';

async function listAuthors() {
  const response = await apiRequest('/authors');
  return response.data;
}

async function createAuthor(name) {
  const response = await apiRequest('/authors', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  return response.data;
}

async function updateAuthor(id, name) {
  const response = await apiRequest(`/authors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
  return response.data;
}

async function deleteAuthor(id) {
  await apiRequest(`/authors/${id}`, { method: 'DELETE' });
}

export { createAuthor, deleteAuthor, listAuthors, updateAuthor };
