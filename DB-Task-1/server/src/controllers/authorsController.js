import * as authorsService from '../services/authorsService.js';

async function createAuthor(request, response, next) {
  try {
    const author = await authorsService.createAuthor(request.body);
    response.status(201).json({ data: author });
  } catch (error) {
    next(error);
  }
}

async function listAuthors(request, response, next) {
  try {
    const authors = await authorsService.listAuthors();
    response.status(200).json({ data: authors });
  } catch (error) {
    next(error);
  }
}

async function getAuthor(request, response, next) {
  try {
    const author = await authorsService.getAuthor(request.params.id);
    response.status(200).json({ data: author });
  } catch (error) {
    next(error);
  }
}

async function updateAuthor(request, response, next) {
  try {
    const author = await authorsService.updateAuthor(
      request.params.id,
      request.body,
    );
    response.status(200).json({ data: author });
  } catch (error) {
    next(error);
  }
}

async function deleteAuthor(request, response, next) {
  try {
    await authorsService.deleteAuthor(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

export { createAuthor, deleteAuthor, getAuthor, listAuthors, updateAuthor };
