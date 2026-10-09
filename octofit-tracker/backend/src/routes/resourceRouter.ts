import { Router } from 'express';
import type { Model } from 'mongoose';

export function createResourceRouter(
  model: Model<any, any, any, any, any, any, any>,
  populatePaths: string[] = [],
) {
  const router = Router();

  router.get('/', async (_request, response) => {
    response.json(await model.find().populate(populatePaths));
  });

  router.post('/', async (request, response) => {
    const record = await model.create(request.body);
    response.status(201).json(record);
  });

  router.get('/:id', async (request, response) => {
    const record = await model.findById(request.params.id).populate(populatePaths);
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.json(record);
  });

  router.put('/:id', async (request, response) => {
    const record = await model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    }).populate(populatePaths);
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.json(record);
  });

  router.patch('/:id', async (request, response) => {
    const record = await model.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    }).populate(populatePaths);
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.json(record);
  });

  router.delete('/:id', async (request, response) => {
    const record = await model.findByIdAndDelete(request.params.id);
    if (!record) {
      response.status(404).json({ error: 'Record not found' });
      return;
    }
    response.sendStatus(204);
  });

  return router;
}