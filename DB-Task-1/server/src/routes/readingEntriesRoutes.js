import { Router } from 'express';
import {
  createEntry,
  deleteEntry,
  getEntry,
  listEntries,
  updateEntry,
} from '../controllers/readingEntriesController.js';

const readingEntriesRouter = Router({ mergeParams: true });

readingEntriesRouter.post('/', createEntry);
readingEntriesRouter.get('/', listEntries);
readingEntriesRouter.get('/:entryId', getEntry);
readingEntriesRouter.patch('/:entryId', updateEntry);
readingEntriesRouter.delete('/:entryId', deleteEntry);

export { readingEntriesRouter };
