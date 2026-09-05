import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();

const port = Number(process.env.PORT) || 4000;

const dataDirectory = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDirectory, 'projects.json');

/*
 * ---------------------------------------------------------
 * Middleware
 * ---------------------------------------------------------
 */

app.use(express.json({ limit: '10mb' }));

// CORS
app.use((_request: Request, response: Response, next: NextFunction) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );

  if (_request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

/*
 * ---------------------------------------------------------
 * Health / Root
 * ---------------------------------------------------------
 */

app.get('/', (_request: Request, response: Response) => {
  response.json({
    status: 'ok',
    service: 'LPS Tool Backend',
    message: 'Backend is running'
  });
});

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({
    status: 'ok'
  });
});

/*
 * ---------------------------------------------------------
 * Projects API
 * ---------------------------------------------------------
 */

// GET all projects
app.get('/api/projects', async (_request: Request, response: Response) => {
  try {
    const contents = await fs.readFile(dataFile, 'utf8');
    const projects = JSON.parse(contents);

    if (!Array.isArray(projects)) {
      response.status(500).json({
        error: 'Invalid projects data'
      });
      return;
    }

    response.json(projects);
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? (error as { code?: string }).code
        : undefined;

    // No projects file yet = empty database for now
    if (code === 'ENOENT') {
      response.json([]);
      return;
    }

    console.error('Unable to load projects:', error);

    response.status(500).json({
      error: 'Unable to load projects'
    });
  }
});

// PUT / replace all projects
app.put('/api/projects', async (request: Request, response: Response) => {
  try {
    if (!Array.isArray(request.body)) {
      response.status(400).json({
        error: 'Projects payload must be an array'
      });
      return;
    }

    await fs.mkdir(dataDirectory, {
      recursive: true
    });

    await fs.writeFile(
      dataFile,
      JSON.stringify(request.body, null, 2),
      'utf8'
    );

    response.json({
      status: 'ok',
      count: request.body.length
    });
  } catch (error) {
    console.error('Unable to save projects:', error);

    response.status(500).json({
      error: 'Unable to save projects'
    });
  }
});

/*
 * ---------------------------------------------------------
 * Error handler
 * ---------------------------------------------------------
 */

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction
  ) => {
    console.error('Unhandled server error:', error);

    response.status(500).json({
      error: 'Internal server error'
    });
  }
);

/*
 * ---------------------------------------------------------
 * Start server
 * ---------------------------------------------------------
 */

app.listen(port, () => {
  console.log(`LPS Tool Backend listening on http://localhost:${port}`);
  console.log(`Data file: ${dataFile}`);
});