import * as booksService from '../services/booksService.js';

async function createBook(request, response, next) {
  try {
    const book = await booksService.createBook(request.body);
    response.status(201).json({ data: book });
  } catch (error) {
    next(error);
  }
}

async function listBooks(request, response, next) {
  try {
    const result = await booksService.listBooks(request.query);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getBook(request, response, next) {
  try {
    const book = await booksService.getBook(request.params.id);
    response.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

async function updateBook(request, response, next) {
  try {
    const book = await booksService.updateBook(request.params.id, request.body);
    response.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

async function deleteBook(request, response, next) {
  try {
    await booksService.deleteBook(request.params.id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

export { createBook, deleteBook, getBook, listBooks, updateBook };
