# Deployment

The repository is deployable as one container. The Express backend serves the
compiled Vite frontend and the `/api/*` endpoints from the same origin.

## Required environment variables

Set these as deployment secrets or environment variables:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```

Optional variables:

```text
PORT=4000
CORS_ORIGIN=*
VITE_API_BASE_URL=
```

Keep `VITE_API_BASE_URL` empty for the single-container deployment. It is a
build-time variable; set it to the public API origin only when deploying the
frontend and backend as separate services.

## Docker

Build and run locally:

```bash
docker build -t lps-tool .
docker run --rm -p 4000:4000 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SECRET_KEY="your-supabase-service-role-key" \
  lps-tool
```

The application is available at `http://localhost:4000` and the health check
is available at `http://localhost:4000/api/health`.

## Without Docker

```bash
npm ci
npm --prefix frontend ci
npm --prefix backend ci
npm run build
npm start
```

The process listens on `PORT` and defaults to `4000`.