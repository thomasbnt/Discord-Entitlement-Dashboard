<script setup lang="ts">
const store = useEntitlementsStore()
const skusStore = useSkusStore()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => ({ ...store.filters }),
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => store.fetch(), 350)
  },
  { deep: true }
)

function downloadCSV() {
  const escape = (v: string | boolean | number | undefined | null) => {
    if (v === undefined || v === null) return ''
    const s = String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }

  const headers = ['id', 'type', 'sku_id', 'sku_name', 'user_id', 'guild_id', 'deleted', 'consumed', 'starts_at', 'ends_at']
  const rows = store.items.map(e => [
    escape(e.id),
    escape(e.type),
    escape(e.sku_id),
    escape(skusStore.getById(e.sku_id)?.name ?? ''),
    escape(e.user_id),
    escape(e.guild_id),
    escape(e.deleted),
    escape(e.consumed),
    escape(e.starts_at),
    escape(e.ends_at),
  ].join(','))

  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `entitlements-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <UCard>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UFormField label="Guild ID">
        <UInput
          v-model="store.filters.guild_id"
          placeholder="Server ID"
          class="w-full"
        />
      </UFormField>

      <UFormField label="User ID">
        <UInput
          v-model="store.filters.user_id"
          placeholder="User ID"
          class="w-full"
        />
      </UFormField>

      <UFormField label="SKU">
        <div class="flex gap-1 w-full">
          <USelect
            v-model="store.filters.sku_ids"
            :items="skusStore.selectItems"
            value-key="value"
            :loading="skusStore.loading"
            placeholder="All SKUs"
            class="flex-1"
          />
          <UButton
            v-if="store.filters.sku_ids"
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="store.filters.sku_ids = null"
          />
        </div>
      </UFormField>

      <div class="flex flex-col gap-3 justify-end">
        <UCheckbox v-model="store.filters.exclude_ended" label="Hide expired" />
        <UCheckbox v-model="store.filters.exclude_deleted" label="Hide deleted" />
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <p class="text-xs text-gray-500">{{ store.items.length }} entitlement{{ store.items.length !== 1 ? 's' : '' }}</p>
      <div class="flex gap-2">
        <UButton
          icon="i-heroicons-arrow-down-tray"
          variant="ghost"
          color="neutral"
          size="sm"
          :disabled="store.items.length === 0 || store.loading"
          @click="downloadCSV"
        >
          CSV
        </UButton>
        <UButton
          icon="i-heroicons-arrow-path"
          variant="ghost"
          color="neutral"
          size="sm"
          :loading="store.loading"
          @click="store.fetch()"
        />
      </div>
    </div>
  </UCard>
</template>
