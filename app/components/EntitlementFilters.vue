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

    <div class="mt-4 flex justify-end">
      <UButton
        icon="i-heroicons-arrow-path"
        variant="ghost"
        color="neutral"
        size="sm"
        :loading="store.loading"
        @click="store.fetch()"
      />
    </div>
  </UCard>
</template>
