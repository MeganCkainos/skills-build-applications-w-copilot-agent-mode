// Backend responses may be a plain array or a paginated object ({ results: [...] }).
export function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}
