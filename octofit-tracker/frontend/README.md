# OctoFit Tracker frontend

The React 19 and Vite presentation tier uses React Router for navigation and reads
the users, teams, activities, leaderboard, and workout APIs.

## API configuration

For the frontend to reach the backend through a GitHub Codespace, define
`VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local`:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Copy `.env.example` as a starting point and replace the example with the value
of the `CODESPACE_NAME` environment variable. Vite exposes only variables with
the `VITE_` prefix to browser code. Restart the Vite development server after
changing `.env.local`.

When `VITE_CODESPACE_NAME` is unset, the API client safely falls back to
`http://localhost:8000`, which is suitable when the backend runs locally.
`VITE_API_BASE_URL` can optionally override the computed API origin.

## Development commands

Run commands from the repository root without changing directories:

```bash
npm --prefix octofit-tracker/frontend run dev
npm --prefix octofit-tracker/frontend run build
npm --prefix octofit-tracker/frontend run lint
```
