// HIGH-2: sanitize user-submitted URLs before rendering them as an href.
// Returns the URL string only if it parses as an absolute http: or https:
// URL; otherwise returns null. This blocks dangerous schemes such as
// javascript:, data:, vbscript:, file:, etc., and rejects relative URLs.
export function safeHttpUrl(raw) {
  if (typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const url = new URL(trimmed)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return trimmed
    }
    return null
  } catch {
    return null
  }
}
