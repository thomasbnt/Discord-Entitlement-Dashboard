<script setup lang="ts">
import type { Entitlement } from '~/stores/entitlements'
import { ENTITLEMENT_TYPES } from '~/utils/entitlementTypes'

const store = useEntitlementsStore()
const skusStore = useSkusStore()
const toast = useToast()
const deleteTarget = ref<string | null>(null)
const deleteOpen = ref(false)

// Bulk delete
const selected = ref<Set<string>>(new Set())
const bulkConfirm = ref(false)
const bulkLoading = ref(false)

const deletableIds = computed(() =>
  store.items.filter(e => e.type === 4 || !e.starts_at).map(e => e.id)
)
const allSelected = computed(() =>
  deletableIds.value.length > 0 && deletableIds.value.every(id => selected.value.has(id))
)

function toggleAll() {
  if (allSelected.value) {
    selected.value = new Set()
  } else {
    selected.value = new Set(deletableIds.value)
  }
}

function toggleRow(id: string) {
  const s = new Set(selected.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selected.value = s
}

async function bulkDelete() {
  bulkLoading.value = true
  try {
    await store.bulkRemove([...selected.value])
    toast.add({ title: `Deleted ${selected.value.size} entitlements`, color: 'success', duration: 3000 })
    selected.value = new Set()
    bulkConfirm.value = false
  } catch (e: any) {
    toast.add({ title: 'Bulk delete failed', description: e.data?.data?.message ?? e.message, color: 'error', duration: 4000 })
  } finally {
    bulkLoading.value = false
  }
}

async function copyId(id: string) {
  await navigator.clipboard.writeText(id)
  toast.add({ title: 'Copied', description: id, color: 'success', duration: 2000 })
}

const hasActiveFilters = computed(() =>
  !!store.filters.guild_id ||
  !!store.filters.user_id ||
  !!store.filters.sku_ids ||
  store.filters.exclude_ended ||
  store.filters.exclude_deleted
)

const now = new Date()

function statusColor(e: Entitlement): string {
  if (e.deleted) return 'bg-red-500'
  if (e.ends_at && new Date(e.ends_at) <= now) return 'bg-gray-500'
  if (e.type === 4 || !e.starts_at) return 'bg-yellow-400'
  return 'bg-green-500'
}

const columns = [
  { id: 'select', header: 'select' },
  { id: 'status', header: '' },
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'type', header: 'Type', enableSorting: true },
  { accessorKey: 'guild_id', header: 'Target' },
  { accessorKey: 'sku_id', header: 'SKU', enableSorting: true },
  { accessorKey: 'starts_at', header: 'Start', enableSorting: true },
  { accessorKey: 'ends_at', header: 'End', enableSorting: true },
  { id: 'actions', header: '' },
]

const rows = computed(() =>
  store.items.map((e: Entitlement) => ({
    ...e,
    _deletable: e.type === 4 || e.type === 3 || !e.starts_at,
    _statusColor: statusColor(e),
    starts_at: e.starts_at ? new Date(e.starts_at).toLocaleDateString('en-GB') : '—',
    ends_at: e.ends_at ? new Date(e.ends_at).toLocaleDateString('en-GB') : '—',
  }))
)

function openDelete(id: string) {
  deleteTarget.value = id
  deleteOpen.value = true
}

function getRow(row: any) {
  return row.original ?? row
}
</script>

<template>
  <div class="space-y-3">
    <!-- Bulk action bar -->
    <Transition name="slide-down">
      <div v-if="selected.size > 0" class="flex items-center gap-3 p-3 rounded-lg bg-gray-800 border border-gray-700">
        <span class="text-sm text-gray-300">{{ selected.size }} selected</span>
        <template v-if="!bulkConfirm">
          <UButton color="error" variant="outline" size="sm" icon="i-heroicons-trash" @click="bulkConfirm = true">
            Delete selected
          </UButton>
          <UButton variant="ghost" color="neutral" size="sm" @click="selected = new Set()">Clear</UButton>
        </template>
        <template v-else>
          <span class="text-sm text-red-400 font-medium">Delete {{ selected.size }} test entitlements?</span>
          <UButton color="error" size="sm" :loading="bulkLoading" @click="bulkDelete">Confirm</UButton>
          <UButton variant="ghost" color="neutral" size="sm" @click="bulkConfirm = false">Cancel</UButton>
        </template>
      </div>
    </Transition>

    <UTable :data="rows" :columns="columns" :loading="store.loading">
      <template #empty>
        <div class="flex flex-col items-center gap-3 py-10 text-gray-400">
          <UIcon name="i-heroicons-inbox" class="text-4xl" />
          <div class="text-center space-y-1">
            <p class="font-medium text-gray-300">
              {{ hasActiveFilters ? 'No entitlements match your filters' : 'No entitlements yet' }}
            </p>
            <p class="text-sm">
              {{ hasActiveFilters ? 'Try adjusting the filters above.' : 'Create a test entitlement to get started.' }}
            </p>
          </div>
        </div>
      </template>

      <template #select-header>
        <UCheckbox
          v-if="deletableIds.length > 0"
          :model-value="allSelected"
          @update:model-value="toggleAll"
        />
      </template>

      <template #select-cell="{ row }">
        <UCheckbox
          v-if="getRow(row)._deletable"
          :model-value="selected.has(getRow(row).id)"
          @update:model-value="toggleRow(getRow(row).id)"
        />
      </template>

      <template #status-cell="{ row }">
        <div class="w-1 h-8 rounded-full" :class="getRow(row)._statusColor" />
      </template>

      <template #type-cell="{ row }">
        <UBadge :color="ENTITLEMENT_TYPES[getRow(row).type]?.color ?? 'neutral'" variant="subtle">
          {{ ENTITLEMENT_TYPES[getRow(row).type]?.label ?? `Type ${getRow(row).type}` }}
        </UBadge>
      </template>

      <template #guild_id-cell="{ row }">
        <GuildBadge v-if="getRow(row).guild_id" :guild-id="getRow(row).guild_id" />
        <UTooltip v-else-if="getRow(row).user_id" text="Click to copy ID">
          <UBadge color="neutral" variant="outline" class="cursor-pointer" @click="copyId(getRow(row).user_id)">
            {{ getRow(row).user_id }}
          </UBadge>
        </UTooltip>
        <span v-else class="text-gray-400">—</span>
      </template>

      <template #sku_id-cell="{ row }">
        <UTooltip :text="getRow(row).sku_id">
          <span class="cursor-default">
            {{ skusStore.getById(getRow(row).sku_id)?.name ?? getRow(row).sku_id }}
          </span>
        </UTooltip>
      </template>

      <template #actions-cell="{ row }">
        <UButton
          v-if="getRow(row)._deletable"
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          @click="openDelete(getRow(row).id)"
        />
      </template>
    </UTable>

    <div v-if="store.hasMore" class="flex justify-center pt-2">
      <UButton
        variant="outline"
        color="neutral"
        size="sm"
        :loading="store.loadingMore"
        @click="store.fetchMore()"
      >
        Load more
      </UButton>
    </div>
  </div>

  <DeleteDialog
    v-if="deleteTarget"
    v-model:open="deleteOpen"
    :entitlement-id="deleteTarget"
    @closed="deleteTarget = null"
  />
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
