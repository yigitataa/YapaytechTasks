import * as entriesService from '../services/readingEntriesService.js';

async function createEntry(request, response, next) {
  try {
    const entry = await entriesService.createEntry(
      request.params.bookId,
      request.body,
    );
    response.status(201).json({ data: entry });
  } catch (error) {
    next(error);
  }
}

async function listEntries(request, response, next) {
  try {
    const entries = await entriesService.listEntries(request.params.bookId);
    response.status(200).json({ data: entries });
  } catch (error) {
    next(error);
  }
}

async function getEntry(request, response, next) {
  try {
    const entry = await entriesService.getEntry(
      request.params.bookId,
      request.params.entryId,
    );
    response.status(200).json({ data: entry });
  } catch (error) {
    next(error);
  }
}

async function updateEntry(request, response, next) {
  try {
    const entry = await entriesService.updateEntry(
      request.params.bookId,
      request.params.entryId,
      request.body,
    );
    response.status(200).json({ data: entry });
  } catch (error) {
    next(error);
  }
}

async function deleteEntry(request, response, next) {
  try {
    await entriesService.deleteEntry(
      request.params.bookId,
      request.params.entryId,
    );
    response.status(204).send();
  } catch (error) {
    next(error);
  }
}

export { createEntry, deleteEntry, getEntry, listEntries, updateEntry };
