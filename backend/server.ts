import 'dotenv/config';
import express from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const dataFile = path.join(process.cwd(), 'data', 'projects.json');

app.use(express.json());

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }
  next();
});

app.get('/api/health', (_request, response) => {
  response.json({status: 'ok'});
});

app.get('/api/projects', async (_request, response) => {
  try {
    const contents = await fs.readFile(dataFile, 'utf8');
    response.json(JSON.parse(contents));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      response.json([]);
      return;
    }
    response.status(500).json({error: 'Unable to load projects'});
  }
});

app.put('/api/projects', async (request, response) => {
  try {
    if (!Array.isArray(request.body)) {
      response.status(400).json({error: 'Projects payload must be an array'});
      return;
    }
    await fs.mkdir(path.dirname(dataFile), {recursive: true});
    await fs.writeFile(dataFile, JSON.stringify(request.body, null, 2), 'utf8');
    response.json({status: 'ok'});
  } catch {
    response.status(500).json({error: 'Unable to save projects'});
  }
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
