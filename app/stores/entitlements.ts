export interface Entitlement {
  id: string
  sku_id: string
  application_id: string
  user_id?: string
  guild_id?: string
  type: number
  deleted: boolean
  consumed?: boolean
  starts_at?: string
  ends_at?: string
}

export interface EntitlementFilters {
  guild_id: string
  user_id: string
  sku_ids: string | null
  exclude_ended: boolean
  exclude_deleted: boolean
}

const STORAGE_KEY = 'entitlement_filters'

function loadPersistedFilters(): Partial<EntitlementFilters> {
  if (!import.meta.client) return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return {
      sku_ids: typeof parsed.sku_ids === 'string' ? parsed.sku_ids : null,
      exclude_ended: typeof parsed.exclude_ended === 'boolean' ? parsed.exclude_ended : true,
      exclude_deleted: typeof parsed.exclude_deleted === 'boolean' ? parsed.exclude_deleted : false,
    }
  } catch {
    return {}
  }
}

export const useEntitlementsStore = defineStore('entitlements', () => {
  const items = ref<Entitlement[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const persisted = loadPersistedFilters()
  const filters = ref<EntitlementFilters>({
    guild_id: '',
    user_id: '',
    sku_ids: persisted.sku_ids ?? null,
    exclude_ended: persisted.exclude_ended ?? true,
    exclude_deleted: persisted.exclude_deleted ?? false,
  })

  if (import.meta.client) {
    watch(
      () => ({
        sku_ids: filters.value.sku_ids,
        exclude_ended: filters.value.exclude_ended,
        exclude_deleted: filters.value.exclude_deleted,
      }),
      (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
      { deep: true }
    )
  }

  async function fetch() {
    const discord = useDiscord()
    loading.value = true
    error.value = null
    try {
      const params: Record<string, string | boolean> = {}
      if (filters.value.guild_id) params.guild_id = filters.value.guild_id
      if (filters.value.user_id) params.user_id = filters.value.user_id
      if (filters.value.sku_ids) params.sku_ids = filters.value.sku_ids
      if (filters.value.exclude_ended) params.exclude_ended = true
      if (filters.value.exclude_deleted) params.exclude_deleted = true
      items.value = (await discord.getEntitlements(params)) as Entitlement[]
    } catch (e: any) {
      error.value = e.statusMessage ?? e.message ?? 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    const discord = useDiscord()
    await discord.deleteEntitlement(id)
    items.value = items.value.filter(e => e.id !== id)
  }

  async function createTest(body: { sku_id: string; owner_id: string; owner_type: 1 | 2 }) {
    const discord = useDiscord()
    const created = (await discord.createTestEntitlement(body)) as Entitlement
    items.value.unshift(created)
  }

  async function bulkRemove(ids: string[]) {
    const discord = useDiscord()
    await Promise.all(ids.map(id => discord.deleteEntitlement(id)))
    items.value = items.value.filter(e => !ids.includes(e.id))
  }

  return { items, loading, error, filters, fetch, remove, createTest, bulkRemove }
})
