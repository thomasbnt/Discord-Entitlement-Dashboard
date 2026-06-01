// Allowlist of permitted Discord API paths and their allowed HTTP methods.
// Prevents using this proxy as an open relay to arbitrary Discord endpoints.
const ALLOWED: Array<{ pattern: RegExp; methods: string[] }> = [
  { pattern: /^applications\/\d+\/entitlements$/, methods: ['GET', 'POST'] },
  { pattern: /^applications\/\d+\/entitlements\/\d+$/, methods: ['GET', 'DELETE'] },
  { pattern: /^applications\/\d+\/skus$/, methods: ['GET'] },
  { pattern: /^guilds\/\d+$/, methods: ['GET'] },
  { pattern: /^guilds\/\d+\/widget\.json$/, methods: ['GET'] },
]

function isAllowed(path: string, method: string): boolean {
  return ALLOWED.some(
    ({ pattern, methods }) => pattern.test(path) && methods.includes(method)
  )
}

// Loose Discord bot token shape: base64.timestamp.hmac — at least 50 chars,
// only valid token characters.
function isValidToken(token: string): boolean {
  return /^[\w.-]{50,200}$/.test(token)
}

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') ?? ''
  const method = event.method.toUpperCase()
  const token = getHeader(event, 'x-discord-token') ?? ''

  // Reject empty or malformed tokens early
  if (!isValidToken(token)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or missing Discord token' })
  }

  // Prevent path traversal
  if (path.includes('..') || path.includes('%2e')) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid path' })
  }

  // Enforce path + method allowlist
  if (!isAllowed(path, method)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden path or method' })
  }

  try {
    return await $fetch(`https://discord.com/api/v10/${path}`, {
      method: method as 'GET' | 'POST' | 'DELETE',
      headers: { 'Authorization': `Bot ${token}` },
      query: getQuery(event),
      body: method === 'POST' ? await readBody(event) : undefined,
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.status ?? 500,
      statusMessage: error.statusText ?? 'Discord API error',
      data: error.data,
    })
  }
})
