// Requires VITE_CODESPACE_NAME to be defined (for example in .env.local) so the
// frontend can reach the backend's forwarded Codespaces port. Falls back to
// localhost when it is unset to avoid producing "https://undefined-8000..." URLs.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api'

// Backend responses may be a plain array or a paginated object ({ results: [...] }).
export function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}
