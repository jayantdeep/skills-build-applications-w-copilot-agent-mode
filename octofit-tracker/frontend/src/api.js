export const apiBase = (() => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const fallback = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';

  return (import.meta.env.VITE_API_BASE_URL || fallback).replace(/\/$/, '');
})();

export async function fetchResource(path, options = {}) {
  const { method = 'GET', body } = options;
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || `Request failed for ${path}: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export { fetchResource as fetch };

export const saveResource = (path, value, id) =>
  fetchResource(id ? `${path}${id}` : path, {
    method: id ? 'PUT' : 'POST',
    body: value,
  });

export const deleteResource = (path, id) =>
  fetchResource(`${path}${id}`, { method: 'DELETE' });

export const endpoints = [
  '/api/activities/',
  '/api/leaderboard/',
  '/api/teams/',
  '/api/users/',
  '/api/workouts/',
];
