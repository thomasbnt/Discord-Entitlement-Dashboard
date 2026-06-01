<script setup lang="ts">
const store = useEntitlementsStore()

const now = new Date()

const stats = computed(() => {
  const items = store.items
  const total = items.length
  const active = items.filter(e =>
    !e.deleted && (!e.ends_at || new Date(e.ends_at) > now)
  ).length
  const expired = items.filter(e =>
    e.ends_at && new Date(e.ends_at) <= now
  ).length
  const test = items.filter(e => e.type === 4 || e.type === 3 || !e.starts_at).length

  return { total, active, expired, test }
})

const TYPE_COLORS: Record<number, string> = {
  1: 'bg-green-500',
  2: 'bg-primary-500',
  3: 'bg-blue-400',
  4: 'bg-yellow-400',
  5: 'bg-cyan-400',
  6: 'bg-gray-400',
  7: 'bg-primary-700',
  8: 'bg-primary-400',
}

const TYPE_LABELS: Record<number, string> = {
  1: 'Purchase',
  2: 'Premium Sub',
  3: 'Dev Gift',
  4: 'Test',
  5: 'Free',
  6: 'User Gift',
  7: 'Premium Purchase',
  8: 'App Subscription',
}

const typeBreakdown = computed(() => {
  const total = store.items.length
  if (total === 0) return []
  const counts: Record<number, number> = {}
  for (const e of store.items) {
    counts[e.type] = (counts[e.type] ?? 0) + 1
  }
  return Object.entries(counts).map(([type, count]) => ({
    type: Number(type),
    count,
    pct: Math.round((count / total) * 100),
    color: TYPE_COLORS[Number(type)] ?? 'bg-gray-500',
    label: TYPE_LABELS[Number(type)] ?? `Type ${type}`,
  })).sort((a, b) => b.count - a.count)
})
</script>

<template>
  <UCard v-if="store.items.length > 0">
    <div class="space-y-5">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-3xl font-bold">{{ stats.total }}</p>
          <p class="text-sm text-gray-400 mt-1">Total</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-green-400">{{ stats.active }}</p>
          <p class="text-sm text-gray-400 mt-1">Active</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-yellow-400">{{ stats.test }}</p>
          <p class="text-sm text-gray-400 mt-1">Test</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-gray-500">{{ stats.expired }}</p>
          <p class="text-sm text-gray-400 mt-1">Expired</p>
        </div>
      </div>

      <div v-if="typeBreakdown.length > 0" class="space-y-2">
        <div class="flex h-3 rounded-full overflow-hidden gap-px">
          <div
            v-for="seg in typeBreakdown"
            :key="seg.type"
            :class="seg.color"
            :style="{ width: seg.pct + '%' }"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <div v-for="seg in typeBreakdown" :key="seg.type" class="flex items-center gap-1.5">
            <span class="inline-block w-2.5 h-2.5 rounded-full shrink-0" :class="seg.color" />
            <span class="text-xs text-gray-400">{{ seg.label }} ({{ seg.count }})</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
