import express from 'express';
import mongoose from 'mongoose';
import db from './config/database.js';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';
import { createResourceRouter } from './routes/resourceRouter.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
export const baseUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());
app.use((_request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_ORIGIN ?? '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (_request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }
  next();
});

app.use('/api/users/', createResourceRouter(User));
app.use('/api/teams/', createResourceRouter(Team));
app.use('/api/activities/', createResourceRouter(Activity));
app.use('/api/leaderboard/', createResourceRouter(Leaderboard));
app.use('/api/workouts/', createResourceRouter(Workout));

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: db.readyState === 1 ? 'connected' : 'connecting',
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const status = error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError
    ? 400
    : typeof error === 'object' && error !== null && 'code' in error && error.code === 11000
      ? 409
      : 500;
  response.status(status).json({
    error: status === 500 ? 'Internal server error' : error instanceof Error ? error.message : 'Invalid request',
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening on port ${port}`);
});