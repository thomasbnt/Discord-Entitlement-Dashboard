interface Guild {
  id: string
  name: string
  icon: string | null
}

// Cache guild info for the session to avoid redundant API calls
const guildCache = new Map<string, Guild>()

export function useDiscord() {
  const auth = useAuthStore()

  function apiFetch<T>(path: string, options: Record<string, any> = {}): Promise<T> {
    return $fetch<T>(`/api/discord/${path}`, {
      headers: { 'x-discord-token': auth.token },
      ...options,
    })
  }

  return {
    getEntitlements: (params?: Record<string, any>) =>
      apiFetch<any[]>(`applications/${auth.appId}/entitlements`, { query: params }),

    deleteEntitlement: (id: string) =>
      apiFetch<void>(`applications/${auth.appId}/entitlements/${id}`, { method: 'DELETE' }),

    createTestEntitlement: (body: { sku_id: string; owner_id: string; owner_type: 1 | 2 }) =>
      apiFetch<any>(`applications/${auth.appId}/entitlements`, { method: 'POST', body }),

    getSkus: () =>
      apiFetch<any[]>(`applications/${auth.appId}/skus`),

    getGuild: async (guildId: string): Promise<Guild> => {
      if (guildCache.has(guildId)) return guildCache.get(guildId)!

      // Try bot-member endpoint first
      try {
        const guild = await apiFetch<Guild>(`guilds/${guildId}`)
        guildCache.set(guildId, guild)
        return guild
      } catch {}

      // Fallback: public widget endpoint (no membership required, works if widget enabled)
      try {
        const widget = await apiFetch<{ id: string; name: string }>(`guilds/${guildId}/widget.json`)
        const result: Guild = { id: guildId, name: widget.name, icon: null }
        guildCache.set(guildId, result)
        return result
      } catch {}

      throw new Error(`Guild ${guildId} not accessible`)
    },
  }
}
