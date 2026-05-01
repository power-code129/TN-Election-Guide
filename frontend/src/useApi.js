const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Network error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  health:        () => apiFetch('/health'),
  timeline:      () => apiFetch('/timeline'),
  faq:           () => apiFetch('/faq'),
  myths:         () => apiFetch('/myths'),
  election_types:() => apiFetch('/election-types'),
  free_tools:    () => apiFetch('/free-tools'),
  chat: (message, language = 'en') =>
    apiFetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, language }),
    }),
}
