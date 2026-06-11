export interface Sku {
  id: string
  application_id: string
  type: number
  name: string
  slug: string
  flags?: number
}

export const useSkusStore = defineStore('skus', () => {
  const items = ref<Sku[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    const discord = useDiscord()
    loading.value = true
    error.value = null
    try {
      items.value = (await discord.getSkus()) as Sku[]
    } catch (e: any) {
      error.value = e.statusMessage ?? e.message ?? 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function getById(id: string): Sku | undefined {
    return items.value.find(s => s.id === id)
  }

  const selectItems = computed(() =>
    items.value
      .filter(s => s.type !== 6)
      .map(s => ({ label: s.name, value: s.id }))
  )

  return { items, loading, error, fetch, getById, selectItems }
})
